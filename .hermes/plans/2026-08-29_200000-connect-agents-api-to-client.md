# Connect Agents API to Client

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Wire the server agents controller (create/list/delete) to the client, replacing the local zustand store with react-query data fetching — following the exact pattern already used by providers.

**Architecture:** Create `agent.api.ts` service, fill `agent.query.ts` and `agent.mutation.ts` hooks, update the dialog form to match server field names, and rewire `agents.dashboard.tsx` to use react-query instead of zustand.

**Tech Stack:** Hono (server), TypeORM, React, TanStack Query, Axios, Zod, shadcn/ui

---

## Context & Assumptions

- Server API is already running on `localhost:3000` with routes mounted at `/agents`
- Provider pattern is fully established: `services/provider.api.ts` -> `hooks/provider.query.ts` + `hooks/provider.mutation.ts`
- The zustand store (`agents.store.ts`) currently holds agents in-memory with no API persistence
- The server accepts `provider_id` (number) but the dialog currently sends provider as a name string
- The server expects `model_id` but the dialog field is called `model`
- No `description` field exists in the dialog form yet

---

## Step-by-step Plan

### Task 1: Create `agent.api.ts` service

**Objective:** API functions for create, list, delete agents — matching the provider pattern.

**Files:**
- Create: `client/src/services/agent.api.ts`

**Step 1: Write the service file**

```typescript
import api from "@/lib/axios"
import type { AgentType } from "@/stores/agents.store"

export async function fetchAgents(): Promise<AgentType[]> {
    const res = await api.get("/agents/list")
    return res.data.data
}

export async function createAgent(payload: {
    name: string
    model_id: string
    personality?: string
    description?: string
    provider_id: number
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    form.append("model_id", payload.model_id)
    if (payload.personality) form.append("personality", payload.personality)
    if (payload.description) form.append("description", payload.description)
    form.append("provider_id", String(payload.provider_id))

    await api.post("/agents/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

export async function deleteAgent(agentId: number): Promise<void> {
    await api.delete(`/agents/delete/${agentId}`)
}
```

**Step 2: Verify**

- File exists and exports are correct
- Field names match server schema: `name`, `model_id`, `personality`, `description`, `provider_id`

---

### Task 2: Update `AgentType` in `agents.store.ts`

**Objective:** Align the client type with what the server actually returns (the list endpoint returns `id`, `name`, `model_id`, `personality`, `description`, and `provider.name`).

**Files:**
- Modify: `client/src/stores/agents.store.ts`

**Step 1: Update the type**

```typescript
export type AgentType = {
    id: number
    name: string
    model_id: string
    personality: string
    description: string
    provider: { name: string }
}
```

**Step 2: Verify**

- The `provider` field is now `{ name: string }` matching the server's joined response
- `id` is `number` (server uses `PrimaryGeneratedColumn`)
- `model_id` matches server field name

---

### Task 3: Fill `agent.query.ts`

**Objective:** React-query hook for fetching agents list.

**Files:**
- Modify: `client/src/hooks/agent.query.ts`

**Step 1: Write the query hook**

```typescript
import { useQuery } from "@tanstack/react-query"
import { fetchAgents } from "@/services/agent.api"

export function useAgentsQuery() {
    return useQuery({
        queryKey: ["agents"],
        queryFn: fetchAgents,
    })
}
```

**Step 2: Verify**

- Query key is `["agents"]` — will be used for invalidation in mutations
- Matches the `useProvidersQuery` pattern exactly

---

### Task 4: Fill `agent.mutation.ts`

**Objective:** React-query hooks for create and delete, with cache invalidation.

**Files:**
- Modify: `client/src/hooks/agent.mutation.ts`

**Step 1: Write the mutation hooks**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAgent, deleteAgent } from "@/services/agent.api"

export function useCreateAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] })
        },
    })
}

export function useDeleteAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] })
        },
    })
}
```

**Step 2: Verify**

- Both mutations invalidate `["agents"]` query on success
- Matches the `useCreateProviderMutation` / `useDeleteProviderMutation` pattern exactly

---

### Task 5: Update `create.agent.dialog.tsx` form

**Objective:** Align form fields with server expectations: `model_id` instead of `model`, add `description` field, and send `provider_id` (number) instead of provider name.

**Files:**
- Modify: `client/src/components/dialog/create.agent.dialog.tsx`

**Step 1: Update `CreateAgentValues` type**

```typescript
export type CreateAgentValues = {
    name: string
    model_id: string
    provider_id: number
    personality: string
    description: string
}
```

**Step 2: Update state variables**

- `model` (string) -> `model_id` (string)
- `provider` (string) -> `provider_id` (number | "")  — stores the provider's actual `id`, NOT the name, NOT the array index
- Add `description` (string, default `""`)

**Step 3: Fix the Select — use `p.id` as value, `p.name` as display**

CRITICAL: The Select `value` must be the provider's database `id` field, not `p.name` and not the array index `i`. Radix Select values are strings, so convert with `String(p.id)`:

```tsx
<Select value={provider_id === "" ? "" : String(provider_id)} onValueChange={(value) => setProviderId(Number(value))}>
    <SelectTrigger className="w-full" id="agent-provider">
        <SelectValue placeholder="Pilih provider" />
    </SelectTrigger>
    <SelectContent>
        {providers?.map((p) => (
            <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
            </SelectItem>
        ))}
    </SelectContent>
