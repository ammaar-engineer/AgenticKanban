import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Agent = { id: string, name: string; model: string, provider: string}
export type Layer = { id: string, name: string; agents: Agent[] }
export type Board = { id: string, name: string; description?: string; layers: Layer[] }

export type KanbanDraft = {
    boards: Board[]
    activeBoardId: string | null
}

type KanbanStore = KanbanDraft & {
    mutate: (recipe: (draft: KanbanDraft) => void) => void
}

export const useKanbanStore = create<KanbanStore>()(
    immer(set => ({
        boards: [],
        activeBoardId: null,
        mutate: recipe => set(recipe),
    }))
)

export const selectActiveBoard = (s: KanbanStore) =>
    s.activeBoardId === null ? null : s.boards.find(b => b.id === s.activeBoardId) ?? null
