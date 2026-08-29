import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBoard } from "@/services/kanban.api"

export function useCreateBoardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kanban-boards"] })
        },
    })
}
