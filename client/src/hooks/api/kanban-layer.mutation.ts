import { createLayer, deleteLayer } from "@/services/api/kanban-layer.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateLayerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-boards"] });
      queryClient.invalidateQueries({ queryKey: ["kanban-board-detail"] });
    },
  });
}

export function useDeleteLayerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-boards"] });
      queryClient.invalidateQueries({ queryKey: ["kanban-board-detail"] });
    },
  });
}
