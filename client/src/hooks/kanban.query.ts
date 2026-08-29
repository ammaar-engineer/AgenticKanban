import { useQuery } from "@tanstack/react-query"
import { fetchBoards, fetchBoardDetail } from "@/services/kanban.api"

export function useBoardsQuery() {
    return useQuery({
        queryKey: ["kanban-boards"],
        queryFn: fetchBoards,
    })
}

export function useBoardDetailQuery(boardId: string | null) {
    return useQuery({
        queryKey: ["kanban-board-detail", boardId],
        queryFn: () => fetchBoardDetail(boardId!),
        enabled: !!boardId,
    })
}
