import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/services/api/agent.api";

export function useAgentsQuery() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
}
