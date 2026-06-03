"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/features/dashboard/sidebar";
import { Header } from "@/components/features/dashboard/header";
import { Menu, X } from "lucide-react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const isCollapsed = !isHovered;

  React.useEffect(() => {
    // Tiny delay to ensure width is applied BEFORE transitions are enabled
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down
      setShowHeader(false);
    } else {
      // Scrolling up
      setShowHeader(true);
    }
    setLastScrollY(currentScrollY);
  };

  return (
    <div className="flex h-screen bg-[rgba(247,241,233,0.35)] text-slate-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 
          ${isMounted ? "transition-all duration-300" : "transition-none"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:w-16 w-56" : "w-56"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
          isCollapsed={isCollapsed}
          isMounted={isMounted}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header with Mobile Menu Toggle */}
        <div className={`
          absolute top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}>
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
        
        <main 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pb-8 pt-28 md:pt-32"
        >
          <div className="w-full max-w-[1600px] mx-auto px-8 md:px-[52px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
