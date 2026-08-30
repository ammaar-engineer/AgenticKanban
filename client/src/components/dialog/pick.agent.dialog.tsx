import { useEffect, useState, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Agent } from "@/stores/kanban.store";
import { type AgentType } from "@/stores/agents.store";
import { useAgentsQuery } from "@/hooks/api/agent.query";

const getAgentKey = (agent: {
  name: string;
  model_id: string;
  provider: { name: string };
}) => `${agent.name}|${agent.model_id}|${agent.provider.name}`;

// Key for local Agent type (kanban.store) — used for existing agents comparison
const getLocalAgentKey = (agent: {
  name: string;
  model: string;
  provider: string;
}) => `${agent.name}|${agent.model}|${agent.provider}`;

export function PickAgentDialog({
  open,
  onOpenChange,
  onSync,
  existingAgents = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: (toAdd: AgentType[], toRemove: Agent[]) => void;
  existingAgents?: Agent[];
}) {
  const { data: agents = [] } = useAgentsQuery();
  const [selected, setSelected] = useState<string[]>([]);
  const initialSelectedRef = useRef<string[]>([]);

  // Pre-populate selected state when dialog opens
  useEffect(() => {
    if (open && existingAgents.length > 0) {
      // Create keys from existing agents (name + model + provider)
      const existingKeys = existingAgents.map(getLocalAgentKey);
      setSelected(existingKeys);
      initialSelectedRef.current = existingKeys;
    } else if (open) {
      // Reset to empty when opening with no existing agents
      setSelected([]);
      initialSelectedRef.current = [];
    }
  }, [open, existingAgents]);

  const toggle = (agent: AgentType) => {
    const key = getAgentKey(agent);
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSubmit = () => {
    const initialKeys = initialSelectedRef.current;
    const currentKeys = selected;

    // Agents to remove: were selected initially, not selected now
    const keysToRemove = initialKeys.filter((k) => !currentKeys.includes(k));
    const agentsToRemove = existingAgents.filter((a) =>
      keysToRemove.includes(getLocalAgentKey(a)),
    );

    // Agents to add: selected now, weren't selected initially
    const keysToAdd = currentKeys.filter((k) => !initialKeys.includes(k));
    const agentsToAdd = agents.filter((a) =>
      keysToAdd.includes(getAgentKey(a)),
    );

    // Call sync with both lists (even if one is empty)
    onSync(agentsToAdd, agentsToRemove);

    setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pick Agents</DialogTitle>
          <DialogDescription>
            Pilih agent untuk ditambahkan ke layer ini (boleh duplikat).
          </DialogDescription>
        </DialogHeader>

        {agents.length === 0 ? (
          <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border/60 py-6 text-center text-muted-foreground">
            <span className="text-xs font-medium">Belum ada agent</span>
            <span className="text-[11px]">
              Tambahkan agent di halaman Agents dulu.
            </span>
          </div>
        ) : (
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
            {agents.map((agent) => {
              const agentKey = getAgentKey(agent);
              return (
                <label
                  key={agentKey}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    className="size-3.5 shrink-0 accent-primary"
                    checked={selected.includes(agentKey)}
                    onChange={() => toggle(agent)}
                  />
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-foreground">
                      {agent.name}
                    </span>
                    <Badge
                      size="sm"
                      variant="primary"
                      className="font-mono shrink-0"
                    >
                      {agent.provider.name}
                    </Badge>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Sync
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