</Select>
```

Key points:
- `key={p.id}` — stable key from database, not array index
- `value={String(p.id)}` — sends the provider's actual `id` field to state
- `onValueChange` converts back to `Number(value)` for state
- Display label is still `p.name` for the user

**Step 4: Update handleSubmit**

```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !model_id.trim() || !provider_id) return
    onSubmit({
        name: name.trim(),
        model_id: model_id.trim(),
        provider_id: Number(provider_id),  // ensure it's a number
        personality: personality.trim(),
        description: description.trim(),
    })
    // reset all fields
    setName("")
    setModelId("")
    setProviderId("")
    setPersonality("")
    setDescription("")
    onOpenChange(false)
}
```

**Step 5: Add description Textarea field** (after personality field, before closing `</form>`):

```tsx
<div className="flex flex-col gap-1.5">
    <Label htmlFor="agent-description">Description</Label>
    <Textarea
        className="h-40"
        id="agent-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what this agent does..."
    />
</div>
```

**Step 6: Update button disabled condition**

```tsx
disabled={!name.trim() || !model_id.trim() || !provider_id}
```

**Step 3: Verify**

- Form sends `model_id`, `provider_id` (number), `name`, `personality`, `description`
- Select renders provider names but submits provider IDs
- Description field is optional (server accepts nullable)

---

### Task 6: Rewire `agents.dashboard.tsx` to use react-query

**Objective:** Replace zustand store usage with react-query hooks for data fetching and mutations.

**Files:**
- Modify: `client/src/pages/agents.dashboard.tsx`

**Step 1: Update imports and component**

- Remove: `useAgentStore` import
- Add: `useAgentsQuery`, `useCreateAgentMutation`, `useDeleteAgentMutation`
- Use `useAgentsQuery()` for agent list (with `data` destructuring)
- Use `useCreateAgentMutation()` for `handleCreate` — call `createMutation.mutate(payload)` instead of zustand `mutate`
- Use `useDeleteAgentMutation()` for `handleDelete` — call `deleteMutation.mutate(agentId)`
- Pass `selectedAgent.id` (number) to delete mutation instead of `agent.name`
- Remove zustand `mutate` usage entirely
- Show loading/error states from `useAgentsQuery`

**Step 2: Verify**

- No zustand imports remain
- Agents are fetched from API on mount
- Create triggers API call + cache invalidation
- Delete triggers API call + cache invalidation
- Empty state shows correctly when no agents exist

---

### Task 7: Remove unused zustand agent store (optional cleanup)

**Objective:** If zustand store is no longer used anywhere, remove it or keep as fallback.

**Files:**
- Potentially remove: `client/src/stores/agents.store.ts`

**Step 1: Check if `useAgentStore` is imported anywhere**

```bash
grep -r "useAgentStore" client/src/
```

**Step 2: If only used in agents.dashboard.tsx (which we just rewired), delete the store file**

**Step 3: Verify**

- No remaining references to the deleted file
- App compiles without errors

---

## Files Changed Summary

| File | Action |
|---|---|
| `client/src/services/agent.api.ts` | Create |
| `client/src/stores/agents.store.ts` | Modify (update type) or Delete |
| `client/src/hooks/agent.query.ts` | Modify (fill content) |
| `client/src/hooks/agent.mutation.ts` | Modify (fill content) |
| `client/src/components/dialog/create.agent.dialog.tsx` | Modify (align fields) |
| `client/src/pages/agents.dashboard.tsx` | Modify (use react-query) |

## Validation

- Start dev server: `bash dev.sh`
- Open Agents dashboard — should load agents from API (empty initially)
- Click "Add Agent" — fill form, submit
- Verify agent appears in grid (fetched from API)
- Reload page — agent persists (stored in SQLite)
- Hover agent card, click delete — agent removed
- Check browser Network tab: all requests go to `localhost:3000/agents/*`

## Risks & Open Questions

- **Provider select value type**: Confirmed — `GET /providers/list` returns `{ id: number, name: string, url: string }`. The dialog Select can safely use `p.id` as value.
- **Form data encoding**: Server uses `zValidator("form", ...)` which expects `application/x-www-form-urlencoded`. The `URLSearchParams` approach matches this.
- **ProvidersType id type**: The store defines `id: string` but the server returns `number`. Minor type mismatch — not blocking but worth aligning later.
