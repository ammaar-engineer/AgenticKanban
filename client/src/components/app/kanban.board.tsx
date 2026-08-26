import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateLayerDialog } from "@/components/dialog/create.kanban.layer.dialog";
import { Button } from "@/components/ui/button";
import { KanbanLayer } from "./kanban.layer";

export type Agent = { id: number; name: string; model_id: string }

export type Layer = { id: number; name: string; agents: Agent[] }

export type Board = { id: number; name: string; description?: string; layers: Layer[] }

export function KanbanBoard({
    board,
    onAddLayer,
}: {
    board: Board
    onAddLayer: (boardId: number, name: string) => void
}) {
    const [layerDialogOpen, setLayerDialogOpen] = useState(false)

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <div className="px-4 pt-4 pb-4">
                <h2 className="text-lg font-semibold text-foreground">{board.name}</h2>
                {board.description && (
                    <p className="text-sm text-muted-foreground">{board.description}</p>
                )}
            </div>
            <div className="flex w-full min-h-0 flex-1 items-start gap-4 overflow-x-auto p-4">
                {board.layers.map(layer => (
                    <KanbanLayer key={layer.id} layer={layer} />
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
                    onAddLayer(board.id, name)
                    setLayerDialogOpen(false)
                }}
            />
        </div>
    )
}
