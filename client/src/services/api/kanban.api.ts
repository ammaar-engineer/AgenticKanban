import api from "@/lib/axios"
import type { Board } from "@/stores/kanban.store"

type BoardListItem = {
    id: string
    name: string
    description: string | null
}

type BoardDetailResponse = {
    id: string
    name: string
    description: string | null
    layers: {
        id: string
        name: string
        kanbanAgents: {
            id: string
            name: string
            agent: {
                id: number
                name: string
                model_id: string
                provider: { name: string }
            }
        }[]
    }[]
}

export async function fetchBoards(): Promise<Board[]> {
    const res = await api.get("/kanban-boards/list")
    const items: BoardListItem[] = res.data.data
    return items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description ?? undefined,
        layers: [],
    }))
}

export async function fetchBoardDetail(boardId: string): Promise<Board> {
    const res = await api.get("/kanban-boards/detail", { params: { boardId } })
    const data: BoardDetailResponse = res.data.data
    return {
        id: data.id,
        name: data.name,
        description: data.description ?? undefined,
        layers: data.layers.map(layer => ({
            id: layer.id,
            name: layer.name,
            agents: layer.kanbanAgents.map(ka => ({
                id: ka.id,
                name: ka.agent.name,
                model: ka.agent.model_id,
                provider: ka.agent.provider.name,
            })),
        })),
    }
}

export async function createBoard(payload: {
    name: string
    description?: string
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    if (payload.description) form.append("description", payload.description)

    await api.post("/kanban-boards/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}
