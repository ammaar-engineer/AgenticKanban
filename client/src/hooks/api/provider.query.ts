import { fetchProviders } from "@/services/api/provider.api";
import { useQuery } from "@tanstack/react-query";

export function useProvidersQuery() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });
}
