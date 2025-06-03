import { useQuery } from "@tanstack/react-query";
import { type Metrics } from "@shared/schema";

export function useMetrics() {
  return useQuery<Metrics>({
    queryKey: ["/api/metrics"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
