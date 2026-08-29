import api from "@/lib/axios"
import type { ProvidersType } from "@/stores/providers.store"

export async function fetchProviders(): Promise<ProvidersType[]> {
    const res = await api.get("/providers/list")
    return res.data.data
}

export async function createProvider(payload: {
    name: string
    url: string
    apiKey: string
}): Promise<void> {
    const form = new URLSearchParams()
    form.append("name", payload.name)
    form.append("url", payload.url)
    form.append("apiKey", payload.apiKey)

    await api.post("/providers/create", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
}

export async function deleteProvider(name: string): Promise<void> {
    await api.delete(`/providers/delete/${name}`)
}
