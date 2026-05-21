"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  Key, 
  Edit3, 
  Globe, 
  Shield, 
  Check, 
  AlertCircle,
  Laptop,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { 
  USER_PROFILES, 
  getActiveProfile, 
  setActiveProfileKey, 
  getActiveProfileKey 
} from "@/config/user-roles";

export default function ProfilePage() {
  const [activeProfile, setActiveProfile] = useState(() => USER_PROFILES.editor);
  const [activeKey, setActiveKey] = useState("editor");

  useEffect(() => {
    const handleSync = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get("role");
        if (roleParam && USER_PROFILES[roleParam.toLowerCase()]) {
          localStorage.setItem("user-role", roleParam.toLowerCase());
          window.dispatchEvent(new Event("role-change"));
        }
      }
      setActiveProfile(getActiveProfile());
      setActiveKey(getActiveProfileKey());
    };

    handleSync();

    window.addEventListener("role-change", handleSync);
    return () => window.removeEventListener("role-change", handleSync);
  }, []);

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto overflow-x-hidden px-4 md:px-0 bg-[#F8F9FA]">
      
      {/* 1. Header Breadcrumbs & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 px-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <span className="text-modRed">{activeProfile.role}</span>
          <span>&gt;</span>
          <span>User Profile</span>
        </div>
        
        <div className="flex items-center justify-end gap-3 shrink-0">
          {/* Close Button */}
          <Link 
            href="/dashboard" 
            className="h-9 w-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-modRed hover:border-modRed transition-all active:scale-95 shadow-sm"
          >
            <X size={16} />
          </Link>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="px-4 space-y-6">
        
        {/* 2. Top Profile Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Left Avatar & Name display */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
            <div className="relative group">
              <div className="h-32 w-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-md overflow-hidden relative">
                <img 
                  src={activeProfile.avatarUrl} 
                  alt={activeProfile.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <span className="absolute bottom-1.5 right-1.5 h-4.5 w-4.5 bg-emerald-500 border-3 border-white rounded-full shadow" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-4 text-center">{activeProfile.name}</h3>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100 uppercase tracking-widest text-center shadow-sm">
              {activeProfile.roleLabel}
            </span>
          </div>

          {/* Right Detailed Metadata Grid */}
          <div className="flex-1 w-full flex flex-col justify-between self-stretch">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm font-semibold w-full">
              
              <div className="pb-4 border-b border-slate-100 sm:border-b-0 sm:pb-0">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Email</span>
                <span className="text-slate-950 font-bold break-all">{activeProfile.email}</span>
              </div>
              
              <div className="pb-4 border-b border-slate-100 sm:border-b-0 sm:pb-0 sm:border-l sm:pl-6 border-slate-100">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Phone</span>
                <span className="text-slate-950 font-bold">{activeProfile.phone}</span>
              </div>
              
              <div className="pb-4 border-b border-slate-100 md:border-b-0 md:pb-0 md:border-l md:pl-6 border-slate-100">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Scope</span>
                <span className="text-slate-950 font-bold">{activeProfile.scope}</span>
              </div>

              <div className="pb-4 border-b border-slate-100 sm:border-b-0 sm:pb-0 sm:pt-4 border-slate-100">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Joined</span>
                <span className="text-slate-950 font-bold">{activeProfile.joined}</span>
              </div>

              <div className="pb-4 border-b border-slate-100 sm:border-b-0 sm:pb-0 sm:pt-4 sm:border-l sm:pl-6 border-slate-100">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">Last Login</span>
                <span className="text-modRed font-bold">{activeProfile.lastLogin}</span>
              </div>
              
              <div className="pt-4 sm:col-span-2 md:col-span-1 md:pt-4 md:border-l md:pl-6 border-slate-100 flex items-center justify-end w-full">
                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-end mt-2 sm:mt-0">
                  <button className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white border border-red-200 text-modRed rounded-full font-bold text-xs hover:bg-red-50 transition-all shadow-sm active:scale-95 cursor-pointer w-full sm:w-auto">
                    <Key size={14} />
                    <span className="whitespace-nowrap">Change Password</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-5.5 py-2.5 bg-modRed text-white rounded-full font-bold text-xs hover:bg-[#8F161A] transition-all shadow-md shadow-modRed/10 active:scale-95 cursor-pointer w-full sm:w-auto">
                    <Edit3 size={14} />
                    <span className="whitespace-nowrap">Edit Profile</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. Dynamic Dual Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 2/3 COLUMN (Access & Permissions, Activity Log, Security Details) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Card: Access & Permissions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900">Access & Permissions</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  activeProfile.role === "Admin" ? "bg-red-50 text-modRed border-red-100" :
                  activeProfile.role === "Publisher" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  Role: {activeProfile.role}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-3 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Module</th>
                      <th className="pb-3 text-right font-bold text-slate-400 text-[10px] uppercase tracking-wider">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-800">
                    {activeProfile.permissions.map((perm, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-4 text-slate-900 text-sm font-bold">{perm.module}</td>
                        <td className="py-4 text-right">
                          <span className={`px-3 py-1 border rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                            perm.variant === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            perm.variant === "info" ? "bg-blue-50 text-blue-700 border-blue-100" :
                            perm.access === "No Access" ? "bg-slate-50 text-slate-400 border-slate-200/50" :
                            "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {perm.access}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card: Recent Activity Log */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900">Recent Activity Log</h3>
                <button className="text-xs font-bold text-modRed hover:underline cursor-pointer">View All</button>
              </div>

              {/* Desktop View: Full detailed table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-3 font-bold text-[10px] uppercase tracking-wider">Action</th>
                      <th className="pb-3 font-bold text-[10px] uppercase tracking-wider">Module</th>
                      <th className="pb-3 font-bold text-[10px] uppercase tracking-wider">Date</th>
                      <th className="pb-3 font-bold text-[10px] uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                    {activeProfile.activityLog.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-900 text-sm">
                          <div>{log.action}</div>
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5 block">Session active</span>
                        </td>
                        <td className="py-4 text-slate-500 font-bold">{log.module}</td>
                        <td className="py-4 text-slate-500 font-medium">{log.date}</td>
                        <td className="py-4 text-right">
                          <span className="text-emerald-600 font-bold text-xs tracking-wider flex items-center justify-end gap-1">
                            <Check size={12} strokeWidth={3} /> {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Sleek native vertical list */}
              <div className="block sm:hidden space-y-4">
                {activeProfile.activityLog.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start p-4 border border-slate-100 rounded-2xl bg-[#F8F9FA]/50 gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{log.action}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-slate-500 text-xs font-semibold">
                        <span>{log.module}</span>
                        <span className="text-slate-300">•</span>
                        <span>{log.date}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block pt-0.5">Session active</span>
                    </div>
                    <span className="text-emerald-600 font-extrabold text-xs tracking-wider flex items-center shrink-0 gap-0.5 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                      <Check size={10} strokeWidth={3.5} /> {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Security Settings / Two-Factor & Active Sessions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900">Security Settings</h3>
              
              {/* Info banner */}
              <div className="p-4 bg-red-50/40 border border-red-100/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Two-Factor Auth</h4>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Enabled since Dec 2023</p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer active:scale-95 transition-all shrink-0 w-full sm:w-auto text-center">
                  Manage 2FA
                </button>
              </div>

              {/* Active Sessions */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Active Sessions</h4>
                
                {/* Desktop View: Full detailed table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-[10px] uppercase font-bold text-slate-400">
                        <th className="pb-3">Device</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Login Time</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                      {activeProfile.activeSessions.map((session, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-4 text-slate-900 font-bold flex items-center gap-2">
                            {session.device.includes("iPhone") ? <Smartphone size={16} className="text-slate-400" /> : <Laptop size={16} className="text-slate-400" />}
                            <span>{session.device}</span>
                          </td>
                          <td className="py-4 text-slate-500 font-medium">{session.location}</td>
                          <td className="py-4 text-slate-500 font-medium">{session.loginTime}</td>
                          <td className="py-4 text-right">
                            {session.status === "current" ? (
                              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Current</span>
                            ) : (
                              <button className="text-modRed font-bold text-xs hover:underline cursor-pointer">Revoke</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Premium card layout */}
                <div className="block sm:hidden space-y-3">
                  {activeProfile.activeSessions.map((session, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-[#F8F9FA]/50 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                          {session.device.includes("iPhone") ? <Smartphone size={18} /> : <Laptop size={18} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{session.device}</h4>
                          <p className="text-slate-500 text-xs font-semibold mt-0.5">{session.location} • {session.loginTime}</p>
                        </div>
                      </div>
                      <div>
                        {session.status === "current" ? (
                          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">Current</span>
                        ) : (
                          <button className="text-modRed font-black text-xs hover:underline cursor-pointer">Revoke</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT 1/3 COLUMN (Regional Scope, Mini Security card) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Card: Scope */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Globe size={18} className="text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Scope</h3>
              </div>

              <div className="space-y-3">
                {activeProfile.scopeStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl font-bold bg-[#F8F9FA]/50">
                    <span className="text-slate-600 text-xs font-bold">{stat.region}</span>
                    <span className={`text-sm font-extrabold ${idx === 0 ? "text-modRed" : "text-slate-800"}`}>
                      {stat.count} Screens
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Security Settings Summary (Right Sidebar) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Security Settings</h3>
              </div>

              <div className="space-y-4 divide-y divide-slate-50 text-xs font-semibold">
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Password</span>
                  <span className="text-slate-900 font-extrabold tracking-wider">••••••••••••</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 pb-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">2FA Status</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100/50 rounded-md">
                    <CheckCircle2 size={10} strokeWidth={3} /> ACTIVE
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 pb-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Last Login</span>
                  <span className="text-slate-500 font-medium">{activeProfile.lastLogin.replace("Today, ", "Today at ")}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block px-0.5">Active Sessions</span>
                  
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <Laptop size={16} className="text-slate-400" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">Chrome on macOS</h4>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">IP: 192.168.1.45 (Current)</p>
                      </div>
                    </div>
                    <button className="text-modRed font-bold text-[10px] hover:underline uppercase tracking-wider cursor-pointer">
                      Revoke
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
