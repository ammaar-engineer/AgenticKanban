import { createBoard } from "@/services/api/kanban.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-boards"] });
    },
  });
}
