import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Agent = { id: number; name: string; model_id: string }
export type Layer = { id: number; name: string; agents: Agent[] }
export type Board = { id: number; name: string; description?: string; layers: Layer[] }

export type KanbanDraft = {
    boards: Board[]
    activeId: number | null
}

type KanbanStore = KanbanDraft & {
    mutate: (recipe: (draft: KanbanDraft) => void) => void
}

export const useKanbanStore = create<KanbanStore>()(
    immer(set => ({
        boards: [],
        activeId: null,
        mutate: recipe => set(recipe),
    }))
)

export const selectActiveBoard = (s: KanbanStore) =>
    s.boards.find(b => b.id === s.activeId) ?? null
