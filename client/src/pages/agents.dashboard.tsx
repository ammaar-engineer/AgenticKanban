import { Bot, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AgentDetailDialog } from "@/components/dialog/agents.detail.dialog";
import {
  CreateAgentDialog,
  type CreateAgentValues,
} from "@/components/dialog/create.agent.dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import {
  useCreateAgentMutation,
  useDeleteAgentMutation,
} from "@/hooks/api/agent.mutation";
import { type AgentType } from "@/stores/agents.store";
import { useAgentsQuery } from "@/hooks/api/agent.query";

export function AgentsDashboard() {
  const { data: agents = [], isLoading } = useAgentsQuery();
  const createMutation = useCreateAgentMutation();
  const deleteMutation = useDeleteAgentMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  const handleCreate = (values: CreateAgentValues) => {
    createMutation.mutate(values, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleDelete = (agentId: string) => {
    deleteMutation.mutate(agentId);
  };

  const handleCardClick = (agent: AgentType) => {
    setSelectedAgent(agent);
    setDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">Agents</h1>
          <Button disabled>
            <Plus /> Add Agent
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="flex-row gap-3 pl-4 rounded-xl pt-4 py-3.5"
              >
                <div className="flex min-w-0 flex-row items-start gap-3">
                  <div className="flex size-12 shrink-0 h-full items-center justify-center rounded-sm border border-muted bg-muted/30 animate-pulse" />
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="h-4 w-24 rounded bg-muted animate-pulse my-2" />
                    <div className="flex gap-2">
                      <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                      <div className="h-5 w-24 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
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
            {agents.map((agent) => (
              <Card
                key={agent.id}
                onClick={() => handleCardClick(agent)}
                className="group relative flex-row gap-3 pl-4 rounded-xl pt-4 py-3.5 transition-colors cursor-pointer hover:bg-accent/50"
              >
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${agent.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(agent.id);
                  }}
                  className="absolute top-3 right-3 opacity-0 text-muted-foreground transition-opacity group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 />
                </Button>

                <div className="flex min-w-0 flex-row items-start gap-3">
                  <div className="flex size-12 shrink-0 h-full items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px] shadow-primary/15">
                    <Bot className="size-6" />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-foreground my-2">
                      {agent.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <Badge size="sm" className="font-mono">
                        <span className="text-muted-foreground">Model:</span>
                        {agent.model_id}
                      </Badge>
                      <Badge size="sm" className="font-mono">
                        <span className="text-muted-foreground">Provider:</span>
                        {agent.provider.name}
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
            <h2 className="text-lg font-semibold text-foreground">
              Belum ada agent
            </h2>
            <p>Tambahkan agent pertama kamu.</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus /> Add Agent
            </Button>
          </div>
        )}
      </div>

      <CreateAgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
      <AgentDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        agent={selectedAgent}
      />
    </div>
  );
}
