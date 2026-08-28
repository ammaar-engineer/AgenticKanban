import { useState } from "react"

import { PickAgentDialog } from "@/components/dialog/pick.agent.dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AgentType } from "@/stores/agents.store"
import type { Agent, Layer } from "@/stores/kanban.store"
import { useKanbanStore } from "@/stores/kanban.store"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { KanbanAgent } from "./kanban.agent"

export function KanbanLayer({
    layer,
    boardIndex,
    layerIndex,
}: {
    layer: Layer
    boardIndex: number
    layerIndex: number
}) {
    const mutate = useKanbanStore(s => s.mutate)
    const [pickOpen, setPickOpen] = useState(false)

    const handleDeleteLayer = () => {
        mutate(state => {
            state.boards[boardIndex].layers.splice(layerIndex, 1)
        })
    }

    const handleSyncAgents = (toAdd: AgentType[], toRemove: Agent[]) => {
        mutate(state => {
            const layer = state.boards[boardIndex].layers[layerIndex]

            // Remove agents (match by name+model+provider)
            toRemove.forEach(agentToRemove => {
                const removeKey = `${agentToRemove.name}|${agentToRemove.model}|${agentToRemove.provider}`
                const index = layer.agents.findIndex(a =>
                    `${a.name}|${a.model}|${a.provider}` === removeKey
                )
                if (index !== -1) {
                    layer.agents.splice(index, 1)
                }
            })

            // Add new agents
            const agentsToAdd: Agent[] = toAdd.map(({ name, model, provider }) => ({ name, model, provider }))
            layer.agents.push(...agentsToAdd)
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
                {layer.agents.map((agent, agentIndex) => (
                    <KanbanAgent
                        key={agentIndex}
                        agent={agent}
                        boardIndex={boardIndex}
                        layerIndex={layerIndex}
                        agentIndex={agentIndex}
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
