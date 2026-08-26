import { Bot, GripVertical } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Agent } from "./kanban.board"

export function KanbanAgent({ agent }: { agent: Agent }) {
    return (
        <Card
            className="cursor-grab rounded-xl ring-border shadow-sm transition-colors hover:ring-primary/60 h-fit"
        >
            <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-1.5">
                <Bot className="size-4 text-primary" />
                <CardTitle className="text-xs font-medium text-foreground">
                    {agent.name}
                </CardTitle>
                <GripVertical className="size-4 text-muted-foreground/60" />
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
