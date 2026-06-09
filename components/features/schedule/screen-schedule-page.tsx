"use client";

import React, { useState } from "react";
import { ChevronDown, Search, Lock, ArrowLeft, ArrowRight, X } from "lucide-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";

type ScheduleBlock = {
  id: string;
  title: string;
  time: string;
  type: "normal" | "locked";
};

type OutletRow = {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  schedule: Record<string, ScheduleBlock[]>;
};

const days = [
  { id: "MON", label: "MON", date: "10 Mar" },
  { id: "TUE", label: "TUE", date: "11 Mar" },
  { id: "WED", label: "WED", date: "12 Mar" },
  { id: "THU", label: "THU", date: "13 Mar" },
  { id: "FRI", label: "FRI", date: "14 Mar" },
  { id: "SAT", label: "SAT", date: "15 Mar" },
  { id: "SUN", label: "SUN", date: "16 Mar" },
];

const mockData: OutletRow[] = [
  {
    id: "#Outl01",
    name: "Buckeye",
    addressLine1: "19550 W Indian School Road, Suite 105",
    addressLine2: "Buckeye, Arizona, 85340 US",
    schedule: {
      "MON": [
        { id: "1", title: "Weekend Family Deal", time: "12:00 - 20:00", type: "normal" },
        { id: "2", title: "Lunch Promo", time: "20:00 - 23:50", type: "normal" }
      ],
      "TUE": [
        { id: "3", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ],
      "WED": [
        { id: "4", title: "Brand Awareness", time: "12:00 - 20:00", type: "normal" }
      ],
      "FRI": [
        { id: "5", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl02",
    name: "Goodyear",
    addressLine1: "1380 N Litchfield Rd",
    addressLine2: "Suite K3 Goodyear, Arizona, 85395 US",
    schedule: {
      "TUE": [
        { id: "6", title: "Community News", time: "14:00 - 20:00", type: "locked" }
      ],
      "WED": [
        { id: "7", title: "Brand Awareness", time: "12:00 - 20:00", type: "normal" },
        { id: "7-1", title: "Lunch Promo", time: "14:00 - 16:00", type: "normal" },
        { id: "7-2", title: "Evening Combo", time: "18:00 - 22:00", type: "normal" }
      ],
      "SAT": [
        { id: "8", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl03",
    name: "Buckeye",
    addressLine1: "19550 W Indian School Road, Suite 105",
    addressLine2: "Buckeye, Arizona, 85340 US",
    schedule: {
      "MON": [
        { id: "9", title: "Brand Awareness", time: "12:00 - 20:00", type: "normal" }
      ],
      "SUN": [
        { id: "10", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" },
        { id: "11", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl04",
    name: "Goodyear",
    addressLine1: "1380 N Litchfield Rd",
    addressLine2: "Suite K3 Goodyear, Arizona, 85395 US",
    schedule: {
      "MON": [
        { id: "12", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" },
        { id: "13", title: "Community News", time: "14:00 - 20:00", type: "locked" }
      ],
      "THU": [
        { id: "14", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl05",
    name: "Prescott Valley",
    addressLine1: "3007 N Glassford Hill Rd Prescott",
    addressLine2: "Valley, Arizona, 86314 US",
    schedule: {
      "TUE": [
        { id: "15", title: "Weekend Family Deal", time: "12:00 - 20:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl06",
    name: "Carefree Highway",
    addressLine1: "5355 E Carefree Hwy Building D, Suite",
    addressLine2: "101 Cave Creek, Arizona, 85331 US",
    schedule: {
      "SAT": [
        { id: "16", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ]
    }
  },
  {
    id: "#Outl07",
    name: "Maricopa",
    addressLine1: "20320 N John Wayne Parkway, Suite 100",
    addressLine2: "Maricopa, Arizona, 85139 US",
    schedule: {
      "TUE": [
        { id: "17", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" },
        { id: "17-1", title: "Lunch Promo", time: "14:00 - 16:00", type: "normal" },
        { id: "17-2", title: "Evening Combo", time: "18:00 - 22:00", type: "normal" },
        { id: "17-3", title: "Late Night", time: "22:00 - 23:59", type: "normal" }
      ],
      "THU": [
        { id: "18", title: "Morning Combo", time: "06:10 - 14:00", type: "normal" }
      ],
      "SUN": [
        { id: "19", title: "Community News", time: "14:00 - 20:00", type: "locked" }
      ]
    }
  }
];

function BlockCard({ block }: { block: ScheduleBlock }) {
  return (
    <div
      className={`
        relative rounded-sm p-2 flex flex-col gap-0.5 w-full
        ${block.type === 'normal' 
          ? 'bg-[#F9EBED] border-l-[3px] border-modRed text-slate-900' 
          : 'bg-[#1A2634] text-white border-l-[3px] border-slate-700'
        }
      `}
    >
      {block.type === 'locked' && (
        <div className="flex items-center gap-1 mb-0.5">
          <Lock size={10} className="text-white" />
          <span className="text-[11px] font-bold leading-tight line-clamp-1">{block.title}</span>
        </div>
      )}
      {block.type === 'normal' && (
        <span className="text-[11px] font-bold leading-tight line-clamp-2">{block.title}</span>
      )}
      <span className={`text-[10px] ${block.type === 'normal' ? 'text-slate-600' : 'text-slate-400'}`}>
        {block.time}
      </span>
    </div>
  );
}

export default function ScreenSchedulePage() {
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const [region, setRegion] = useState("Arizona");
  const [timeframe, setTimeframe] = useState("Last 7 Days");
  const [campaignType, setCampaignType] = useState("All Campaigns");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Screen Schedule</h1>
        <p className="text-slate-500 text-sm mt-1">
          Plan, monitor, and manage campaign playback schedules across all screens.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <FilterDropdown
            options={["Arizona", "California", "Texas", "New York", "Florida"]}
            value={region}
            onChange={setRegion}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[160px]"
          />

          <FilterDropdown
            options={["Today", "Last 7 Days", "Last 30 Days", "This Month"]}
            value={timeframe}
            onChange={setTimeframe}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[140px]"
          />

          <FilterDropdown
            options={["All Campaigns", "Live", "Scheduled", "Draft", "Paused"]}
            value={campaignType}
            onChange={setCampaignType}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[160px]"
          />
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto min-w-[280px]">
          <input
            type="text"
            placeholder="Search...."
            className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-modRed focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Grid Header */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="w-[280px] shrink-0 border-r border-slate-200 p-4 flex items-center justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Outlet Name</span>
          </div>
          {days.map((day) => (
            <div key={day.id} className="flex-1 min-w-[120px] border-r border-slate-200 last:border-r-0 p-4 flex flex-col items-center justify-center">
              <span className="text-[13px] font-bold text-slate-900">{day.label}</span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">{day.date}</span>
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex-1 overflow-y-auto">
          {mockData.map((row, rowIndex) => (
            <div key={row.id} className="flex border-b border-slate-200 last:border-b-0 min-h-[120px]">
              {/* Outlet Info */}
              <div className="w-[280px] shrink-0 border-r border-slate-200 p-4">
                <span className="text-[11px] font-bold text-slate-400 mb-1 block">{row.id}</span>
                <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">{row.name}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {row.addressLine1}<br />
                  {row.addressLine2}
                </p>
              </div>

              {/* Days Columns */}
              {days.map((day) => {
                const blocks = row.schedule[day.id] || [];
                const cellKey = `${row.id}-${day.id}`;
                const isExpanded = expandedCell === cellKey;
                const isStacked = blocks.length > 2 && !isExpanded;

                return (
                  <div 
                    key={day.id} 
                    className="relative flex-1 min-w-[120px] border-r border-slate-200 last:border-r-0 p-2 flex flex-col gap-2"
                    onMouseEnter={() => {
                      if (blocks.length > 2) setExpandedCell(cellKey);
                    }}
                    onMouseLeave={() => setExpandedCell(null)}
                  >
                    {isStacked ? (
                      <div className="relative w-full cursor-pointer group mt-1 h-[48px]">
                        {/* Stacked background shadows */}
                        <div className="absolute inset-x-0 top-0 h-full bg-[#F9EBED] border-l-[3px] border-modRed/60 rounded-sm translate-y-1.5 translate-x-1 z-0 shadow-sm"></div>
                        <div className="absolute inset-x-0 top-0 h-full bg-[#F9EBED] border-l-[3px] border-modRed/40 rounded-sm translate-y-3 translate-x-2 z-0 shadow-sm"></div>
                        
                        {/* Top card */}
                        <div className="absolute inset-x-0 top-0 h-full bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm p-2 z-10 group-hover:brightness-95 transition-all shadow-sm">
                           <div className="absolute -top-2 -right-2 bg-modRed text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                             +{blocks.length - 1}
                           </div>
                           <span className="text-[11px] font-bold text-slate-900 block truncate leading-tight">{blocks[0].title}</span>
                           <span className="text-[10px] text-slate-600 mt-0.5 block">{blocks[0].time}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {isExpanded ? (
                          <>
                            {/* Absolute container that expands up and down seamlessly */}
                            <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
                               {blocks.map(block => (
                                 <div key={block.id} className="shadow-lg rounded-sm bg-white">
                                   <BlockCard block={block} />
                                 </div>
                               ))}
                            </div>
                            
                            {/* Keep a placeholder underneath so cell doesn't collapse if it had height */}
                            <div className="opacity-0 pointer-events-none">
                              <BlockCard block={blocks[0]} />
                            </div>
                          </>
                        ) : (
                          blocks.map(block => (
                             <BlockCard key={block.id} block={block} />
                          ))
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-center gap-6 mt-6 shrink-0 pb-4">
        <button className="flex items-center gap-2 text-modRed hover:text-red-700 font-semibold text-sm transition-colors">
          <ArrowLeft size={16} />
          Previous Week
        </button>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-900 shadow-sm">
          Mar 10 - Mar 16, 2024
        </div>
        <button className="flex items-center gap-2 text-modRed hover:text-red-700 font-semibold text-sm transition-colors">
          Next Week
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

