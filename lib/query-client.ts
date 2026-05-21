/**
 * lib/query-client.ts
 * Singleton QueryClient — import this anywhere you need direct cache access.
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30 s — aligns with BRD 5-minute latency tolerance
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
