"use client";
/**
 * components/providers/deployment-monitor-provider.tsx
 *
 * Thin client wrapper that mounts the useDeploymentMonitor watchdog hook
 * once at the app root. Separated from layout.tsx (server component).
 */
import { useDeploymentMonitor } from "@/hooks/use-deployment-monitor";

export function DeploymentMonitorProvider({ children }: { children: React.ReactNode }) {
  useDeploymentMonitor();
  return <>{children}</>;
}
