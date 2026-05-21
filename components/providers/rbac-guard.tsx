/**
 * components/providers/rbac-guard.tsx
 *
 * The Security Gate.
 *
 * Wraps any UI section and renders it only when the active role has
 * sufficient access. Otherwise renders a fallback — by default a clean
 * "No Access" placeholder that matches the MOD design system.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Usage patterns:                                         │
 * │                                                          │
 * │  1. Block entire routes / panels:                        │
 * │     <RbacGuard module="User Administration" require="Manage"> │
 * │       <UserManagementPanel />                            │
 * │     </RbacGuard>                                         │
 * │                                                          │
 * │  2. Hide a single button:                                │
 * │     <RbacGuard module="Campaign Management"              │
 * │                 require="Full Access"                    │
 * │                 fallback={null}>                         │
 * │       <CreateCampaignButton />                           │
 * │     </RbacGuard>                                         │
 * │                                                          │
 * │  3. Read-only mode (show but disable):                   │
 * │     <RbacGuard module="Approvals Queue"                  │
 * │                 require="Full Access"                    │
 * │                 readonlyFallback={<ApprovalsReadOnly />}> │
 * │       <ApprovalsPanel />                                 │
 * │     </RbacGuard>                                         │
 * └─────────────────────────────────────────────────────────┘
 */

"use client";

import React from "react";
import { ShieldOff, Lock } from "lucide-react";
import { useRbac } from "@/hooks/use-rbac";
import type { ModuleKey, AccessLevel } from "@/store/rbac.store";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RbacGuardProps {
  /** The CMS module this gate protects */
  module: ModuleKey;

  /**
   * Minimum access level required to render children.
   * Defaults to "View Only" — the most permissive gate.
   */
  require?: AccessLevel;

  /** What to render when access is denied. Defaults to <NoAccessPlaceholder>. */
  fallback?: React.ReactNode;

  /**
   * Optional: a read-only variant to render when the user has SOME access
   * but not enough for the full `require` level.
   * E.g. show a disabled form for Read Only users while Full Access users get the live form.
   */
  readonlyFallback?: React.ReactNode;

  children: React.ReactNode;
}

// ─── Guard Component ──────────────────────────────────────────────────────────

export function RbacGuard({
  module,
  require: requiredAccess = "View Only",
  fallback,
  readonlyFallback,
  children,
}: RbacGuardProps) {
  const { can, isBlocked, role } = useRbac();

  // Completely blocked — no access at all
  if (isBlocked(module)) {
    return fallback !== undefined
      ? <>{fallback}</>
      : <NoAccessPlaceholder module={module} reason="no-access" />;
  }

  // Has some access but not enough for the required level
  if (!can(module, requiredAccess)) {
    if (readonlyFallback !== undefined) return <>{readonlyFallback}</>;
    return fallback !== undefined
      ? <>{fallback}</>
      : <NoAccessPlaceholder module={module} reason="insufficient" role={role} />;
  }

  // Full access — render normally
  return <>{children}</>;
}

// ─── Default Fallback UI ──────────────────────────────────────────────────────

interface NoAccessPlaceholderProps {
  module: ModuleKey;
  reason: "no-access" | "insufficient";
  role?: string;
}

function NoAccessPlaceholder({ module, reason, role }: NoAccessPlaceholderProps) {
  const isHardBlock = reason === "no-access";

  return (
    <div
      role="alert"
      aria-label={`Access denied to ${module}`}
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-8 py-12 text-center min-h-[200px]"
    >
      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          isHardBlock
            ? "bg-red-50 text-red-400"
            : "bg-amber-50 text-amber-400"
        }`}
      >
        {isHardBlock ? (
          <ShieldOff size={26} strokeWidth={1.5} />
        ) : (
          <Lock size={26} strokeWidth={1.5} />
        )}
      </div>

      {/* Heading */}
      <div>
        <p className="text-sm font-bold text-slate-800">
          {isHardBlock ? "Access Restricted" : "Insufficient Permissions"}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 max-w-[260px] leading-relaxed">
          {isHardBlock
            ? `Your current role does not have access to ${module}.`
            : `Your ${role} role has read-only access to ${module}. Contact an Admin to request elevated permissions.`}
        </p>
      </div>

      {/* Role badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isHardBlock ? "bg-red-400" : "bg-amber-400"
          }`}
        />
        {role ?? "unknown"} role
      </span>
    </div>
  );
}

// ─── Convenience HOC ─────────────────────────────────────────────────────────

/**
 * Higher-order component variant for wrapping page-level components.
 *
 * @example
 * export default withRbac(UserAdminPage, "User Administration", "Manage");
 */
export function withRbac<P extends object>(
  Component: React.ComponentType<P>,
  module: ModuleKey,
  require: AccessLevel = "View Only"
) {
  const Guarded = (props: P) => (
    <RbacGuard module={module} require={require}>
      <Component {...props} />
    </RbacGuard>
  );
  Guarded.displayName = `withRbac(${Component.displayName ?? Component.name})`;
  return Guarded;
}
