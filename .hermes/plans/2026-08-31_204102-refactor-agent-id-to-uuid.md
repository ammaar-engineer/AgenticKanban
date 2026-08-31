# Refactor Agent.id dari Integer ke UUID

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Ubah `Agent.id` dari integer auto-increment ke UUID agar konsisten dengan entity lain (Provider, KanbanBoard, KanbanLayer, KanbanAgent) dan fix error `agents_id: Expected UUID but received "1"`.

**Architecture:** Ubah `@PrimaryGeneratedColumn()` → `@PrimaryGeneratedColumn('uuid')` di Agent entity. Sync ke semua referensi integer → string di server dan client. SQLite + `synchronize: true` handle perubahan type otomatis.

**Tech Stack:** TypeORM, Hono, superstruct, React, TypeScript

---

## Scope of Changes

### Server (3 files)
1. `server/src/entities/agent.entity.ts` — PK type integer → uuid
2. `server/src/routes/agents/controllers.ts` — hapus `Number()` di delete
3. `server/src/routes/kanban.agents/controllers.ts` — revert perubahan sebelumnya (agents_id balik ke UUID validation)

### Client (4 files)
4. `client/src/stores/agents.store.ts` — `id: number` → `id: string`
5. `client/src/services/api/agent.api.ts` — `deleteAgent(agentId: number)` → `string`
6. `client/src/services/api/kanban.api.ts` — `id: number` → `id: string` di BoardDetailResponse
7. `client/src/pages/agents.dashboard.tsx` — `handleDelete(agentId: number)` → `string`

---

### Task 1: Revert kanban-agents controller ke UUID validation

**Objective:** Undo perubahan sebelumnya — `agents_id` balik validate pakai `UUID`, bukan `string()`.

**Files:**
- Modify: `server/src/routes/kanban.agents/controllers.ts:18,29`

**Step 1: Ubah validation kembali ke UUID**

```typescript
// Line 18 — dari string() kembali ke UUID
agents_id: UUID,
```

**Step 2: Hapus Number() conversion**

```typescript
// Line 29 — dari Number(agents_id) kembali ke agents_id
agentsId: agents_id,
```

**Step 3: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/server && npx tsc --noEmit 2>&1 | grep kanban.agents`
Expected: No errors

**Step 4: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "fix: revert kanban-agents agents_id validation back to UUID"
```

---

### Task 2: Revert kanban-agent entity ke uuid column type

**Objective:** Undo perubahan sebelumnya — `agents_id` column type balik ke `uuid`.

**Files:**
- Modify: `server/src/entities/kanban-agent.entity.ts:23`

**Step 1: Ubah column type kembali ke uuid**

```typescript
// Line 23 — dari 'int' kembali ke 'uuid'
@Column({ name: 'agents_id', type: 'uuid' })
agentsId: string;
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/server && npx tsc --noEmit 2>&1 | grep kanban-agent`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "fix: revert kanban_agents.agents_id column type back to uuid"
```

---

### Task 3: Ubah Agent entity PK ke UUID

**Objective:** Change `Agent.id` dari integer ke UUID.

**Files:**
- Modify: `server/src/entities/agent.entity.ts:6`

**Step 1: Ubah PrimaryGeneratedColumn**

```typescript
// Line 6 — dari @PrimaryGeneratedColumn() ke @PrimaryGeneratedColumn('uuid')
@PrimaryGeneratedColumn('uuid')
id!: string;
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/server && npx tsc --noEmit 2>&1 | grep agent.entity`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "feat: change Agent.id from integer to UUID"
```

---

### Task 4: Hapus Number() conversion di agents delete endpoint

**Objective:** Agent ID sekarang string (UUID), bukan number. Hapus `Number()` wrapping.

**Files:**
- Modify: `server/src/routes/agents/controllers.ts:67`

**Step 1: Hapus Number() conversion**

