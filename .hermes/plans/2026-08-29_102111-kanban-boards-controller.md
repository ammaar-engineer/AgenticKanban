# Kanban Boards Controller Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Create a KanbanBoard controller with `create` and `delete` endpoints following the same pattern as the existing `agents` controller.

**Architecture:** Hono router with Zod validation via `@hono/zod-validator`, TypeORM repository for `KanbanBoard` entity, `StandardJsonResponse` for consistent JSON output. Register route in `server/src/index.ts`.

**Tech Stack:** Hono, Zod, TypeORM, TypeScript, `@hono/zod-validator`

---

## Context & Assumptions

- The file `server/src/routes/kanban.boards/controllers.ts` already exists but is empty.
- The entity `KanbanBoard` has: `id` (uuid PK), `name` (varchar 255), `description` (text, nullable), `layers` (OneToMany), `kanbanAgents` (OneToMany).
- The existing pattern (see `agents/controllers.ts`): Hono router exported as named const, repo initialized at module level, zValidator for POST validation, `StandardJsonResponse` for all responses.
- `KanbanLayer` has `onDelete: 'CASCADE'` on its FK to `KanbanBoard`, and `KanbanAgent` also has `onDelete: 'CASCADE'` on its FK to `KanbanBoard`. So deleting a board cascades to layers and agents automatically.
- No TypeScript test framework is set up in this project, so validation is manual (`tsc --noEmit`).

---

## Step-by-Step Plan

### Task 1: Implement the kanban boards controller

**Objective:** Write the full controller with `POST /create` and `DELETE /delete/:boardId` endpoints.

**Files:**
- Modify: `server/src/routes/kanban.boards/controllers.ts`

**Step 1: Write the controller code**

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { KanbanBoard } from "../../entities/kanban-board.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const kanbanBoards = new Hono();
const boardRepo = AppDataSource.getRepository(KanbanBoard);

kanbanBoards.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    }),
  ),
  async c => {
    const { name, description } = c.req.valid("form");
    try {
      await boardRepo.save(boardRepo.create({ name, description }));
    } catch {
      console.log("Error creating kanban board");
    }
    console.log("Kanban board has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban board has been created",
      }),
    );
  },
);

kanbanBoards.delete("/delete/:boardId", async c => {
  await boardRepo.delete({ id: c.req.param("boardId") });
  return c.json(
    StandardJsonResponse({
      message: "Kanban board has been deleted",
    }),
    200,
  );
});
```

**Step 2: Verify TypeScript compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No errors

---

### Task 2: Register the route in the main app

**Objective:** Import and mount the kanban boards router in `server/src/index.ts`.

**Files:**
- Modify: `server/src/index.ts`

**Step 1: Add import after the existing agents import**

Add this import at line 7 (after the providers import):

```typescript
import { kanbanBoards } from "./routes/kanban.boards/controllers.js";
```

**Step 2: Add route registration after the existing routes**

Add this route after `app.route("/agents", agents);` (line 24):

```typescript
app.route("/kanban-boards", kanbanBoards);
```

**Step 3: Verify TypeScript compiles**

Run: `cd server && npx tsc --noEmit`
Expected: No errors

**Step 4: Start the server and test manually**

Run: `cd server && npx tsx src/index.ts`

Test create:
```bash
curl -X POST http://localhost:3000/kanban-boards/create \
  -d "name=My Board" \
  -d "description=Test board"
```
Expected: `{"data":null,"errorCode":"","message":"Kanban board has been created","statusCode":200,"success":true}`

Test delete (use the UUID from the create response or from the database):
```bash
curl -X DELETE http://localhost:3000/kanban-boards/delete/<board-uuid>
```
Expected: `{"data":null,"errorCode":"","message":"Kanban board has been deleted","statusCode":200,"success":true}`

---

### Task 3: Commit

```bash
git add server/src/routes/kanban.boards/controllers.ts server/src/index.ts
git commit -m "feat: add kanban boards controller with create and delete endpoints"
```

---

## Files Changed Summary

| File | Action |
|---|---|
| `server/src/routes/kanban.boards/controllers.ts` | Write (was empty) |
| `server/src/index.ts` | Modify (add import + route) |

## Verification

1. `cd server && npx tsc --noEmit` — no type errors
2. Server starts without errors on port 3000
3. `POST /kanban-boards/create` creates a board
4. `DELETE /kanban-boards/delete/:boardId` removes the board
5. Validation: sending empty `name` to create should fail Zod validation

## Notes

- The `DELETE` endpoint uses UUID directly (not `Number()`) since `KanbanBoard.id` is `PrimaryGeneratedColumn('uuid')` — different from agents which uses `Number()`.
- Cascade delete on `KanbanLayer` and `KanbanAgent` FKs means deleting a board also removes its layers and agents.
- If needed later, add `GET /list` endpoint following the agents pattern.
