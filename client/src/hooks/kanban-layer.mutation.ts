import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createLayer } from "@/services/kanban-layer.api"

export function useCreateLayerMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createLayer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kanban-boards"] })
            queryClient.invalidateQueries({ queryKey: ["kanban-board-detail"] })
        },
    })
}
