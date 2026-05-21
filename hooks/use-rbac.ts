/**
 * hooks/use-rbac.ts
 *
 * Thin, ergonomic wrappers over useRbacStore() so components don't need
 * to import the store directly. This layer also allows easy mocking in tests.
 *
 * Usage:
 *   const { role, can, profile } = useRbac();
 *   const { setRole } = useRbacActions();
 */

"use client";

import {
  useRbacStore,
  selectRole,
  selectProfile,
  selectPermissions,
  type RoleKey,
  type ModuleKey,
  type AccessLevel,
} from "@/store/rbac.store";

// ─── Read-only access hook ────────────────────────────────────────────────────

/**
 * Returns reactive RBAC state for the currently active user.
 * Components using this will only re-render when the role changes.
 */
export function useRbac() {
  const role        = useRbacStore(selectRole);
  const profile     = useRbacStore(selectProfile);
  const permissions = useRbacStore(selectPermissions);
  const can         = useRbacStore((s) => s.can);
  const isBlocked   = useRbacStore((s) => s.isBlocked);

  return { role, profile, permissions, can, isBlocked } as const;
}

// ─── Action-only hook (won't trigger re-renders on state change) ──────────────

/**
 * Returns only the setRole action. Use this in role-switcher UI so the
 * component doesn't re-render on every state read.
 */
export function useRbacActions() {
  const setRole = useRbacStore((s) => s.setRole);
  return { setRole } as const;
}

// ─── Re-export types for consumers ───────────────────────────────────────────
export type { RoleKey, ModuleKey, AccessLevel };
