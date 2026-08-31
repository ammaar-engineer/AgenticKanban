import api from "@/lib/axios"

export async function createLayer(payload: {
    name: string
    board_id: string
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    form.append("board_id", payload.board_id)

    await api.post("/kanban-layers/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

export async function deleteLayer(layerId: string): Promise<void> {
    await api.delete(`/kanban-layers/delete/${layerId}`)
}
