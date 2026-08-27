import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Agent = { name: string; model: string,  }
export type Layer = { name: string; agents: Agent[] }
export type Board = { name: string; description?: string; layers: Layer[] }

export type KanbanDraft = {
    boards: Board[]
    activeBoardIndex: number | null
}

type KanbanStore = KanbanDraft & {
    mutate: (recipe: (draft: KanbanDraft) => void) => void
}

export const useKanbanStore = create<KanbanStore>()(
    immer(set => ({
        boards: [],
        activeBoardIndex: null,
        mutate: recipe => set(recipe),
    }))
)

export const selectActiveBoard = (s: KanbanStore) =>
    s.activeBoardIndex === null ? null : s.boards[s.activeBoardIndex] ?? null
