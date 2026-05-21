"use client";
/**
 * components/dev/role-switcher.tsx
 *
 * DEV/STAGING ONLY — floating role switcher for instant RBAC smoke testing.
 * Renders as a small docked panel only when NODE_ENV !== "production".
 *
 * UAT Checks:
 *  ✓ Editor   — Cannot see Timeline tab (Screen Scheduler: Read Only)
 *  ✓ Publisher — Cannot approve screen additions (guard: Full Access)
 *  ✓ Admin    — Full access to Archive & Restore runbooks
 */
import React, { useState } from "react";
import { useRbacActions, useRbac } from "@/hooks/use-rbac";
import type { RoleKey } from "@/store/rbac.store";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

const ROLES: { key: RoleKey; label: string; color: string; dot: string }[] = [
  { key: "editor",    label: "Editor",    color: "bg-slate-100 text-slate-700 hover:bg-slate-200", dot: "bg-slate-400"  },
  { key: "publisher", label: "Publisher", color: "bg-blue-50 text-blue-700 hover:bg-blue-100",     dot: "bg-blue-500"   },
  { key: "admin",     label: "Admin",     color: "bg-red-50 text-modRed hover:bg-red-100",         dot: "bg-modRed"     },
];

const RBAC_CHECKS: { label: string; module: string; require: string; roles: RoleKey[] }[] = [
  { label: "Timeline tab visible",      module: "Screen Scheduler",    require: "Full Access", roles: ["publisher", "admin"] },
  { label: "Create Campaign visible",   module: "Campaign Management", require: "Full Access", roles: ["editor", "publisher", "admin"] },
  { label: "Approvals Queue write",     module: "Approvals Queue",     require: "Full Access", roles: ["publisher", "admin"] },
  { label: "User Admin visible",        module: "User Administration", require: "Manage",      roles: ["admin"] },
];

export function DevRoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { role, can }   = useRbac();
  const { setRole }     = useRbacActions();

  // Never render in production
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-[#111827] text-white rounded-2xl shadow-2xl p-4 w-72 border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={15} className="text-modRed" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Dev RBAC Switcher</p>
          </div>

          {/* Role buttons */}
          <div className="flex gap-2 mb-4">
            {ROLES.map(({ key, label, color, dot }) => (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  role === key ? "ring-2 ring-modRed ring-offset-2 ring-offset-[#111827]" : ""
                } ${color}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </button>
            ))}
          </div>

          {/* RBAC permission matrix */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Permission Audit</p>
            {RBAC_CHECKS.map(({ label, module, require: req }) => {
              // Use the store's can() directly — cast to avoid import complexity
              const permitted = can(module as any, req as any);
              return (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-300 font-medium truncate">{label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    permitted ? "bg-emerald-900/60 text-emerald-400" : "bg-red-900/40 text-red-400"
                  }`}>
                    {permitted ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active role badge */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium">Active Role</span>
            <span className="text-[11px] font-black text-modRed uppercase tracking-widest">{role}</span>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white rounded-full shadow-2xl border border-white/10 text-[11px] font-bold hover:bg-[#1e2a3a] transition-all"
      >
        <ShieldCheck size={14} className="text-modRed" />
        <span>Dev: {role}</span>
        {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>
    </div>
  );
}
