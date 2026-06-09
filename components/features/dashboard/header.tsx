"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRbac, useRbacActions } from "@/hooks/use-rbac";
import {
  Bell,
  Search,
  Download,
  ChevronDown,
  Menu,
  Moon,
  Settings,
  LogOut,
  Users
} from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useRbac();
  const { setRole } = useRbacActions();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-4 md:px-8 pt-6 pb-2 max-w-[1600px] mx-auto">
      <header className="h-16 md:h-[80px] bg-white shadow-[(0,0,0,0.18)] rounded-full flex items-center justify-between px-4 md:px-5 border border-slate-100/60">
        {/* Left Side: Mobile Menu & Search Bar */}
        <div className="flex items-center flex-1 max-w-[50%] md:max-w-[55%]">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 mr-2 text-slate-500 hover:text-[#A61932] transition-colors"
          >
            <Menu size={22} />
          </button>

          {/* Universal Search Bar with white magnifying glass button nested on right */}
          <div className="relative flex-grow hidden md:flex items-center bg-[rgba(31,31,31,0.05)] rounded-full pr-1.5 pl-6 py-1 h-[52px] shadow-[(0,0,0,0.18)]">
            <input
              type="text"
              placeholder="Campaign name, Outlet ID..."
              className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 outline-none w-full"
            />
            <button className="w-10 h-10 bg-[rgba(247,241,233,0.35)] rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all shrink-0">
              <Search size={16} className="text-slate-900 font-bold" />
            </button>
          </div>

          <button className="md:hidden p-2.5 bg-[rgba(31,31,31,0.05)] rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all">
            <Search size={18} />
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3 ml-4 shrink-0">
          {/* Export Button with nested white download circular container on left */}
          <button className="hidden md:flex items-center bg-[rgba(31,31,31,0.05)] hover:bg-slate-200 rounded-full pl-1.5 pr-6 py-1.5 h-[52px] gap-3 transition-all active:scale-95">
            <div className="w-10 h-10 bg-[rgba(247,241,233,0.35)] rounded-full flex items-center justify-center border border-slate-100 shrink-0">
              <Download size={16} className="text-slate-800" />
            </div>
            <span className="text-sm font-bold text-slate-800">Export</span>
          </button>

          {/* Notifications Button */}
          <button className="w-[52px] h-[52px] bg-[rgba(31,31,31,0.05)] hover:bg-slate-200 rounded-full text-slate-800 flex items-center justify-center relative active:scale-95 transition-all">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#A61932] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              28
            </span>
          </button>

          {/* User Profile Info Dropdown */}
          <div className="relative pl-2" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 group cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-none outline-none"
            >
              <div className="hidden sm:block text-right">
                <p className="text-[13px] font-bold text-slate-900 leading-tight">{profile.name}</p>
                <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end mt-0.5 tracking-wide">
                  <ChevronDown size={11} className={`mr-1 text-slate-400 group-hover:text-[#A61932] transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  <span>{profile.role}</span>
                </p>
              </div>
              <div className="h-[52px] w-[52px] rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md shrink-0">
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[(0,0,0,0.18)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-sm font-bold text-slate-900">{profile.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{profile.email}</p>
                </div>
                
                <Link 
                  href="/profile" 
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-modRed transition-colors"
                >
                  <Settings size={16} />
                  <span>Profile Settings</span>
                </Link>

                <div className="px-4 py-2.5 group/account relative flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-modRed transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users size={16} />
                    <span>Switch Account</span>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 opacity-50 group/account-hover:opacity-100" />
                  
                  {/* Nested dropdown for roles */}
                  <div className="absolute right-[100%] top-0 mr-1 w-48 bg-white rounded-xl shadow-[(0,0,0,0.18)] border border-slate-100 py-2 hidden group-hover/account:block animate-in fade-in slide-in-from-right-2">
                    <div className="px-4 py-1.5 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Roles</p>
                    </div>
                    <button 
                      onClick={() => { setRole("editor"); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-modRed transition-colors"
                    >
                      Editor (Dev Sachin)
                    </button>
                    <button 
                      onClick={() => { setRole("publisher"); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-modRed transition-colors"
                    >
                      Publisher (Dev Ajay)
                    </button>
                    <button 
                      onClick={() => { setRole("admin"); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-modRed transition-colors"
                    >
                      Admin (Dev Sachin)
                    </button>
                  </div>
                </div>

                <div className="my-1 border-t border-slate-50"></div>
                
                <Link 
                  href="/auth/login"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
