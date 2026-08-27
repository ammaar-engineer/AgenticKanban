import { Bot, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { CreateAgentDialog, type CreateAgentValues } from "@/components/dialog/create.agent.dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAgentStore, type AgentType } from "@/stores/agents.store"

export function AgentsDashboard() {
    const { mutate, agents } = useAgentStore()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleCreate = (values: CreateAgentValues) => {
        const agent: AgentType = {
            name: values.name,
            model: values.model,
            provider: values.provider,
            personality: values.personality,
        }
        mutate(a => {
            a.agents = [...a.agents, agent]
        })
        setDialogOpen(false)
    }

    const handleDelete = (name: string) => {
        mutate(a => {
            a.agents = a.agents.filter(target => target.name !== name)
        })
    }

    return (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {/* Section 1: Action panel */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <h1 className="text-lg font-semibold text-foreground">Agents</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus /> Add Agent
                </Button>
            </div>

            {/* Section 2: Content grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {agents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {agents.map((agent, i) => (
                            <Card
                                key={i}
                                className="group relative flex-row gap-3 pl-4 rounded-xl pt-4 py-4 transition-colors"
                            >
                                {/* Delete — top-right, hidden sampai hover */}
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Delete ${agent.name}`}
                                    onClick={() => handleDelete(agent.name)}
                                    className="absolute top-3 right-3 opacity-0 text-muted-foreground transition-opacity group-hover:opacity-100 hover:text-destructive"
                                >
                                    <Trash2 />
                                </Button>

                                {/* Konten — row: avatar kiri, teks & chips kanan */}
                                <div className="flex min-w-0 flex-row items-start gap-3">
                                    {/* Avatar bulat berglow — focal point */}
                                    <div className="flex size-12 shrink-0 h-full items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px] shadow-primary/15">
                                        <Bot className="size-6" />
                                    </div>

                                    {/* Info — min-w-0 biar truncate jalan */}
                                    <div className="flex min-w-0 flex-col gap-1.5">
                                        <h3 className="truncate text-sm font-semibold text-foreground my-2">
                                            {agent.name}
                                        </h3>

                                        {/* Metadata — font mono, chip */}
                                        <div className="flex flex-wrap gap-1.5">
                                            <Badge size="sm" className="font-mono">
                                                <span className="text-muted-foreground">Model:</span>
                                                {agent.model}
                                            </Badge>
                                            <Badge size="sm" className="font-mono">
                                                <span className="text-muted-foreground">Provider:</span>
                                                {agent.provider}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
                            <Bot className="size-8 text-muted-foreground/60" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Belum ada agent</h2>
                        <p>Tambahkan agent pertama kamu.</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus /> Add Agent
                        </Button>
                    </div>
                )}
            </div>

            <CreateAgentDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
        </div>
    )
}