"use client";
/**
 * hooks/use-deployment-monitor.ts
 *
 * Deployment Watchdog — BRD §24: 10-minute acknowledgment window.
 *
 * Every 30 seconds, this hook:
 *   1. Scans the pendingQueue in the deployment store
 *   2. Identifies any item pending for > STALE_THRESHOLD_MS (600_000 ms)
 *   3. Marks it as "Delayed" in the store
 *   4. Fires a sonner toast.error so the operator is alerted globally
 *
 * Mount this ONCE in app/layout or a top-level provider.
 */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDeploymentStore } from "@/store/deployment.store";
import { useScreenHealth } from "@/hooks/use-telemetry";

const STALE_THRESHOLD_MS  = 600_000; // 10 minutes — BRD §24
const POLL_INTERVAL_MS    = 30_000;  // check every 30 s

export function useDeploymentMonitor() {
  const { pendingQueue, markDelayed, delayedIds, acknowledgedIds } =
    useDeploymentStore();
  const { data: screenHealth } = useScreenHealth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function runCheck() {
      const now = Date.now();

      pendingQueue.forEach((item) => {
        const age = now - item.enqueuedAt;
        const alreadyFlagged     = delayedIds.has(item.campaignId);
        const alreadyAcknowledged = acknowledgedIds.has(item.campaignId);

        if (age > STALE_THRESHOLD_MS && !alreadyFlagged && !alreadyAcknowledged) {
          markDelayed(item.campaignId);
          toast.error("Deployment Delayed", {
            description: `"${item.campaignName}" has been pending on ${item.outletName} for over 10 minutes.`,
            duration: 8_000,
            action: {
              label: "Acknowledge",
              onClick: () =>
                useDeploymentStore.getState().acknowledge(item.campaignId),
            },
          });
        }
      });

      // Also check screen health for stale heartbeats (no ping > 10 min)
      if (screenHealth) {
        const tenMinAgo = new Date(now - STALE_THRESHOLD_MS);
        screenHealth.forEach((screen) => {
          const lastPing = new Date(screen.lastPing);
          if (lastPing < tenMinAgo && screen.status !== "Offline") {
            toast.warning("Screen Heartbeat Lost", {
              description: `${screen.outletName} → ${screen.screenId} has not reported in >10 minutes.`,
              duration: 6_000,
              id: `heartbeat-${screen.screenId}`, // deduplicate
            });
          }
        });
      }
    }

    runCheck(); // run immediately on mount
    intervalRef.current = setInterval(runCheck, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQueue, screenHealth]);
}
