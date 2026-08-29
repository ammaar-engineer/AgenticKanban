import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAgent, deleteAgent } from "@/services/agent.api"

export function useCreateAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] })
        },
    })
}

export function useDeleteAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] })
        },
    })
}
