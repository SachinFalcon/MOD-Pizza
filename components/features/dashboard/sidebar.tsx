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
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMounted?: boolean;
}

export function Sidebar({ onClose, isCollapsed, onToggleCollapse, isMounted = true }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = React.useState<{
    label: string;
    rect: DOMRect;
  } | null>(null);

  const handleMouseEnter = (label: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredItem({ label, rect });
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleToggleCollapse = () => {
    setHoveredItem(null);
    onToggleCollapse();
  };

  return (
    <aside className={`
      h-full border-r border-slate-200 bg-white flex flex-col shrink-0 
      ${isMounted ? "transition-all duration-300 ease-in-out" : "transition-none"}
      ${isCollapsed ? "md:w-20 w-64" : "w-64"}
    `}>
      <div className={`p-6 flex flex-col ${isCollapsed ? "md:items-center items-start" : "items-start"} relative`}>
        <div className="flex justify-between items-center w-full">
          <Link href="/" className={`flex flex-col ${isCollapsed ? "md:items-center items-start" : "items-start"}`}>
            {isCollapsed ? (
              <>
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain transition-all duration-300 hidden md:block"
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

        {/* Collapse Toggle Button (Tablet & Desktop Only) */}
        <button 
          onClick={handleToggleCollapse}
          className="hidden md:flex absolute -right-3 top-10 h-6 w-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-modRed hover:border-modRed shadow-sm z-10 transition-all"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className={`flex-1 ${isCollapsed ? "md:px-2 px-4" : "px-4"} space-y-1 overflow-y-auto mt-4`}>
        <CategoryLabel label="OVERVIEW" isCollapsed={isCollapsed} />
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/dashboard"} onClick={onClose} isCollapsed={isCollapsed} onMouseEnter={handleMouseEnter("Dashboard")} onMouseLeave={handleMouseLeave} />

        <CategoryLabel label="MANAGE" isCollapsed={isCollapsed} />
        <SidebarItem href="/campaigns" icon={<Megaphone size={18} />} label="Campaigns" active={pathname === "/campaigns"} onClick={onClose} isCollapsed={isCollapsed} onMouseEnter={handleMouseEnter("Campaigns")} onMouseLeave={handleMouseLeave} />
        <SidebarItem href="/library" icon={<Library size={18} />} label="Global Library" active={pathname === "/library"} onClick={onClose} isCollapsed={isCollapsed} onMouseEnter={handleMouseEnter("Global Library")} onMouseLeave={handleMouseLeave} />

        <CategoryLabel label="ANALYTICS" isCollapsed={isCollapsed} />
        <SidebarItem href="/reports" icon={<FileText size={18} />} label="Reports & Insights" active={pathname === "/reports"} onClick={onClose} isCollapsed={isCollapsed} onMouseEnter={handleMouseEnter("Reports & Insights")} onMouseLeave={handleMouseLeave} />

        <CategoryLabel label="SYSTEM" isCollapsed={isCollapsed} />
        <SidebarItem href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/settings"} onClick={onClose} isCollapsed={isCollapsed} onMouseEnter={handleMouseEnter("Settings")} onMouseLeave={handleMouseLeave} />
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

      {isCollapsed && hoveredItem && (
        <div 
          className="fixed z-50 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none animate-tooltip whitespace-nowrap"
          style={{
            top: hoveredItem.rect.top + hoveredItem.rect.height / 2,
            left: hoveredItem.rect.right + 8,
          }}
        >
          {hoveredItem.label}
          {/* Tooltip arrow */}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
        </div>
      )}
    </aside>
  );
}

function CategoryLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  return (
    <div className={`text-[10px] font-bold text-modRed uppercase tracking-[0.2em] px-4 mb-3 mt-8 opacity-60 ${isCollapsed ? "md:hidden block" : "block"}`}>
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
  onMouseEnter,
  onMouseLeave
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
  isCollapsed: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          flex items-center rounded-xl cursor-pointer transition-all duration-200 group
          ${isCollapsed ? "md:justify-center md:p-3 space-x-3 px-4 py-3" : "space-x-3 px-4 py-3"}
          ${active ? 'bg-modRed text-white shadow-lg shadow-modRed/20' : 'text-slate-500 hover:bg-slate-50'}
        `}
      >
        <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-modRed'} transition-colors shrink-0`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold whitespace-nowrap ${active ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'} ${isCollapsed ? "md:hidden block" : "block"}`}>{label}</span>
      </div>
    </Link>
  );
}

