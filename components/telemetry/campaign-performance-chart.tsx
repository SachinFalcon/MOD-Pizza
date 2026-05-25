"use client";

import React from "react";
import { Monitor, Clock } from "lucide-react";

interface LeaderboardItem {
  id: number;
  title: string;
  coverage: number;
  screens: string;
  runtime: string;
}

const LEADERBOARD_ITEMS: LeaderboardItem[] = [
  { id: 1, title: "Weekend Pizza Offer", coverage: 94, screens: "1,240", runtime: "14,200h" },
  { id: 2, title: "Lunch Rush Combo", coverage: 84, screens: "1,240", runtime: "14,200h" },
  { id: 3, title: "Student Combo Deal", coverage: 68, screens: "1,240", runtime: "14,200h" },
];

export function CampaignPerformanceChart() {
  return (
    <div className="space-y-6 py-2">
      {LEADERBOARD_ITEMS.map((item) => (
        <div key={item.id} className="space-y-2">
          {/* Header Row */}
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-900 text-[15px]">{item.title}</span>
            <span className="text-[#A61932] text-[14px]">{item.coverage}% Coverage</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3.5 bg-[#FCF5F5] rounded-md overflow-hidden w-full">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-[#A61932] rounded-md transition-all duration-500" 
              style={{ width: `${item.coverage}%` }}
            />
          </div>

          {/* Metadata Row */}
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Monitor size={14} className="text-slate-400" />
              <span>{item.screens} Screens</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock size={14} className="text-slate-400" />
              <span>{item.runtime} Runtime</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
