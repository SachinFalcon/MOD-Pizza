"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRbac } from "@/hooks/use-rbac";
import {
  Bell,
  Search,
  Download,
  ChevronDown,
  Menu,
  Moon
} from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useRbac();
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="px-4 md:px-8 pt-6 pb-2">
      <header className="h-16 md:h-[80px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.025)] rounded-full flex items-center justify-between px-4 md:px-5 border border-slate-100/60">
        {/* Left Side: Mobile Menu & Search Bar */}
        <div className="flex items-center flex-1 max-w-[50%] md:max-w-[55%]">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 mr-2 text-slate-500 hover:text-[#A61932] transition-colors"
          >
            <Menu size={22} />
          </button>

          {/* Universal Search Bar with white magnifying glass button nested on right */}
          <div className="relative flex-grow hidden md:flex items-center bg-[#F1F3F5] rounded-full pr-1.5 pl-6 py-1 h-[52px]">
            <input
              type="text"
              placeholder="Campaign name, Outlet ID..."
              className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 outline-none w-full"
            />
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all shrink-0">
              <Search size={16} className="text-slate-900 font-bold" />
            </button>
          </div>

          <button className="md:hidden p-2.5 bg-[#F1F3F5] rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all">
            <Search size={18} />
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3 ml-4 shrink-0">
          {/* Export Button with nested white download circular container on left */}
          <button className="hidden md:flex items-center bg-[#F1F3F5] hover:bg-slate-200 rounded-full pl-1.5 pr-6 py-1.5 h-[52px] gap-3 transition-all active:scale-95">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
              <Download size={16} className="text-slate-800" />
            </div>
            <span className="text-sm font-bold text-slate-800">Export</span>
          </button>

          {/* Notifications Button */}
          <button className="w-[52px] h-[52px] bg-[#F1F3F5] hover:bg-slate-200 rounded-full text-slate-800 flex items-center justify-center relative active:scale-95 transition-all">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#A61932] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              28
            </span>
          </button>

          {/* Theme Toggle (Moon Icon)
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center relative active:scale-95 transition-all ${
              isDark ? 'bg-slate-900 text-yellow-400' : 'bg-[#F1F3F5] hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Moon size={18} />
          </button> */}

          {/* User Profile Info */}
          <Link href="/profile" className="flex items-center space-x-3 group cursor-pointer hover:opacity-90 transition-opacity pl-2">
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-bold text-slate-900 leading-tight">{profile.name}</p>
              <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end mt-0.5 tracking-wide">
                <ChevronDown size={11} className="mr-1 text-slate-400 group-hover:text-[#A61932] transition-colors" />
                <span>{profile.role}</span>
              </p>
            </div>
            <div className="h-[52px] w-[52px] rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md shrink-0">
              <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </header>
    </div>
  );
}
