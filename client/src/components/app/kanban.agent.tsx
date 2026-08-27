import { Bot, GripVertical, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Agent } from "@/stores/kanban.store"
import { useKanbanStore } from "@/stores/kanban.store"

export function KanbanAgent({
    agent,
    boardId,
    layerId,
}: {
    agent: Agent
    boardId: number
    layerId: number
}) {
    const mutate = useKanbanStore(s => s.mutate)

    const handleDeleteAgent = () => {
        mutate(state => {
            state.boards = state.boards.map(board => {
                if (board.id !== boardId) return board


                const layers = board.layers.map(layer => {
                    if (layer.id !== layerId) return layer

                    const remainingAgents = layer.agents.filter(a => a.id !== agent.id)
                    return { ...layer, agents: remainingAgents }
                })

                return { ...board, layers }
            })
        })
    }

    return (
        <Card
            className="cursor-grab rounded-xl ring-border shadow-sm transition-colors hover:ring-primary/60 h-fit"
        >
            <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-1.5">
                <Bot className="size-4 text-primary" />
                <CardTitle className="text-xs font-medium text-foreground">
                    {agent.name}
                </CardTitle>
                <span className="flex items-center gap-1">
                    <GripVertical className="size-4 text-muted-foreground/60" />
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Delete ${agent.name}`}
                        onClick={handleDeleteAgent}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 />
                    </Button>
                </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
                <span className="flex flex-wrap gap-1">
                    <span className="rounded-full px-2 py-0.5 font-mono text-[10px] text-white border">
                        {agent.model_id}
                    </span>
                </span>
            </CardContent>
        </Card>
    )
}
