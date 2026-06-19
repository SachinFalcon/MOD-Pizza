"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Lock } from "lucide-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { MultiSelectDropdown } from "@/components/atoms/multi-select-dropdown";

type ViewMode = "week" | "month" | "year";

// Helper to calculate top and height for Week View blocks
// Time range: 05:00 to 23:00 (18 hours)
// Interval: 3 hours = 120px. So 1 hour = 40px.
const getBlockStyle = (startTime: string, endTime: string) => {
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h + (m || 0) / 60;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const duration = end - start;

  // Offset from 05:00
  const top = (start - 5) * 40;
  const height = duration * 40;

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
};

const weekMockData = [
  {
    day: "MON", date: "10 Apr",
    blocks: [
      { id: 1, title: "Breakfast Promo", time: "06:00 - 10:30", type: "normal", start: "06:00", end: "10:30", badge: "" },
      { id: 2, title: "Brand Awareness", time: "15:00 - 22:45", type: "normal", start: "15:00", end: "22:45", badge: "+1", isStacked: true },
    ]
  },
  {
    day: "TUE", date: "11 Apr",
    blocks: [
      { id: 3, title: "Cheesy Delight Offer", time: "12:00 - 17:20", type: "normal", start: "12:00", end: "17:20", badge: "" },
      { id: 4, title: "Buy 1 Get 1 Pizza...", time: "22:45 - 23:20", type: "locked", start: "22:45", end: "23:20", badge: "" },
    ]
  },
  {
    day: "WED", date: "12 Apr",
    blocks: [
      { id: 5, title: "Breakfast Promo", time: "07:30 - 09:20", type: "normal", start: "07:30", end: "09:20", badge: "" },
      { id: 6, title: "Buy 1 Get 1 Pizza...", time: "13:05 - 14:20", type: "locked", start: "13:05", end: "14:20", badge: "" },
    ]
  },
  {
    day: "THU", date: "13 Apr",
    blocks: [
      { id: 7, title: "Pizza Party Pack", time: "17:10 - 22:00", type: "normal", start: "17:10", end: "22:00", badge: "+2", isStacked: true },
    ]
  },
  {
    day: "FRI", date: "14 Apr",
    blocks: [
      { id: 8, title: "Festive Pizza Carnival", time: "10:30 - 12:00", type: "normal", start: "10:30", end: "12:00", badge: "" },
    ]
  },
  {
    day: "SAT", date: "15 Apr",
    blocks: [
      { id: 9, title: "Family Feast Deal", time: "15:35 - 20:20", type: "locked", start: "15:35", end: "20:20", badge: "" },
    ]
  },
  {
    day: "SUN", date: "16 Apr",
    blocks: [
      { id: 10, title: "Weekend Pizza Bon...", time: "15:10 - 16:00", type: "normal", start: "15:10", end: "16:00", badge: "" },
      { id: 11, title: "Weekend Pizza Bon...", time: "21:10 - 23:50", type: "normal", start: "21:10", end: "23:50", badge: "" },
    ]
  },
];

const locationOptions = [
  { id: "Alabama", label: "Alabama", subLabel: "South, USA" },
  { id: "Arizona", label: "Arizona", subLabel: "West, USA" },
  { id: "California", label: "California", subLabel: "West, USA" },
  { id: "Colorado", label: "Colorado", subLabel: "West, USA" },
  { id: "Florida", label: "Florida", subLabel: "South, USA" },
  { id: "Georgia", label: "Georgia", subLabel: "South, USA" },
];

const selected1Options = [
  { id: "Buckeye", label: "Buckeye", subLabel: "1 Outlet" },
  { id: "Cave Creek", label: "Cave Creek", subLabel: "1 Outlet" },
  { id: "Chandler", label: "Chandler", subLabel: "1 Outlet" },
  { id: "Gilbert", label: "Gilbert", subLabel: "3 Outlets" },
  { id: "Glendale", label: "Glendale", subLabel: "1 Outlet" },
  { id: "Goodyear", label: "Goodyear", subLabel: "1 Outlet" },
];

const selected2Options = [
  { id: "19550", label: "19550 W Indian School Road, Suite 105 Buckeye, Arizona, 85340" },
  { id: "5355", label: "5355 E Carefree Hwy Building D, Suite 101 Cave Creek, Arizona, 85331" },
  { id: "3977", label: "3977 S Arizona Ave Suite 4 Chandler, Arizona, 85248" },
  { id: "7480", label: "7480 W Bell Rd Suite 110 Glendale, Arizona, 85308" },
  { id: "1380", label: "1380 N Litchfield Rd Suite K3 Goodyear, Arizona, 85395" },
  { id: "3007", label: "3007 N Glassford Hill Rd Prescott Valley, Arizona, 86314" },
  { id: "20320", label: "20320 N John Wayne Parkway, Suite 100 Maricopa, Arizona, 85139" },
];

