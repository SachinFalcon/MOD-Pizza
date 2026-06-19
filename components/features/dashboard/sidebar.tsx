"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Library,
  Settings,
  FileText,
  X,
  Megaphone,
  Info,
  MapPin,
  CheckSquare,
  Calendar,
  Users
} from "lucide-react";
import { useRbac } from "@/hooks/use-rbac";
import { useApprovals } from "@/lib/contexts/approvals-context";

interface SidebarProps {
  onClose?: () => void;
  isCollapsed: boolean;
  isMounted?: boolean;
}

export function Sidebar({ onClose, isCollapsed, isMounted = true }: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useRbac();
  const { campaigns } = useApprovals();

  const isPublisher = profile.id === "publisher";
  const isAdmin = profile.id === "admin";
  const canViewOutlets = isPublisher || isAdmin;
  const canViewApprovals = isPublisher || isAdmin;
  const canViewSchedule = isPublisher || isAdmin;
  const canViewUsers = isPublisher || isAdmin;
  const pendingCount = campaigns.filter(c => c.status === "pending").length;

  return (
    <aside className={`
      h-full bg-[#FCFAF6] md:bg-transparent flex flex-col shrink-0 border-r border-slate-200 md:border-none
      ${isMounted ? "transition-all duration-300 ease-in-out" : "transition-none"}
      ${isCollapsed ? "md:w-16 w-56" : "w-56"}
    `}>
      <div className={`p-6 flex flex-col ${isCollapsed ? "md:items-center items-start" : "items-start"} relative`}>
        <div className="flex justify-between items-center w-full">
          <Link href="/" className={`flex flex-col ${isCollapsed ? "md:items-center items-start" : "items-start"}`}>
            {isCollapsed ? (
              <>
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="h-12 w-12 object-contain transition-all duration-300 hidden md:block md:scale-[2]"
                />
                <div className="flex items-center space-x-1 md:hidden">
                  <span className="text-2xl font-bold text-modRed tracking-tighter">MTAS</span>
                  <span className="text-2xl font-bold text-slate-900 tracking-tighter">HQ</span>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-modRed tracking-tighter">MTAS</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tighter">HQ</span>
              </div>
            )}
            {(!isCollapsed || (isCollapsed && true)) && (
              <p className={`text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-1 ml-1 ${isCollapsed ? "md:hidden block" : "block"}`}>
                Management
              </p>
            )}
          </Link>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-modRed transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <nav className={`flex-1 ${isCollapsed ? "md:px-2 px-4" : "px-4"} space-y-1 overflow-y-auto scrollbar-hide mt-4`}>
        <CategoryLabel label="OVERVIEW" isCollapsed={isCollapsed} />
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/dashboard"} onClick={onClose} isCollapsed={isCollapsed} />
        {canViewOutlets && (
          <SidebarItem href="/outlets" icon={<MapPin size={18} />} label="Outlet Network" active={pathname === "/outlets"} onClick={onClose} isCollapsed={isCollapsed} />
        )}

        <CategoryLabel label="MANAGE CAMPAIGNS" isCollapsed={isCollapsed} />
        <SidebarItem href="/campaigns" icon={<Megaphone size={18} />} label="Campaigns" active={pathname === "/campaigns"} onClick={onClose} isCollapsed={isCollapsed} />
        {canViewApprovals && (
          <SidebarItem 
            href="/approvals" 
            icon={<CheckSquare size={18} />} 
            label="Approvals" 
            active={pathname === "/approvals"} 
            onClick={onClose} 
            isCollapsed={isCollapsed} 
            badge={pendingCount > 0 ? <span className="bg-modRed text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{pendingCount}</span> : null}
          />
        )}
        {canViewSchedule && (
          <SidebarItem href="/schedule" icon={<Calendar size={18} />} label="Screen Schedule" active={pathname === "/schedule"} onClick={onClose} isCollapsed={isCollapsed} />
        )}
        <SidebarItem href="/library" icon={<Library size={18} />} label="Global Library" active={pathname === "/library"} onClick={onClose} isCollapsed={isCollapsed} />

        <CategoryLabel label="ANALYTICS" isCollapsed={isCollapsed} />
        <SidebarItem href="/reports" icon={<BarChart3 size={18} />} label="Reports & Insights" active={pathname === "/reports"} onClick={onClose} isCollapsed={isCollapsed} />

        <CategoryLabel label="SETTINGS" isCollapsed={isCollapsed} />
        {canViewUsers && (
          <SidebarItem href="/users" icon={<Users size={18} />} label="User Management" active={pathname === "/users"} onClick={onClose} isCollapsed={isCollapsed} />
        )}
        <SidebarItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/settings"} onClick={onClose} isCollapsed={isCollapsed} />
      </nav>

      {/* Storage Indicator at the bottom */}
      <div className={`p-6 mt-auto border-t border-slate-50 ${isCollapsed ? "md:hidden block" : "block"}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Storage</span>
            <Info size={12} className="text-slate-300" />
          </div>
          <span className="text-xs font-bold text-modRed">82%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-modRed w-[82%]"></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-widest">1.2 TB of 1.5 TB used</p>
      </div>

      {isCollapsed && (
        <div className="p-4 mt-auto border-t border-slate-50 hidden md:flex flex-col items-center">
           <div className="h-10 w-1 bg-slate-100 rounded-full relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-modRed h-[82%]"></div>
           </div>
           <span className="text-[10px] font-bold text-modRed mt-2">82%</span>
        </div>
      )}
    </aside>
  );
}

function CategoryLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  return (
    <div className={`text-[10px] font-bold text-modRed uppercase tracking-[0.2em] px-4 mb-2 mt-5 opacity-60 ${isCollapsed ? "md:hidden block" : "block"}`}>
      {label}
    </div>
  );
}

function SidebarItem({ 
  href, 
  icon, 
  label, 
  active = false, 
  onClick, 
  isCollapsed,
  badge
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
  isCollapsed: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div 
        className={`
          flex items-center rounded-xl cursor-pointer transition-all duration-200 group
          ${isCollapsed ? "md:w-10 md:h-10 md:mx-auto md:justify-center md:p-0 space-x-3 md:space-x-0 px-4 py-2" : "w-full space-x-3 px-4 py-2"}
          ${active ? 'bg-modRed text-white shadow-lg shadow-modRed/20' : 'text-slate-500 hover:bg-slate-50'}
        `}
      >
        <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-modRed'} transition-colors shrink-0`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold whitespace-nowrap flex-1 ${active ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'} ${isCollapsed ? "md:hidden block" : "block"}`}>{label}</span>
        {badge && (
          <div className={`${isCollapsed ? "hidden" : "block"}`}>
            {badge}
          </div>
        )}
      </div>
    </Link>
  );
}

