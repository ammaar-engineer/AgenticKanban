# Kanban Layers Controller Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Create a KanbanLayer controller with a `POST /create` endpoint to add layers to a kanban board.

**Architecture:** Hono router with Zod validation via `@hono/zod-validator`, TypeORM repository for `KanbanLayer` entity, `StandardJsonResponse` for consistent JSON output. Register route in `server/src/index.ts`.

**Tech Stack:** Hono, Zod, TypeORM, TypeScript, `@hono/zod-validator`

---

## Context & Assumptions

- The file `server/src/routes/kanban.layers/controllers.ts` already exists but is empty.
- The entity `KanbanLayer` has: `id` (uuid PK), `name` (varchar 255), `boardId` (uuid FK to KanbanBoard), `board` (ManyToOne), `kanbanAgents` (OneToMany).
- The existing pattern (see `kanban.boards/controllers.ts`): Hono router exported as named const, repo initialized at module level, zValidator for POST validation, `StandardJsonResponse` for all responses.
- The `boardId` is required to associate the layer with a board. The board must exist (TypeORM FK constraint will enforce this).

---

## Step-by-Step Plan

### Task 1: Implement the kanban layers controller

**Objective:** Write the controller with `POST /create` endpoint.

**Files:**
- Modify: `server/src/routes/kanban.layers/controllers.ts`

**Step 1: Write the controller code**

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { KanbanLayer } from "../../entities/kanban-layer.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const kanbanLayers = new Hono();
const layerRepo = AppDataSource.getRepository(KanbanLayer);

kanbanLayers.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string().min(1, "Name is required"),
      board_id: z.string().uuid("Valid board ID is required"),
    }),
  ),
  async c => {
    const { name, board_id } = c.req.valid("form");
    try {
      await layerRepo.save(layerRepo.create({ name, boardId: board_id }));
    } catch {
      console.log("Error creating kanban layer");
    }
    console.log("Kanban layer has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban layer has been created",
      }),
    );
  },
);
```

**Step 2: Verify TypeScript compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No new errors (pre-existing entity TS2564 errors are expected)

---

### Task 2: Register the route in the main app

**Objective:** Import and mount the kanban layers router in `server/src/index.ts`.

**Files:**
- Modify: `server/src/index.ts`

**Step 1: Add import after the existing kanbanBoards import**

Add this import at line 9 (after the kanbanBoards import):

```typescript
import { kanbanLayers } from "./routes/kanban.layers/controllers.js";
```

**Step 2: Add route registration after the existing routes**

Add this route after `app.route("/kanban-boards", kanbanBoards);` (line 26):

```typescript
app.route("/kanban-layers", kanbanLayers);
```

**Step 3: Verify TypeScript compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No new errors

---

### Task 3: Commit

```bash
git add server/src/routes/kanban.layers/controllers.ts server/src/index.ts
git commit -m "feat: add kanban layers controller with create endpoint"
```

---

## Files Changed Summary

| File | Action |
|---|---|
| `server/src/routes/kanban.layers/controllers.ts` | Write (was empty) |
| `server/src/index.ts` | Modify (add import + route) |

## Verification

1. `cd server && npx tsc --noEmit` — no new type errors
2. Server starts without errors on port 3000
3. `POST /kanban-layers/create` creates a layer with valid `board_id`
4. Validation: sending empty `name` or invalid `board_id` should fail Zod validation

## Notes

- The `board_id` field in the form maps to `boardId` in the entity (TypeORM naming strategy).
- UUID validation on `board_id` ensures only valid UUIDs are accepted.
- The FK constraint on `board_id` will throw if the board doesn't exist — the catch block handles this gracefully.
