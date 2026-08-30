import api from "@/lib/axios"

export async function createKanbanAgent(payload: {
    name: string
    layers_id: string
    agents_id: string
    board_id: string
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    form.append("layers_id", payload.layers_id)
    form.append("agents_id", payload.agents_id)
    form.append("board_id", payload.board_id)

    await api.post("/kanban-agents/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

export async function deleteKanbanAgent(agentId: string): Promise<void> {
    await api.delete(`/kanban-agents/delete/${agentId}`)
}
