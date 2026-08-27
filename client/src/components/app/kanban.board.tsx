import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { CreateLayerDialog } from "@/components/dialog/create.kanban.layer.dialog"
import { Button } from "@/components/ui/button"
import type { Board } from "@/stores/kanban.store"
import { useKanbanStore } from "@/stores/kanban.store"
import { KanbanLayer } from "./kanban.layer"

export function KanbanBoard({ board, boardIndex }: { board: Board; boardIndex: number }) {
    const [layerDialogOpen, setLayerDialogOpen] = useState(false)
    const mutate = useKanbanStore(s => s.mutate)

    const handleAddLayer = (name: string) => {
        mutate(state => {
            state.boards[boardIndex].layers.push({ name, agents: [] })
        })
    }

    const handleDeleteBoard = () => {
        mutate(state => {
            state.boards.splice(boardIndex, 1)
            if (boardIndex === state.activeBoardIndex) {
                state.activeBoardIndex = null
            } else if (state.activeBoardIndex !== null && boardIndex < state.activeBoardIndex) {
                state.activeBoardIndex--
            }
        })
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">{board.name}</h2>
                    {board.description && (
                        <p className="text-sm text-muted-foreground">{board.description}</p>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete board ${board.name}`}
                    onClick={handleDeleteBoard}
                    className="text-muted-foreground hover:text-destructive w-fit flex items-center gap-2 px-2 py-4"
                >
                    <Trash2 /> Remove board
                </Button>
            </div>
            <div className="flex w-full min-h-0 flex-1 items-start gap-4 overflow-x-auto p-4">
                {board.layers.map((layer, layerIndex) => (
                    <KanbanLayer
                        key={layerIndex}
                        boardIndex={boardIndex}
                        layerIndex={layerIndex}
                        layer={layer}
                    />
                ))}
                <Button
                    variant="outline"
                    className="flex h-9 w-[340px] shrink-0 items-center justify-center gap-2 rounded-xl border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    onClick={() => setLayerDialogOpen(true)}
                >
                    <Plus className="size-4" />
                    Create Layer
                </Button>
            </div>

            <CreateLayerDialog
                open={layerDialogOpen}
                onOpenChange={setLayerDialogOpen}
                onSubmit={({ name }) => {
                    handleAddLayer(name)
                    setLayerDialogOpen(false)
                }}
            />
        </div>
    )
}