```typescript
// Line 67 — dari Number(c.req.param("agentId")) ke c.req.param("agentId")
await agentRepo.delete({ id: c.req.param("agentId") });
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/server && npx tsc --noEmit 2>&1 | grep agents/controllers`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "fix: remove Number() wrapper from agents delete endpoint"
```

---

### Task 5: Ubah AgentType.id ke string di client

**Objective:** Client type definition harus match server response (UUID = string).

**Files:**
- Modify: `client/src/stores/agents.store.ts:2`

**Step 1: Ubah id type**

```typescript
// Line 2 — dari id: number ke id: string
export type AgentType = {
    id: string
    name: string
    model_id: string
    personality: string
    description: string
    provider: { name: string }
}
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/client && npx tsc --noEmit 2>&1 | grep agents.store`
Expected: No errors (may show cascading errors in other files — fixed in next tasks)

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "refactor: change AgentType.id from number to string"
```

---

### Task 6: Ubah deleteAgent parameter ke string

**Objective:** `deleteAgent` function accepts UUID string, bukan number.

**Files:**
- Modify: `client/src/services/api/agent.api.ts:34`

**Step 1: Ubah parameter type**

```typescript
// Line 34 — dari agentId: number ke agentId: string
export async function deleteAgent(agentId: string): Promise<void> {
    await api.delete(`/agents/delete/${agentId}`);
}
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/client && npx tsc --noEmit 2>&1 | grep agent.api`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "refactor: change deleteAgent parameter from number to string"
```

---

### Task 7: Ubah BoardDetailResponse agent id ke string

**Objective:** Server response `agent.id` now returns UUID string, update client type.

**Files:**
- Modify: `client/src/services/api/kanban.api.ts:21`

**Step 1: Ubah id type di BoardDetailResponse**

```typescript
// Line 21 — dari id: number ke id: string
agent: {
    id: string
    name: string
    model_id: string
    provider: { name: string }
}
```

**Step 2: Verify**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/client && npx tsc --noEmit 2>&1 | grep kanban.api`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "refactor: change BoardDetailResponse agent.id from number to string"
```

---

### Task 8: Ubah handleDelete parameter ke string di agents dashboard

**Objective:** Match updated `deleteAgent` function signature.

**Files:**
- Modify: `client/src/pages/agents.dashboard.tsx:34`

**Step 1: Ubah parameter type**

```typescript
// Line 34 — dari (agentId: number) ke (agentId: string)
const handleDelete = (agentId: string) => {
    deleteMutation.mutate(agentId);
};
```

**Step 2: Verify full client compile**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/client && npx tsc --noEmit 2>&1`
Expected: No errors

**Step 3: Commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "refactor: change handleDelete parameter from number to string"
```

---

### Task 9: Verify end-to-end

**Objective:** Pastikan semua komponen jalan — server start, API response UUID.

**Step 1: Start server**

Run: `cd /home/quanta/Documents/engineer/AgenticKanban/server && npx tsx src/index.ts`
Expected: Server start di port 3000

**Step 2: Test agents list**

```bash
curl -s http://localhost:3000/agents/list | jq '.data[0].id'
```
Expected: UUID string seperti `"550e8400-e29b-41d4-a716-446655440000"`

**Step 3: Test create kanban-agent with UUID agents_id**

```bash
curl -X POST http://localhost:3000/kanban-agents/create \
  -d "name=TestAgent&layers_id=<valid-uuid>&agents_id=<valid-uuid>&board_id=<valid-uuid>"
```
Expected: 200 success (bukan 400 VALIDATION_ERROR)

**Step 4: Stop server, final commit**

```bash
cd /home/quanta/Documents/engineer/AgenticKanban && bash commit.sh "feat: Agent.id refactor complete — all IDs now UUID"
```

---

## Risks & Notes

- **Existing data:** SQLite dengan `synchronize: true` akan recreate table. Data lama dengan integer ID akan hilang. Acceptable karena feature baru (belum ada production data).
- **FK constraint:** `kanban_agents.agents_id` sudah UUID type, sekarang match dengan `agents.id` UUID. No conflict.
- **Provider entity:** `Provider.id` sudah UUID (`@PrimaryGeneratedColumn('uuid')`). `Agent.provider_id` adalah varchar yang refer ke Provider. Tidak terpengaruh refactor ini.
- **Client Agent type:** `kanban.store.ts` type `Agent` punya `id: string` — sudah benar, tidak perlu diubah.
