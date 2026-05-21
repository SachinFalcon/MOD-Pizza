"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Calendar, 
  ChevronDown,
  Globe,
  Zap,
  ArrowUpRight,
  Target,
  BarChart3,
  MoreVertical,
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Upload,
  MessageSquare,
  FileText,
  Bell,
  RefreshCw,
  ArrowUpDown,
  ChevronsUpDown
} from "lucide-react";
import Link from "next/link";
import { KPICard, TaskItem, QuickActionButton, OpportunityItem, PerformanceGauge } from "@/components/features/dashboard/stats";
import { USAMap } from "@/components/features/dashboard/usa-map";
import { api, DashboardStats, Campaign } from "@/services/mock.service";

export default function EditorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: 'asc' | 'desc' } | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, campaignsData] = await Promise.all([
        api.getStats(),
        api.getCampaigns()
      ]);
      setStats(statsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Dashboard data fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSort = (key: keyof Campaign) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = useMemo(() => {
    let result = [...campaigns];
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue! < bValue!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue! > bValue!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result.slice(0, 4);
  }, [campaigns, sortConfig]);

  useEffect(() => {
    fetchData();
  }, []);

  const SortHeader = ({ label, sortKey }: { label: string, sortKey: keyof Campaign }) => (
    <th className="px-4 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-modRed transition-colors" onClick={() => requestSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={12} />
      </div>
    </th>
  );

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto overflow-x-hidden px-4 md:px-0 bg-[#F9FAFB]">
      {/* 1. Header Title & Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 px-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">Hi, Nolan! <span className="ml-2">🍕</span></h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Your campaigns delivered 1,284 hours this month.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={fetchData}
            className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-modRed transition-all shadow-sm active:rotate-180 duration-500"
            title="Refresh Stats"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <FilterButton icon={<Globe size={18} strokeWidth={2} />} label="All USA" onClick={() => alert("Region Filter: All USA Selected")} />
          <FilterButton icon={<Calendar size={18} strokeWidth={2} />} label="Today" onClick={() => alert("Date Filter: Today Selected")} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 px-4">
        {/* 2. Top Row: Metrics and Animated MOD Banner */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <KPICard title="Live Campaigns" value={stats?.liveCampaigns.toString() || "..."} trend="+5%" iconType="megaphone" />
          <KPICard title="Awaiting Approval" value={stats?.awaitingApproval.toString() || "..."} unit="Hrs" trend="-3%" iconType="clock" />
          <KPICard title="Campaigns Created" value={stats?.campaignsCreated.toString() || "..."} trend="-2%" iconType="target" />
          <KPICard title="Avg Coverage" value={stats ? `${stats.avgCoverage}%` : "..."} trend="+0.2%" iconType="rocket" />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="bg-[#BD1720] rounded-xl p-8 text-white relative overflow-hidden shadow-lg h-full flex items-center min-h-[220px] group cursor-pointer transition-all">
            {/* Image Ingredients Background */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
               {/* Top Right: Dill */}
               <img src="/images/spinach.png" alt="" className="absolute top-4 right-[25%] w-14 h-14 object-contain rotate-12 opacity-90" />
               {/* Top Center: Parsley */}
               <img src="/images/spinach2.png" alt="" className="absolute top-10 left-[48%] w-8 h-8 object-contain -rotate-12 opacity-90" />
               {/* Middle Left: Pepperoni */}
               <img src="/images/pice.png" alt="" className="absolute top-[45%] left-[42%] w-10 h-10 object-contain rotate-12 opacity-90" />
               {/* Center Right (near M): Bell Pepper */}
               <img src="/images/shimlamirch.png" alt="" className="absolute top-[52%] right-[32%] w-12 h-12 object-contain -rotate-12 opacity-90" />
               {/* Bottom Middle: Tomato */}
               <img src="/images/chilli.png" alt="" className="absolute bottom-4 left-[52%] w-14 h-14 object-contain -rotate-12 opacity-90" />
               {/* Bottom Left: Onion Rings */}
               <img src="/images/onionrings.png" alt="" className="absolute -bottom-4 -left-2 w-16 h-16 object-contain opacity-90" />
               {/* Bottom Right: Mushroom */}
               <img src="/images/mushroom.png" alt="" className="absolute bottom-6 right-2 w-12 h-12 object-contain opacity-90" />
               {/* Lower Right: Small Bell Pepper */}
               <img src="/images/shimlamirch.png" alt="" className="absolute bottom-12 right-[24%] w-8 h-8 object-contain rotate-45 opacity-80" />
            </div>

            <div className="relative z-20 w-full max-w-[340px] shrink-0">
              <h3 className="text-[26px] font-bold leading-tight tracking-tight">Create Campaigns for Approval</h3>
              <p className="text-[14px] text-white/90 mt-2 font-medium leading-relaxed">Design and submit campaigns for review to get them live across outlets.</p>
              <Link href="/campaigns" className="mt-8 flex items-center justify-center space-x-3 px-8 py-3 bg-white/10 border-2 border-white/40 text-white rounded-lg text-[16px] font-bold hover:bg-white/20 transition-all active:scale-95 shadow-sm min-w-[260px] cursor-pointer">
                <Plus size={22} strokeWidth={2.5} />
                <span>Create New Campaign</span>
              </Link>
            </div>
            
            {/* Scalable MOD text and pizza on the right */}
            <div className="absolute right-0 lg:right-6 top-1/2 -translate-y-1/2 flex items-center justify-end select-none pointer-events-none origin-right transform scale-[0.6] md:scale-[0.7] xl:scale-95">
              <div className="relative flex items-center text-[130px] font-extrabold text-white leading-none">
                <span className="relative z-0 -mr-4 transform scale-x-[0.6] scale-y-[1.35] origin-right group-hover:animate-slide-out-left transition-transform duration-600">M</span>
                <div className="w-[180px] h-[180px] relative z-10 shrink-0 group-hover:animate-pizza-grow transition-transform duration-600 origin-center">
                  <img src="/images/pizza.png" alt="" className="w-full h-full object-contain drop-shadow-2xl animate-[spin_30s_linear_infinite]" />
                </div>
                <span className="relative z-0 -ml-4 transform scale-x-[0.6] scale-y-[1.35] origin-left group-hover:animate-slide-out-right transition-transform duration-600">D</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID BODY */}
        
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Campaign Tasks */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Campaign Tasks</h3>
              <button className="text-xs font-semibold text-modRed hover:underline underline-offset-4 uppercase">View All Tasks</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <TaskItem title="Weekend Combo Deal" desc="Campaign setup is not yet completed" actionLabel="Fix Now" />
              <TaskItem title="Cheese Burst Promo" desc="Publisher requested modification" actionLabel="Edit" />
              <TaskItem title="Student Combo Deal" desc="Campaign is ready for approval" actionLabel="Send" />
              <TaskItem title="Summer Refresh" desc="Awaiting publisher approval" status="In Review" />
            </div>
          </div>

          {/* Top Campaign Banner */}
          <div className="bg-[#FCF5F5] rounded-xl border border-red-100 p-5 flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-modRed/10 flex items-center justify-center text-modRed shrink-0">
              <Zap size={20} />
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              <span className="font-bold text-slate-900 mr-2">Top Campaign This Week:</span>
              Weekend Pizza Offer generated <span className="font-bold text-modRed">324 screen hours</span> across <span className="font-bold text-modRed">138 screens</span>.
            </p>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-slate-50">
                <tr>
                  <SortHeader label="Campaign" sortKey="name" />
                  <SortHeader label="Outlets" sortKey="outlets" />
                  <SortHeader label="Runtime" sortKey="runtime" />
                  <th className="px-4 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Coverage</th>
                  <SortHeader label="Status" sortKey="status" />
                  <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : sortedCampaigns.map((camp, idx) => (
                  <CampaignDataRow 
                    key={idx}
                    name={camp.name}
                    id={camp.id}
                    outlets={camp.outlets}
                    runtime={camp.runtime}
                    coverage={75}
                    status={camp.status === 'Draft' ? 'Draft' : camp.status === 'Approved' ? 'Approved' : 'Sent'} 
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Distribution Map */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Campaign Distribution</h3>
              <button className="text-xs font-semibold text-modRed hover:underline underline-offset-4 uppercase">View All</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
              <USAMap />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton icon={<Upload size={20} />} label="Upload Assets" sub="Add to Library" />
              <QuickActionButton icon={<MessageSquare size={20} />} label="Publisher Feedback" sub="Review" />
              <QuickActionButton icon={<FileText size={20} />} label="Templates" sub="Pre-built" />
              <QuickActionButton icon={<Bell size={20} />} label="Notify Publisher" sub="Send" />
            </div>
          </div>

          {/* Editor Ranking */}
          <div className="bg-[#111827] rounded-xl p-6 text-white relative overflow-hidden group shadow-lg min-h-[140px] flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-widest mb-2 opacity-70">
                <Trophy size={14} className="text-white" />
                <span>Editor Ranking</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-modRed">Your Rank #2</h3>
              <p className="text-sm text-white/80 font-medium mt-1">Top: Weekend Pizza Offer</p>
            </div>
            <div className="relative z-10 mt-5">
              <div className="inline-flex items-center px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest border border-slate-700">324 screen hours</div>
            </div>
            <div className="absolute right-0 bottom-0 text-white/5 select-none pointer-events-none transform translate-x-2 translate-y-2"><Trophy size={110} /></div>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Opportunities</h2>
            <p className="text-sm text-slate-500 font-medium mb-5">Upcoming events</p>
            <div className="mb-6 p-4 bg-[#F8F9FA] rounded-xl border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 px-1 relative z-10">
                <span className="text-sm font-bold text-slate-800">May 2025</span>
                <div className="flex space-x-2">
                  <button className="text-slate-400 hover:text-modRed transition-colors"><ChevronLeft size={16} /></button>
                  <button className="text-slate-400 hover:text-modRed transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center relative z-10">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={`${d}-${i}`} className="text-xs font-bold text-slate-400 mb-2">{d}</span>)}
                {Array.from({ length: 31 }).map((_, i) => {
                  const is21 = i + 1 === 21;
                  const is27 = i + 1 === 27;
                  return (
                    <span key={i} className={`text-xs font-semibold py-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${is21 || is27 ? 'bg-modRed text-white shadow-md shadow-modRed/20' : 'text-slate-600 hover:bg-slate-100'}`}>{i + 1}</span>
                  );
                })}
              </div>
            </div>
            <div className="space-y-6 px-1">
              <OpportunityItem title="Memorial Day" date="May 27" sub="Suggested: BBQ Pizza Offer" />
              <OpportunityItem title="NBA Playoffs" date="May 21" sub="Suggested: Game Night Combo" />
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-8">Performance Insights</h2>
            
            <div className="flex flex-col items-center text-center space-y-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Approval Rate</p>
                <p className="text-4xl font-bold text-slate-900 flex items-center justify-center tracking-tighter">
                  82% <ArrowUpRight size={28} strokeWidth={2.5} className="ml-2 text-[#10B981]" />
                </p>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              <div className="w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Best Performing Day</p>
                <p className="text-4xl font-bold text-[#10B981] flex items-center justify-center tracking-tighter">
                  Friday <Zap size={24} strokeWidth={2.5} className="ml-2 text-[#10B981] fill-[#10B981]/20" />
                </p>
                <p className="text-sm text-slate-500 font-medium mt-3">Highest engagement peak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-2 bg-[#F4F4F5] rounded-full px-5 py-2.5 text-[15px] font-medium text-slate-900 cursor-pointer hover:bg-[#E4E4E7] transition-all active:scale-95 shadow-sm"
    >
      <div className="text-slate-900">{icon}</div>
      <span>{label}</span>
      <ChevronDown size={18} className="text-slate-600 ml-1" />
    </div>
  );
}

function CampaignDataRow({ name, id, outlets, runtime, coverage, status }: { name: string; id: string; outlets: string; runtime: string; coverage: number; status: string }) {
  return (
    <tr className="hover:bg-[#FCFDFD] transition-colors group">
      <td className="px-6 py-4">
        <Link href={`/campaigns/${id}`} className="text-sm font-bold text-slate-900 hover:text-modRed transition-colors">
          {name}
        </Link>
        <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {id}</p>
      </td>
      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-600">{outlets}</td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-600">{runtime}</td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-modRed" style={{ width: `${coverage}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-600">{coverage}%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <CampaignStatusBadge status={status} />
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical size={18} /></button>
      </td>
    </tr>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Approved": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Sent": "bg-blue-50 text-blue-700 border-blue-100",
    "Draft": "bg-slate-50 text-slate-600 border-slate-200",
  };
  const icons: Record<string, React.ReactNode> = {
    "Approved": <CheckCircle2 size={12} />,
    "Sent": <ExternalLink size={12} />,
    "Draft": <AlertCircle size={12} />,
  };
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-tight ${styles[status]}`}>
      {icons[status]}
      <span>{status}</span>
    </div>
  );
}
