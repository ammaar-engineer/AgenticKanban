import { Bot } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { AgentType } from "@/stores/agents.store"

export function AgentDetailDialog({
    open,
    onOpenChange,
    agent,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    agent: AgentType | null
}) {
    if (!agent) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agent Details</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai agent ini
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {/* Agent Identity Section */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px] shadow-primary/15">
                            <Bot className="size-6" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                            <h3 className="truncate text-base font-semibold text-foreground">
                                {agent.name}
                            </h3>
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Model</span>
                            <Badge size="sm" className="w-fit font-mono">
                                {agent.model}
                            </Badge>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Provider</span>
                            <Badge size="sm" className="w-fit font-mono">
                                {agent.provider}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Personality Section */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Personality</span>
                        <div className="max-h-[200px] overflow-y-auto rounded-md border border-border/50 bg-muted/30 p-3">
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                {agent.personality || "Tidak ada deskripsi personality"}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Close
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
