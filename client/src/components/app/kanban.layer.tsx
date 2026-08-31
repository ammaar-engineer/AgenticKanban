import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { PickAgentDialog } from "@/components/dialog/pick.agent.dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AgentType } from "@/stores/agents.store"
import type { Agent } from "@/stores/kanban.store"
import { useDeleteLayerMutation } from "@/hooks/api/kanban-layer.mutation"
import { useCreateKanbanAgentMutation, useDeleteKanbanAgentMutation } from "@/hooks/api/kanban-agent.mutation"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { KanbanAgent } from "./kanban.agent"

export function KanbanLayer({
    layer,
    boardId,
    layerIndex,
}: {
    layer: { id: string; name: string; agents: Agent[] }
    boardId: string
    layerIndex: number
}) {
    const queryClient = useQueryClient()
    const [pickOpen, setPickOpen] = useState(false)

    const deleteLayer = useDeleteLayerMutation()
    const createKanbanAgent = useCreateKanbanAgentMutation()
    const deleteKanbanAgent = useDeleteKanbanAgentMutation()

    const invalidateBoard = () => {
        queryClient.invalidateQueries({ queryKey: ["kanban-board-detail", boardId] })
    }

    const handleDeleteLayer = () => {
        deleteLayer.mutate(layer.id, { onSuccess: invalidateBoard })
    }

    const handleSyncAgents = async (toAdd: AgentType[], toRemove: Agent[]) => {
        // Delete removed agents
        for (const agent of toRemove) {
            await new Promise<void>((resolve, reject) => {
                deleteKanbanAgent.mutate(agent.id, { onSuccess: () => resolve(), onError: reject })
            })
        }

        // Create new agents
        for (const at of toAdd) {
            await new Promise<void>((resolve, reject) => {
                createKanbanAgent.mutate(
                    { name: at.name, agents_id: at.id, layers_id: layer.id, board_id: boardId },
                    { onSuccess: () => resolve(), onError: reject },
                )
            })
        }

        invalidateBoard()
    }

    return (
        <Card className="relative flex w-[340px] shrink-0 flex-col rounded-xl bg-card/50 ring-border [--card-spacing:--spacing(0)]">
            <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Delete layer ${layer.name}`}
                onClick={handleDeleteLayer}
                className="absolute right-1.5 top-1.5 z-10 text-muted-foreground hover:text-destructive"
            >
                <Trash2 />
            </Button>
            <CardHeader className="flex-row items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 pr-8">
                <span className="flex items-center gap-1.5">
                    <span className={cn("size-2 rounded-full", "bg-white")} />
                    <CardTitle className="text-sm font-semibold text-foreground">
                        <p>
                            {layer.name}
                        </p>
                    </CardTitle>
                    <span className="ml-0.5 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {layer.agents.length}
                    </span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="font-semibold w-fit mb-2">
                        Queue: {layerIndex}
                    </span>
                </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 overflow-y-scroll p-3">
                {layer.agents.map((agent) => (
                    <KanbanAgent
                        key={agent.id}
                        agent={agent}
                        boardId={boardId}
                        layerId={layer.id}
                    />
                ))}
                <Button
                    className={'text-[1.1em] py-5'}
                    variant={'secondary'}
                    onClick={() => setPickOpen(true)}
                >Pick agents</Button>
            </CardContent>
            <PickAgentDialog
                open={pickOpen}
                onOpenChange={setPickOpen}
                onSync={handleSyncAgents}
                existingAgents={layer.agents}
            />
        </Card>
    )
}
