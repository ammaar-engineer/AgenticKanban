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
    provider_id: string
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    form.append("model_id", payload.model_id)
    if (payload.personality) form.append("personality", payload.personality)
    if (payload.description) form.append("description", payload.description)
    form.append("provider_id", payload.provider_id)

    await api.post("/agents/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

export async function deleteAgent(agentId: number): Promise<void> {
    await api.delete(`/agents/delete/${agentId}`)
}
