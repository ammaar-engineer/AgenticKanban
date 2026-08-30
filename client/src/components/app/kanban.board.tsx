import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { CreateLayerDialog } from "@/components/dialog/create.kanban.layer.dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Board } from "@/stores/kanban.store";
import { useKanbanStore } from "@/stores/kanban.store";
import { useCreateLayerMutation } from "@/hooks/api/kanban-layer.mutation";
import { KanbanLayer } from "./kanban.layer";
import { useBoardDetailQuery } from "@/hooks/api/kanban.query";

export function KanbanBoard({ board }: { board: Board }) {
  const [layerDialogOpen, setLayerDialogOpen] = useState(false);
  const mutate = useKanbanStore((s) => s.mutate);
  const createLayer = useCreateLayerMutation();

  const { data: detail, isLoading } = useBoardDetailQuery(board.id);

  const layers = detail?.layers ?? [];

  const handleAddLayer = (name: string) => {
    createLayer.mutate(
      { name, board_id: board.id },
      {
        onSuccess: () => {
          setLayerDialogOpen(false);
        },
      },
    );
  };

  const handleDeleteBoard = () => {
    mutate((state) => {
      const index = state.boards.findIndex((b) => b.id === board.id);
      if (index !== -1) {
        state.boards.splice(index, 1);
        if (state.activeBoardId === board.id) {
          state.activeBoardId = null;
        }
      }
    });
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {board.name}
          </h2>
          {board.description && (
            <p className="text-sm text-muted-foreground">{board.description}</p>
          )}
          <div className="py-3 flex gap-3">
            <Button className={cn("animate-execute-glow")}>
              Execute boards
            </Button>
          </div>
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
        {isLoading ? (
          <span className="text-sm text-muted-foreground px-2">
            Loading layers...
          </span>
        ) : (
          layers.map((layer, index) => (
            <KanbanLayer
              key={layer.id}
              boardId={board.id}
              layer={layer}
              layerIndex={index}
            />
          ))
        )}
        <Button
          variant="outline"
          className="flex h-9 w-85 shrink-0 items-center justify-center gap-2 rounded-xl border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
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
          handleAddLayer(name);
        }}
      />
    </div>
  );
}
