import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type AgentType = {
    name: string
    model: string
    provider: string
    personality: string
}

type AgentDraft = {
    agents: AgentType[]
}

type AgentStore = AgentDraft & {
    mutate: (recipe: (draft: AgentDraft) => void) => void
}

export const useAgentStore = create<AgentStore>()(
    immer(set => ({
        agents: [],
        mutate: recipe => set(recipe)
    }))
)
