"use client";
/**
 * hooks/use-telemetry.ts
 * TanStack Query hooks for screen health & telemetry — polls every 30 s.
 */
import { useQuery } from "@tanstack/react-query";
import { telemetryService } from "@/services/telemetry.service";

export const TELEMETRY_KEYS = {
  health:   (outletId?: string) => ["screen-health", outletId ?? "all"] as const,
  stats:    ["telemetry-stats"] as const,
  heatmap:  ["activity-heatmap"] as const,
};

/** Screen health — refetches every 30 s (live heartbeat) */
export function useScreenHealth(outletId?: string) {
  return useQuery({
    queryKey:       TELEMETRY_KEYS.health(outletId),
    queryFn:        () => telemetryService.getScreenHealth(outletId),
    refetchInterval: 30_000,
    staleTime:       15_000,
  });
}

/** System KPI stats */
export function useSystemStats() {
  return useQuery({
    queryKey:       TELEMETRY_KEYS.stats,
    queryFn:        telemetryService.getSystemStats,
    refetchInterval: 60_000,
  });
}

/** Activity heatmap matrix */
export function useActivityHeatmap() {
  return useQuery({
    queryKey: TELEMETRY_KEYS.heatmap,
    queryFn:  telemetryService.getActivityHeatmap,
    staleTime: 5 * 60_000, // 5 minutes
  });
}
