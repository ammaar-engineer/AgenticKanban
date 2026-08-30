# Migrate Zod to Superstruct — Server Validation

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace all `@hono/zod-validator` + Zod validation in server controllers with `superstruct` + Hono's built-in `validator`.

**Architecture:** Create a shared `structValidator(schema)` helper using Hono's `validator('form', ...)` that runs `superstruct.validate()`. Each controller defines its schema inline with superstruct primitives. Remove `zod` and `@hono/zod-validator` dependencies.

**Tech Stack:** superstruct, hono/validator, Hono

---

## Current State — Zod schemas per controller

| Controller | Route | Fields |
|---|---|---|
| `agents/controllers.ts` | POST /create | `name: str`, `model_id: str`, `personality?: str`, `description?: str`, `provider_id: str(uuid)` |
| `providers/controllers.ts` | POST /create | `name: str`, `url: str`, `apiKey: str` |
| `kanban.boards/controllers.ts` | POST /create | `name: str(min1)`, `description?: str` |
| `kanban.layers/controllers.ts` | POST /create | `name: str(min1)`, `board_id: str(uuid)` |
| `kanban.agents/controllers.ts` | POST /create | `name: str(min1)`, `layers_id: str(uuid)`, `agents_id: str(uuid)`, `board_id: str(uuid)` |

All controllers import `zValidator` from `@hono/zod-validator` and `z` from `zod`. Only these 5 files use them — safe to remove both deps after migration.

---

## Step 1: Install superstruct

```bash
cd server && npm install superstruct
```

---

## Step 2: Create shared validation utility

**Create:** `server/src/utils/struct-validator.ts`

```ts
import { validator } from "hono/validator";
import { define, validate, type Struct } from "superstruct";

/**
 * Reusable UUID struct (superstruct has no built-in UUID type).
 */
export const UUID = define<string>(
  "UUID",
  (value) =>
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    ),
);

/**
 * Hono form-validator backed by a superstruct schema.
 *
 * Usage:
 *   router.post('/create', structValidator(MySchema), handler)
 */
export function structValidator<T>(schema: Struct<T>) {
  return validator("form", (value, c) => {
    const [error, data] = validate(value, schema);
    if (error) {
      return c.json(
        {
          data: null,
          errorCode: "VALIDATION_ERROR",
          message: error.message,
          statusCode: 400,
          success: false,
        },
        400,
      );
    }
    return data;
  });
}
```

**Why `import type { Struct }`:** tsconfig has `verbatimModuleSyntax: true`. `Struct` is used only as a type in the function signature, so it must be `import type`.

---

## Step 3: Migrate each controller (5 files)

Each controller follows the same transformation:

**Before (zod pattern):**
```ts
import { zValidator } from "@hono/zod-validator";
import z from "zod";

router.post("/create", zValidator("form", z.object({ ... })), handler)
```

**After (superstruct pattern):**
```ts
import { object, string, optional } from "superstruct";
import { structValidator, UUID } from "../../utils/struct-validator.js";

router.post("/create", structValidator(object({ ... })), handler)
```

### 3a: agents/controllers.ts

**Schema fields:**
- `name: string()` — required
- `model_id: string()` — required
- `personality: optional(string())` — optional
- `description: optional(string())` — optional
- `provider_id: UUID` — required UUID

**Remove:** `import { zValidator } from "@hono/zod-validator"` and `import z from "zod"`
**Add:** `import { object, string, optional } from "superstruct"` and `import { structValidator, UUID } from "../../utils/struct-validator.js"`

### 3b: providers/controllers.ts

**Schema fields:**
- `name: string()` — required
- `url: string()` — required
- `apiKey: string()` — required

**Remove:** zValidator + z imports
**Add:** `import { object, string } from "superstruct"` and `import { structValidator } from "../../utils/struct-validator.js"`

### 3c: kanban.boards/controllers.ts

**Schema fields:**
- `name: string()` — required (min(1) not needed, empty string is valid input; if needed, add refinement)
- `description: optional(string())` — optional

**Remove:** zValidator + z imports
**Add:** `import { object, string, optional } from "superstruct"` and `import { structValidator } from "../../utils/struct-validator.js"`

### 3d: kanban.layers/controllers.ts

**Schema fields:**
- `name: string()` — required
- `board_id: UUID` — required UUID

**Remove:** zValidator + z imports
**Add:** `import { object, string } from "superstruct"` and `import { structValidator, UUID } from "../../utils/struct-validator.js"`

### 3e: kanban.agents/controllers.ts

**Schema fields:**
- `name: string()` — required
- `layers_id: UUID` — required UUID
- `agents_id: UUID` — required UUID
- `board_id: UUID` — required UUID

**Remove:** zValidator + z imports
**Add:** `import { object, string } from "superstruct"` and `import { structValidator, UUID } from "../../utils/struct-validator.js"`

---

## Step 4: Remove unused dependencies

```bash
cd server && npm uninstall @hono/zod-validator zod
```

Verify no remaining imports:

```bash
grep -r "zod" server/src/
```

Expected: no matches.

---

## Step 5: Type check + build

```bash
cd server && npx tsc --noEmit
```

Expected: no errors.

---

## Step 6: Manual smoke test

```bash
cd server && npm run dev
```

Test each POST /create endpoint with valid and invalid data (e.g. missing required field, invalid UUID). Verify 400 response with `VALIDATION_ERROR` errorCode for invalid input.

---

## Files to change

| Action | File |
|---|---|
| Create | `server/src/utils/struct-validator.ts` |
| Modify | `server/src/routes/agents/controllers.ts` |
| Modify | `server/src/routes/providers/controllers.ts` |
| Modify | `server/src/routes/kanban.boards/controllers.ts` |
| Modify | `server/src/routes/kanban.layers/controllers.ts` |
| Modify | `server/src/routes/kanban.agents/controllers.ts` |
| Modify | `server/package.json` (npm install/uninstall) |

---

## Open questions

1. **min(1) validation** — Zod schemas for boards/layers/kanban-agents use `z.string().min(1)`. Superstruct `string()` allows empty strings. Options:
   - a) Add a `nonempty` refinement to `structValidator` or as a custom struct
   - b) Keep `string()` as-is (empty name = bad input but not crash)
   - c) Add refinement inline: `define('NonEmptyString', v => typeof v === 'string' && v.length > 0)`

   Recommendation: add `NonEmptyString` struct in `struct-validator.ts` for consistency with current behavior.

2. **Error message format** — Zod produces field-level errors. Superstruct's `error.message` is a single string. Current plan returns one message, not per-field. Acceptable since the frontend doesn't parse field errors today.
