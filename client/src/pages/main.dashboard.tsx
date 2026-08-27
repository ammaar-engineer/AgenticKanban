import { Plus } from "lucide-react"
import { useState } from "react"

import { KanbanBoard } from "@/components/app/kanban.board"
import { CreateKanbanBoardDialog, type CreateKanbanBoardValues } from "@/components/dialog/create.kanban.board.dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { selectActiveBoard, type Board, useKanbanStore } from "@/stores/kanban.store"

export function MainDashboard() {
    const [dialogOpen, setDialogOpen] = useState(false)

    const boards = useKanbanStore(s => s.boards)
    const activeId = useKanbanStore(s => s.activeId)
    const mutate = useKanbanStore(s => s.mutate)
    const activeBoard = useKanbanStore(selectActiveBoard)

    const handleCreate = (values: CreateKanbanBoardValues) => {
        mutate(state => {
            const board: Board = {
                id: state.boards.length,
                name: values.name,
                description: values.description,
                layers: [],
            }
            state.boards.push(board)
            state.activeId = board.id
        })
        setDialogOpen(false)
    }

    return (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {/* Page header with create-board action */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus /> Create Board
                </Button>
            </div>

            {/* Board picker */}
            <div className="flex gap-2 border-b border-border/60 px-2 py-3 w-full overflow-x-scroll items-center">
                {boards.map(board => (
                    <Button
                        key={board.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => mutate(state => { state.activeId = board.id })}
                        className={cn(
                            board.id === activeId && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                            "px-3 py-3"
                        )}
                    >
                        {board.name}
                    </Button>
                ))}
            </div>

            {activeBoard ? (
                <KanbanBoard board={activeBoard} />
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                    <h2 className="text-lg font-semibold text-foreground">Belum ada board</h2>
                    <p>Buat board pertama kamu untuk mulai.</p>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus /> Create Board
                    </Button>
                </div>
            )}

            <CreateKanbanBoardDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
        </div>
    )
}
