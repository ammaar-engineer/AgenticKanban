# Fix agents_id Type Mismatch — UUID vs Integer

## Goal

Fix the `POST /kanban-agents/create` 400 VALIDATION_ERROR where `agents_id` receives `"1"` (integer string) but server validates it as UUID format.

## Root Cause

`Agent` entity uses `@PrimaryGeneratedColumn()` → integer auto-increment PK (`id: number`).

`KanbanAgent` entity declares `agents_id` as `type: 'uuid'` → expects UUID format like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

Server validation uses superstruct `UUID` type which enforces UUID regex.

Client sends `String(at.id)` → `"1"` → fails UUID validation.

**The FK column type doesn't match the referenced table's PK type.**

## Approach

Change `kanban_agents.agents_id` column from `uuid` to `int` to match `Agent.id` (integer). Update validation accordingly. Client code is already correct (`String(at.id)` works for both).

SQLite with `synchronize: true` handles type affinity changes gracefully — no manual migration needed.

## Files to Change

1. `server/src/entities/kanban-agent.entity.ts:23` — column type `uuid` → `int`
2. `server/src/routes/kanban.agents/controllers.ts:18,29` — validation `UUID` → `string()`, convert to number before save

## Step-by-Step Plan

### Task 1: Fix KanbanAgent entity column type

**Objective:** Change `agents_id` column from UUID to integer type.

**Files:**
- Modify: `server/src/entities/kanban-agent.entity.ts:23`

**Step 1: Change column type**

Change line 23 from:
```typescript
@Column({ name: 'agents_id', type: 'uuid' })
```
To:
```typescript
@Column({ name: 'agents_id', type: 'int' })
```

**Step 2: Verify entity compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add server/src/entities/kanban-agent.entity.ts
git commit -m "fix: change kanban_agents.agents_id column type from uuid to int"
```

---

### Task 2: Fix controller validation

**Objective:** Accept numeric string for `agents_id` instead of UUID.

**Files:**
- Modify: `server/src/routes/kanban.agents/controllers.ts:18,29`

**Step 1: Change validation from UUID to string()**

Change line 18 from:
```typescript
agents_id: UUID,
```
To:
```typescript
agents_id: string(),
```

**Step 2: Convert agents_id to number before saving**

Change line 29 from:
```typescript
agentsId: agents_id,
```
To:
```typescript
agentsId: Number(agents_id),
```

**Step 3: Remove unused UUID import if no longer needed**

Check if `UUID` is still used elsewhere in this file. It is not (only `agents_id` used it). Remove `UUID` from the import:
```typescript
import { structValidator } from "../../utils/struct-validator.js";
```

**Step 4: Verify server compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add server/src/routes/kanban.agents/controllers.ts
git commit -m "fix: accept integer string for agents_id in kanban-agents create endpoint"
```

---

### Task 3: Verify end-to-end

**Objective:** Confirm the fix works by starting server and testing.

**Step 1: Start the server**

Run: `cd server && npx tsx src/index.ts`
Expected: Server starts on port 3000 without errors

**Step 2: Test create kanban-agent**

```bash
curl -X POST http://localhost:3000/kanban-agents/create \
  -d "name=TestAgent&layers_id=<uuid>&agents_id=1&board_id=<uuid>"
```
Expected: 200 with success message (not 400 VALIDATION_ERROR)

**Step 3: Stop server**

Ctrl+C

**Step 4: Commit everything**

```bash
git add .
git commit -m "fix: resolve agents_id type mismatch between Agent integer PK and KanbanAgent UUID FK"
```

---

## Risks & Notes

- SQLite type affinity: changing column type from `uuid` to `int` works with `synchronize: true`. Existing rows with UUID values in `agents_id` would cause FK constraint errors when referencing integer Agent IDs — but since the feature was broken (couldn't create any), there shouldn't be existing data.
- If there ARE existing rows, they'd need to be cleaned up manually or via a migration script.
- The `UUID` import can be fully removed from the controllers file since it's only used for `agents_id`.
