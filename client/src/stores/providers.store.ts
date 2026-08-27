import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ProvidersType = {
    name: string
    url: string
}
type ProviderDraft = {
    providers: ProvidersType[]
}
type ProviderStore = ProviderDraft & {
    mutate: (recipe: (draft: ProviderDraft) => void) => void
}


export const useProviderStore = create<ProviderStore>()(
    immer(set => ({
        providers: [
            { id: 0, name: "OpenAI", url: "https://api.openai.com" },
            { id: 1, name: "Anthropic", url: "https://api.anthropic.com" },
            { id: 2, name: "Google", url: "https://generativelanguage.googleapis.com" },
            { id: 3, name: "Ollama", url: "http://localhost:11434" },
        ],
        mutate: recipe => set(recipe)
    }))
)