import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createKanbanAgent, deleteKanbanAgent } from "@/services/api/kanban.agent.api"

export function useCreateKanbanAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createKanbanAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kanban-boards"] })
        },
    })
}

export function useDeleteKanbanAgentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteKanbanAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kanban-boards"] })
        },
    })
}
