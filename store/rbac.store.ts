/**
 * store/rbac.store.ts
 *
 * Global RBAC store built with Zustand v5 + persist middleware.
 * Replaces the ad-hoc localStorage reads in lib/user-roles.ts with a
 * reactive, type-safe singleton that every component can subscribe to.
 *
 * Role hierarchy (matches db_structure.txt `users.role` CHECK constraint):
 *   admin     — full system access
 *   publisher — approvals + content; no user admin
 *   editor    — campaign creation + scheduling; read-only elsewhere
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { USER_PROFILES, type UserProfileData } from "@/config/user-roles";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoleKey = "admin" | "publisher" | "editor";

export type AccessLevel =
  | "Full Access"
  | "Manage"
  | "Read Only"
  | "View Only"
  | "No Access";

export interface Permission {
  module: ModuleKey;
  access: AccessLevel;
  variant: "success" | "info" | "neutral" | "warning";
}

/**
 * All protected modules in the CMS.
 * Adding a new page? Add its key here first — the guard will enforce it automatically.
 */
export type ModuleKey =
  | "Campaign Management"
  | "Approvals Queue"
  | "Screen Scheduler"
  | "User Administration"
  | "System Logs & Audit";

// ─── Access Level Rank (lower = more restricted) ──────────────────────────────

const ACCESS_RANK: Record<AccessLevel, number> = {
  "No Access":   0,
  "View Only":   1,
  "Read Only":   2,
  "Manage":      3,
  "Full Access": 4,
};

// ─── Store State & Actions ────────────────────────────────────────────────────

interface RBACState {
  /** The active role key — persisted to localStorage */
  activeRole: RoleKey;

  /** Full profile of the current active user persona */
  profile: UserProfileData;

  /** Flat permission list for the active role */
  permissions: Permission[];

  // ── Actions ──

  /**
   * Switch the active role. Immediately updates profile + permissions.
   * Also fires the legacy `role-change` window event so older components
   * that haven't migrated to Zustand yet still react correctly.
   */
  setRole: (key: RoleKey) => void;

  /**
   * Returns true when the active role has AT LEAST the requested access level
   * for the given module.
   *
   * @example
   * const { can } = useRbacStore();
   * if (can("Campaign Management", "Full Access")) { ... }
   */
  can: (module: ModuleKey, requiredAccess: AccessLevel) => boolean;

  /**
   * Returns true when the active role has NO access to the module.
   * Convenience alias for `!can(module, "View Only")`.
   */
  isBlocked: (module: ModuleKey) => boolean;
}

// ─── Store Factory ────────────────────────────────────────────────────────────

function buildPermissions(profileData: UserProfileData): Permission[] {
  return profileData.permissions.map((p) => ({
    module: p.module as ModuleKey,
    access: p.access as AccessLevel,
    variant: p.variant,
  }));
}

export const useRbacStore = create<RBACState>()(
  persist(
    (set, get) => {
      const defaultProfile = USER_PROFILES["editor"];

      return {
        activeRole: "editor",
        profile: defaultProfile,
        permissions: buildPermissions(defaultProfile),

        setRole(key: RoleKey) {
          const profileData = USER_PROFILES[key];
          if (!profileData) return;

          set({
            activeRole: key,
            profile: profileData,
            permissions: buildPermissions(profileData),
          });

          // Keep legacy event alive so components still using
          // lib/user-roles.ts `getActiveProfile()` react correctly.
          if (typeof window !== "undefined") {
            localStorage.setItem("user-role", key);
            window.dispatchEvent(new Event("role-change"));
          }
        },

        can(module: ModuleKey, requiredAccess: AccessLevel): boolean {
          const perm = get().permissions.find((p) => p.module === module);
          if (!perm) return false;
          return ACCESS_RANK[perm.access] >= ACCESS_RANK[requiredAccess];
        },

        isBlocked(module: ModuleKey): boolean {
          const perm = get().permissions.find((p) => p.module === module);
          if (!perm) return true;
          return perm.access === "No Access";
        },
      };
    },
    {
      name: "mod-rbac-store",          // localStorage key
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never)
      ),
      // Only persist the role key — profile + permissions are derived on hydration
      partialize: (state) => ({ activeRole: state.activeRole }),
      onRehydrateStorage: () => (state) => {
        // After hydration, rebuild profile & permissions from the persisted role
        if (state) {
          const profileData = USER_PROFILES[state.activeRole];
          if (profileData) {
            state.profile = profileData;
            state.permissions = buildPermissions(profileData);
          }
        }
      },
    }
  )
);

// ─── Selector Helpers (use these to avoid re-render on unrelated state) ───────

/** Current role key only */
export const selectRole = (s: RBACState) => s.activeRole;

/** Current user profile */
export const selectProfile = (s: RBACState) => s.profile;

/** Permission list for the active role */
export const selectPermissions = (s: RBACState) => s.permissions;
