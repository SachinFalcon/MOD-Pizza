/**
 * store/deployment.store.ts
 *
 * Tracks campaign deployments in a "Pending Queue".
 * If any deployment stays pending for > 600 seconds (10 min BRD window),
 * the watchdog hook marks it as "Delayed" and fires a toast.
 */
import { create } from "zustand";

export interface PendingDeployment {
  campaignId:   string;
  campaignName: string;
  outletId:     string;
  outletName:   string;
  enqueuedAt:   number; // Date.now() ms
}

interface DeploymentState {
  pendingQueue:     PendingDeployment[];
  delayedIds:       Set<string>;        // campaignIds that breached the 10-min window
  acknowledgedIds:  Set<string>;        // dismissed by operator

  enqueue:     (item: PendingDeployment) => void;
  dequeue:     (campaignId: string)      => void;
  markDelayed: (campaignId: string)      => void;
  acknowledge: (campaignId: string)      => void;
  clearAll:    ()                        => void;
}

export const useDeploymentStore = create<DeploymentState>()((set) => ({
  pendingQueue:    [],
  delayedIds:      new Set(),
  acknowledgedIds: new Set(),

  enqueue: (item) =>
    set((s) => ({
      pendingQueue: s.pendingQueue.some((p) => p.campaignId === item.campaignId)
        ? s.pendingQueue
        : [...s.pendingQueue, item],
    })),

  dequeue: (campaignId) =>
    set((s) => ({
      pendingQueue: s.pendingQueue.filter((p) => p.campaignId !== campaignId),
    })),

  markDelayed: (campaignId) =>
    set((s) => ({ delayedIds: new Set([...s.delayedIds, campaignId]) })),

  acknowledge: (campaignId) =>
    set((s) => ({
      acknowledgedIds: new Set([...s.acknowledgedIds, campaignId]),
      delayedIds: new Set([...s.delayedIds].filter((id) => id !== campaignId)),
    })),

  clearAll: () =>
    set({ pendingQueue: [], delayedIds: new Set(), acknowledgedIds: new Set() }),
}));

// Selector helpers
export const selectPendingQueue    = (s: DeploymentState) => s.pendingQueue;
export const selectDelayedCount    = (s: DeploymentState) => s.delayedIds.size;
export const selectIsDelayed       = (campaignId: string) =>
  (s: DeploymentState) => s.delayedIds.has(campaignId);
