import { Plus } from "lucide-react"
import { useState } from "react"

import type { Board } from "@/components/app/kanban.board"
import { KanbanBoard } from "@/components/app/kanban.board"
import { CreateKanbanBoardDialog, type CreateKanbanBoardValues } from "@/components/dialog/create.kanban.board.dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MainDashboard() {
    const [boards, setBoards] = useState<Board[]>([])
    const [activeId, setActiveId] = useState<number | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const activeBoard = boards.find(b => b.id === activeId) ?? null

    const handleCreate = (values: CreateKanbanBoardValues) => {
        const board: Board = {
            id: boards.length,
            name: values.name,
            description: values.description,
            layers: [],
        }
        setBoards(prev => [...prev, board])
        setActiveId(board.id)
        setDialogOpen(false)
    }

    const handleAddLayer = (boardId: number, name: string) => {
        setBoards(prev => prev.map(b =>
            b.id === boardId ? { ...b, layers: [...b.layers, { id: b.layers.length, name, agents: [] }] } : b
        ))
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
                        onClick={() => setActiveId(board.id)}
                        className={cn(
                            board.id === activeId && "bg-primary/10 border border-b border-primary text-primary hover:bg-primary/15",
                            "px-3 py-3"
                        )}
                    >
                        {board.name}
                    </Button>
                ))}
            </div>

            {activeBoard ? (
                <KanbanBoard board={activeBoard} onAddLayer={handleAddLayer} />
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
