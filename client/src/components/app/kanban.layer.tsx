import { useState } from "react"

import { PickAgentDialog } from "@/components/dialog/pick.agent.dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AgentType } from "@/stores/agents.store"
import type { Agent, Layer } from "@/stores/kanban.store"
import { useKanbanStore } from "@/stores/kanban.store"
import { Trash2 } from "lucide-react"
import { useMemo } from "react"
import { Button } from "../ui/button"
import { KanbanAgent } from "./kanban.agent"

export function KanbanLayer({
    layer,
    boardId,
}: {
    layer: Layer
    boardId: string
}) {
    const mutate = useKanbanStore(s => s.mutate)
    const boards = useKanbanStore(s => s.boards)
    
    const layerIndex = useMemo(() => {
        const board = boards.find(b => b.id === boardId)
        return board ? board.layers.findIndex(l => l.id === layer.id) : -1
    }, [boards, boardId, layer.id])

    const [pickOpen, setPickOpen] = useState(false)

    const handleDeleteLayer = () => {
        mutate(state => {
            const board = state.boards.find(b => b.id === boardId)
            if (board) {
                const index = board.layers.findIndex(l => l.id === layer.id)
                if (index !== -1) board.layers.splice(index, 1)
            }
        })
    }

    const handleSyncAgents = (toAdd: AgentType[], toRemove: Agent[]) => {
        mutate(state => {
            const board = state.boards.find(b => b.id === boardId)
            const targetLayer = board?.layers.find(l => l.id === layer.id)
            if (!targetLayer) return

            // Remove agents (match by id)
            toRemove.forEach(agentToRemove => {
                const index = targetLayer.agents.findIndex(a => a.id === agentToRemove.id)
                if (index !== -1) {
                    targetLayer.agents.splice(index, 1)
                }
            })

            // Add new agents
            const agentsToAdd: Agent[] = toAdd.map(({ name, model, provider }) => ({ id: crypto.randomUUID(), name, model, provider }))
            targetLayer.agents.push(...agentsToAdd)
        })
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
