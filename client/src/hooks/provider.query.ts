import { useQuery } from "@tanstack/react-query"
import { fetchProviders } from "@/services/provider.api"

export function useProvidersQuery() {
    return useQuery({
        queryKey: ["providers"],
        queryFn: fetchProviders,
    })
}