export default function AdminScreenSchedulePage() {
  const [view, setView] = useState<ViewMode>("week");
  const [locationIds, setLocationIds] = useState<string[]>(["Arizona"]);
  const [selected1Ids, setSelected1Ids] = useState<string[]>(["Buckeye", "Cave Creek", "Chandler", "Glendale", "Goodyear"]);
  const [selected2Ids, setSelected2Ids] = useState<string[]>(["19550", "5355", "3977", "7480", "1380", "3007", "20320"]);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-[22px] font-bold text-slate-900 mb-1">
          {view === "year" ? "Yearly Schedule" : view === "month" ? "Monthly Schedule" : "Screen Schedule"}
        </h1>
        <p className="text-[13px] text-slate-500">
          Plan, monitor, and manage campaign schedules across the {view}.
        </p>
      </div>

      {/* Top Controls Row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 shrink-0">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <MultiSelectDropdown
            label="Arizona"
            options={locationOptions}
            selectedIds={locationIds}
            onChange={setLocationIds}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[140px] shadow-sm"
          />

          <MultiSelectDropdown
            label="Cities"
            options={selected1Options}
            selectedIds={selected1Ids}
            onChange={setSelected1Ids}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[140px] shadow-sm"
          />

          <MultiSelectDropdown
            label="Outlets"
            options={selected2Options}
            selectedIds={selected2Ids}
            onChange={setSelected2Ids}
            buttonClassName="flex items-center justify-between space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-modRed hover:bg-slate-50 transition-all cursor-pointer min-w-[140px] shadow-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 xl:gap-6">
          {/* Date Header */}
          <div className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm h-[40px]">
            <button className="p-1 hover:bg-slate-50 rounded text-slate-700 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-3 text-sm font-bold text-slate-900 min-w-[100px] justify-center">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>
                {view === "week" && "Apr 10 – Apr 16, 2026"}
                {view === "month" && "April 2026"}
                {view === "year" && "2026"}
              </span>
            </div>
            <button className="p-1 hover:bg-slate-50 rounded text-slate-700 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 shadow-inner h-[40px]">
            {(["week", "month", "year"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`capitalize px-5 py-1 rounded-md text-sm font-bold transition-all h-full ${
                  view === v ? "bg-white shadow-sm text-modRed" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-auto">
        {view === "week" && <WeekView />}
        {view === "month" && <MonthView />}
        {view === "year" && <YearView />}
      </div>

    </div>
  );
}

function WeekView() {
  const times = [5, 8, 11, 14, 17, 20, 23];

  return (
    <div className="border border-slate-200 rounded-xl bg-white flex flex-col min-w-[800px] shadow-sm">
      {/* Header row */}
      <div className="flex border-b border-slate-200 bg-[#fbfcfd]">
        <div className="w-[70px] shrink-0 border-r border-slate-200"></div>
        {weekMockData.map((day, i) => (
          <div key={i} className="flex-1 border-r border-slate-200 last:border-r-0 py-4 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{day.day}</span>
            <span className="text-[14px] font-bold text-slate-900 mt-0.5">{day.date}</span>
          </div>
        ))}
      </div>
      
      {/* Body */}
      <div className="relative flex h-[840px]">
        {/* Times Column */}
        <div className="w-[70px] shrink-0 border-r border-slate-200 flex flex-col">
          {times.map(hour => (
            <div key={hour} className="flex-1 border-b border-slate-200 last:border-b-0 flex items-start justify-center pt-2">
              <span className="text-[11px] font-medium text-slate-400">{hour.toString().padStart(2, '0')}:00</span>
            </div>
          ))}
        </div>
        
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0 left-[70px] flex flex-col pointer-events-none">
          {times.map(hour => (
            <div key={hour} className="flex-1 border-b border-slate-100 last:border-b-0"></div>
          ))}
        </div>

        {/* Columns for Blocks */}
        <div className="flex-1 flex relative">
          {weekMockData.map((day, i) => (
            <div key={i} className="flex-1 border-r border-slate-100 last:border-r-0 relative group">
              
              {/* Current Time Line Mock (Only on Tuesday) */}
              {i === 1 && (
                <div className="absolute left-0 right-0 h-[2px] bg-[#f06277] z-20 pointer-events-none" style={{ top: '220px' }}>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-[10px] h-[10px] rounded-full bg-[#f06277]"></div>
                </div>
              )}

              {day.blocks.map(block => {
                const style = getBlockStyle(block.start, block.end);
                
                if (block.isStacked) {
                  return (
                    <div key={block.id} className="absolute left-1 right-3 z-10" style={style}>
                       <div className="absolute inset-0 bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm shadow-sm translate-y-1.5 translate-x-1.5 z-0 opacity-60"></div>
                       <div className="absolute inset-0 bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm shadow-sm translate-y-3 translate-x-3 z-0 opacity-40"></div>
                       
                       <div className="absolute inset-0 bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm shadow-sm p-2 z-10 flex flex-col">
                         <div className="absolute -top-2 -right-2 bg-modRed text-white text-[10px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                           {block.badge}
                         </div>
                         <span className="text-[11px] font-bold text-slate-900 leading-tight block">{block.title}</span>
                         <span className="text-[9px] text-slate-500 mt-0.5 block">{block.time}</span>
                         <span className="text-[10px] font-bold text-modRed mt-auto">[AZ]</span>
                       </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={block.id} 
                    className={`absolute left-1 right-3 rounded-sm p-2 flex flex-col shadow-sm z-10 ${
                      block.type === 'normal' 
                        ? 'bg-[#F9EBED] border-l-[3px] border-modRed' 
                        : 'bg-[#1e293b] border-l-[3px] border-slate-600'
                    }`}
                    style={style}
                  >
                    {block.type === 'locked' ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Lock size={10} className="text-white shrink-0" />
                          <span className="text-[11px] font-bold text-white leading-tight truncate">{block.title}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5">{block.time}</span>
                        <span className="text-[10px] font-bold text-slate-300 mt-auto">[AZ]</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-slate-900 leading-tight block">{block.title}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5 block">{block.time}</span>
                        <span className="text-[10px] font-bold text-modRed mt-auto">[AZ]</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthView() {
  const dates = Array.from({ length: 35 }, (_, i) => {
    // Generate dates: 30, 31, 01, 02...
    let day = i - 1; 
    if (day <= 0) return 30 + day;
    if (day > 30) return day - 30;
    return day;
  });

  return (
    <div className="border border-slate-200 rounded-xl bg-white flex flex-col min-w-[1000px] shadow-sm">
      <div className="flex border-b border-slate-200 bg-[#fbfcfd]">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
          <div key={day} className="flex-1 border-r border-slate-200 last:border-r-0 py-4 flex justify-center">
            <span className="text-[12px] font-bold text-slate-900">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col flex-1">
        {[0,1,2,3,4].map(row => (
          <div key={row} className="flex flex-1 border-b border-slate-200 last:border-b-0">
            {[0,1,2,3,4,5,6].map(col => {
              const dateStr = dates[row * 7 + col].toString().padStart(2, '0');
              const isOtherMonth = (row === 0 && (col === 0 || col === 1)) || (row === 4 && col > 4);
              
              return (
                <div key={col} className={`flex-1 border-r border-slate-200 last:border-r-0 p-3 flex flex-col gap-1.5 min-h-[140px] ${isOtherMonth ? 'bg-slate-50/50' : 'bg-white'}`}>
                  <span className={`text-[13px] font-bold mb-1 ${isOtherMonth ? 'text-slate-400' : 'text-slate-700'}`}>{dateStr}</span>
                  
                  {/* Mock Blocks for Month view */}
                  {!isOtherMonth && row < 4 && (
                    <>
                      <div className="bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm px-2 py-1.5 text-[10px] font-bold text-slate-900 truncate">
                        [AZ] Double Cheese Burst
                      </div>
                      <div className="bg-[#F9EBED] border-l-[3px] border-modRed rounded-sm px-2 py-1.5 text-[10px] font-bold text-slate-900 truncate">
                        [AZ] Stuffed Crust Launch
                      </div>
                      {(row === 1 || col === 3 || col === 4) && (
                        <span className="text-[11px] font-bold text-modRed mt-1">+1 more</span>
                      )}
                      {(row !== 1 && col !== 3 && col !== 4 && row !== 0) && (
                        <span className="text-[11px] font-bold text-modRed mt-1">+2 more</span>
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
  );
}

function YearView() {
  const months = [
    { name: "January", active: 18, peak: "24 Jan", campaigns: 28, outlets: 10 },
    { name: "February", active: 16, peak: "20 Feb", campaigns: 26, outlets: 9 },
    { name: "March", active: 20, peak: "14 Mar", campaigns: 32, outlets: 12, trend: { val: "12%", type: "up", vs: "Feb" } },
    { name: "April", active: 19, peak: "11 Apr", campaigns: 30, outlets: 11, trend: { val: "5%", type: "up", vs: "Mar" } },
    { name: "May", active: 21, peak: "16 May", campaigns: 31, outlets: 13, trend: { val: "3%", type: "up", vs: "Apr" } },
    { name: "June", active: 22, peak: "18 Jun", campaigns: 33, outlets: 14, trend: { val: "6%", type: "up", vs: "May" } },
    { name: "July", active: 23, peak: "12 Jul", campaigns: 34, outlets: 15, highlight: "Busiest Month", trend: { val: "2%", type: "up", vs: "Jun" } },
    { name: "August", active: 20, peak: "15 Aug", campaigns: 31, outlets: 12, trend: { val: "4%", type: "down", vs: "Jul" } },
    { name: "September", active: 18, peak: "10 Sep", campaigns: 32, outlets: 11, trend: { val: "6%", type: "down", vs: "Aug" } },
    { name: "October", active: 21, peak: "17 Oct", campaigns: 35, outlets: 13, trend: { val: "9%", type: "up", vs: "Sep" } },
    { name: "November", active: 19, peak: "13 Nov", campaigns: 33, outlets: 11, trend: { val: "6%", type: "down", vs: "Oct" } },
    { name: "December", active: 22, peak: "19 Dec", campaigns: 36, outlets: 14, trend: { val: "8%", type: "up", vs: "Nov" } },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map(month => (
            <div key={month.name} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[15px] text-slate-900">{month.name}</h3>
                {month.highlight && (
                  <span className="bg-[#fff8e6] text-[#eab308] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    {month.highlight}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-7 mb-1.5">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                  <div key={d} className="text-[8px] font-bold text-slate-500 text-center">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {Array(35).fill(0).map((_, i) => {
                  // Create heat map pattern
                  const rand = Math.random();
                  let bgColor = "bg-slate-100";
                  if (rand > 0.95) bgColor = "bg-[#A61932]"; // 21+
                  else if (rand > 0.8) bgColor = "bg-red-500"; // 11-20
                  else if (rand > 0.6) bgColor = "bg-red-300"; // 6-10
                  else if (rand > 0.3) bgColor = "bg-red-100"; // 1-5
                  
                  // Empty cells at start/end to simulate real calendar
                  if (i < 2 || i > 31) bgColor = "bg-transparent";

                  return (
                    <div key={i} className={`h-[10px] rounded-[2px] ${bgColor}`}></div>
                  );
                })}
              </div>
              
              {/* Stats Columns */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3.5 h-3.5 text-modRed" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    <span className="text-[13px] font-bold text-slate-900">{month.campaigns}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Campaigns</span>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-[13px] font-bold text-slate-900">{month.active}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Active Days</span>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span className="text-[13px] font-bold text-slate-900">{month.outlets}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Outlets</span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-[10px] text-slate-500">Peak Day: <span className="text-slate-700 font-semibold">{month.peak}</span></span>
                </div>
                
                {month.trend && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold ${month.trend.type === 'up' ? 'text-emerald-600' : 'text-modRed'}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {month.trend.type === 'up' 
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      }
                    </svg>
                    <span>{month.trend.val} vs {month.trend.vs}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 shrink-0 flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        {/* Legend Colors */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-bold text-slate-700">Campaign Load (by day)</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><div className="w-4 h-2.5 bg-slate-100 rounded-[2px]"></div><span className="text-[11px] font-medium text-slate-500">No Campaign</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-2.5 bg-red-100 rounded-[2px]"></div><span className="text-[11px] font-medium text-slate-500">1-5 Campaigns</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-2.5 bg-red-300 rounded-[2px]"></div><span className="text-[11px] font-medium text-slate-500">6-10 Campaigns</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-2.5 bg-red-500 rounded-[2px]"></div><span className="text-[11px] font-medium text-slate-500">11-20 Campaigns</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-2.5 bg-[#A61932] rounded-[2px]"></div><span className="text-[11px] font-medium text-slate-500">21+ Campaigns</span></div>
          </div>
        </div>
        
        {/* Legend Icons */}
        <div className="flex items-start gap-6">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-modRed mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700">Campaigns</span>
              <span className="text-[10px] text-slate-500">Total campaign count</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700">Active Days</span>
              <span className="text-[10px] text-slate-500">Days with at least 1 campaign</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700">Outlets</span>
              <span className="text-[10px] text-slate-500">Unique outlets with scheduled campaigns</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-modRed mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700">Peak Day</span>
              <span className="text-[10px] text-slate-500">Day with the highest campaigns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
