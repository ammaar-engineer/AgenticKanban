import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProvider, deleteProvider } from "@/services/provider.api"

export function useCreateProviderMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
        },
    })
}

export function useDeleteProviderMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providers"] })
        },
    })
}
