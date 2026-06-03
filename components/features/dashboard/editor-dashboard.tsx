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
  ArrowUp,
  ArrowDown,
  ChevronsUpDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KPICard, TaskItem, QuickActionButton, OpportunityItem, PerformanceGauge } from "@/components/features/dashboard/stats";
import { USAMap } from "@/components/features/dashboard/usa-map";
import { api, DashboardStats, Campaign, DashboardTask, Opportunity, PerformanceInsights, EditorRanking } from "@/services/mock.service";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";
import { GhibliBanner } from "@/components/features/dashboard/ghibli/ghibli-banner";

const FALLBACK_TASKS: DashboardTask[] = [
  { title: "Weekend Combo Deal", desc: "Campaign setup is not yet completed", actionLabel: "Fix Now" },
  { title: "Cheese Burst Promo", desc: "Publisher requested modification", actionLabel: "Edit" },
  { title: "Student Combo Deal", desc: "Campaign is ready for approval", actionLabel: "Send" },
  { title: "Summer Refresh", desc: "Awaiting publisher approval", status: "In Review" }
];

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  { title: "Memorial Day", date: "May 27", sub: "Suggested: BBQ Pizza Offer" },
  { title: "NBA Playoffs", date: "May 21", sub: "Suggested: Game Night Combo" }
];

const FALLBACK_INSIGHTS: PerformanceInsights = {
  approvalRate: 82,
  bestPerformingDay: "Friday"
};

const FALLBACK_RANKING: EditorRanking = {
  rank: 2,
  hours: "324 screen hours",
  topCampaign: "Weekend Pizza Offer"
};

function parseLastEditToDate(lastEditStr: string): Date {
  const now = new Date();
  const lower = lastEditStr.toLowerCase().trim();

  if (lower.includes("now") || lower.includes("min") || lower.includes("hr") || lower.includes("hour")) {
    return now;
  }
  if (lower.includes("yesterday")) {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return yesterday;
  }

  const parsed = Date.parse(lastEditStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }

  return now;
}

export default function EditorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [insights, setInsights] = useState<PerformanceInsights | null>(null);
  const [ranking, setRanking] = useState<EditorRanking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: 'asc' | 'desc' } | null>(null);

  // Date Calendar States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, campaignsData, tasksData, opportunitiesData, insightsData, rankingData] = await Promise.all([
        api.getStats(),
        api.getCampaigns(),
        api.getDashboardTasks(),
        api.getDashboardOpportunities(),
        api.getPerformanceInsights(),
        api.getEditorRanking()
      ]);
      setStats(statsData);
      setCampaigns(campaignsData);
      setTasks(tasksData);
      setOpportunities(opportunitiesData);
      setInsights(insightsData);
      setRanking(rankingData);
    } catch (error) {
      console.error("Dashboard data fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSort = (key: keyof Campaign) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const sortedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // Filter by custom date range if selected
    if (startDate && endDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      result = result.filter(camp => {
        const lastEditDate = parseLastEditToDate(camp.lastEdit);
        return lastEditDate >= startOfDay && lastEditDate <= endOfDay;
      });
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let valA: any = a[key];
        let valB: any = b[key];

        if (key === "outlets") {
          valA = parseInt(a.outlets, 10) || 0;
          valB = parseInt(b.outlets, 10) || 0;
        } else if (key === "runtime") {
          valA = parseInt(a.runtime, 10) || 0;
          valB = parseInt(b.runtime, 10) || 0;
        } else if (key === "lastEdit") {
          valA = parseLastEditToDate(a.lastEdit).getTime();
          valB = parseLastEditToDate(b.lastEdit).getTime();
        } else {
          valA = String(valA || "").toLowerCase();
          valB = String(valB || "").toLowerCase();
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result.slice(0, 4);
  }, [campaigns, sortConfig, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, []);

  const SortHeader = ({ label, sortKey }: { label: string, sortKey: keyof Campaign }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <th
        className="px-4 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-modRed transition-colors select-none"
        onClick={() => requestSort(sortKey)}
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          {isActive ? (
            sortConfig.direction === 'asc' ? <ArrowUp size={11} className="text-modRed" /> : <ArrowDown size={11} className="text-modRed" />
          ) : (
            <ArrowUpDown size={11} className="opacity-40" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-transparent">
      {/* 1. Header Title & Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">Hi, Dev Sachin! <span className="ml-2">🍕</span></h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Your campaigns delivered 1,284 hours this month.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-[rgba(255,255,255,0.75)] border border-slate-200 rounded-full text-slate-400 hover:text-modRed transition-all active:rotate-180 duration-500"
            title="Refresh Stats"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <FilterButton icon={<Globe size={18} strokeWidth={2} />} label="All USA" onClick={() => alert("Region Filter: All USA Selected")} />
          <div className="relative">
            <FilterButton
              icon={<Calendar size={18} strokeWidth={2} className={startDate && endDate ? "text-modRed" : ""} />}
              label={startDate && endDate
                ? `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`
                : "Today"}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            />
            <DateRangePickerPopover
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
                setIsCalendarOpen(false);
              }}
              onClear={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setIsCalendarOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 px-4">
        {/* 2. Top Row: Metrics and Animated MOD Banner */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <KPICard title="Live Campaigns" value={stats?.liveCampaigns.toString() || "..."} trend="+5%" iconType="megaphone" href="/campaigns?status=Live" />
          <KPICard title="Awaiting Approval" value={stats?.awaitingApproval.toString() || "..."} unit="Hrs" trend="-3%" iconType="clock" href="/campaigns?status=Sent+for+Approval" />
          <KPICard title="Campaigns Created" value={stats?.campaignsCreated.toString() || "..."} trend="-2%" iconType="target" />
          <KPICard title="Avg Coverage" value={stats ? `${stats.avgCoverage}%` : "..."} trend="+0.2%" iconType="rocket" />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <GhibliBanner />
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
              {(tasks.length > 0 ? tasks : FALLBACK_TASKS).map((task, idx) => (
                <TaskItem
                  key={idx}
                  title={task.title}
                  desc={task.desc}
                  actionLabel={task.actionLabel}
                  status={task.status}
                />
              ))}
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
          <div className="overflow-x-auto w-full pt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#EFEBE4] text-slate-800 border-b border-slate-200/50">
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
                    status={camp.status === 'Draft' ? 'Draft' : camp.status === 'Approved' ? 'Approved' : camp.status === 'Sent for Approval' ? 'Sent for Approval' : 'Sent'}
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
            <div className="pt-2">
              <USAMap />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 p-6 shadow-[(0,0,0,0.18)]">
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
              <h3 className="text-3xl font-black tracking-tight text-modRed">Your Rank #{ranking?.rank ?? FALLBACK_RANKING.rank}</h3>
              <p className="text-sm text-white/80 font-medium mt-1">Top: {ranking?.topCampaign ?? FALLBACK_RANKING.topCampaign}</p>
            </div>
            <div className="relative z-10 mt-5">
              <div className="inline-flex items-center px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest border border-slate-700">{ranking?.hours ?? FALLBACK_RANKING.hours}</div>
            </div>
            <div className="absolute right-0 bottom-0 text-white/5 select-none pointer-events-none transform translate-x-2 translate-y-2"><Trophy size={110} /></div>
          </div>

          {/* Opportunities */}
          <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 p-6 shadow-[(0,0,0,0.18)]">
            <h2 className="text-lg font-bold text-slate-900">Opportunities</h2>
            <p className="text-sm text-slate-500 font-medium mb-5">Upcoming events</p>
            <div className="mb-8 p-6 bg-white rounded-lg border border-slate-200 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 px-1 relative z-10">
                <span className="text-[15px] font-bold text-slate-700">May 2025</span>
                <div className="flex space-x-3">
                  <button className="text-slate-300 hover:text-slate-500 transition-colors"><ChevronLeft size={14} strokeWidth={3} /></button>
                  <button className="text-slate-300 hover:text-slate-500 transition-colors"><ChevronRight size={14} strokeWidth={3} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center relative z-10">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={`${d}-${i}`} className="text-[11px] font-bold text-slate-600 mb-2 uppercase">{d}</span>)}
                {Array.from({ length: 31 }).map((_, i) => {
                  const is21 = i + 1 === 21;
                  const is27 = i + 1 === 27;
                  return (
                    <span key={i} className={`text-[13px] font-medium h-8 w-8 mx-auto rounded-full transition-all cursor-pointer flex items-center justify-center ${is21 || is27 ? 'bg-[#A61932] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{i + 1}</span>
                  );
                })}
              </div>
            </div>
            <div className="space-y-6 px-1">
              {(opportunities.length > 0 ? opportunities : FALLBACK_OPPORTUNITIES).map((opp, idx) => (
                <OpportunityItem
                  key={idx}
                  title={opp.title}
                  date={opp.date}
                  sub={opp.sub}
                />
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 p-6 shadow-[(0,0,0,0.18)]">
            <h2 className="text-lg font-bold text-slate-900 mb-8">Performance Insights</h2>

            <div className="flex flex-col items-center text-center space-y-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Approval Rate</p>
                <p className="text-4xl font-bold text-slate-900 flex items-center justify-center tracking-tighter">
                  {insights?.approvalRate ?? FALLBACK_INSIGHTS.approvalRate}% <ArrowUpRight size={28} strokeWidth={2.5} className="ml-2 text-[#10B981]" />
                </p>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              <div className="w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Best Performing Day</p>
                <p className="text-4xl font-bold text-[#10B981] flex items-center justify-center tracking-tighter">
                  {insights?.bestPerformingDay ?? FALLBACK_INSIGHTS.bestPerformingDay} <Zap size={24} strokeWidth={2.5} className="ml-2 text-[#10B981] fill-[#10B981]/20" />
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
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/campaigns/${id}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-[#FCFDFD] transition-colors group cursor-pointer"
    >
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
    "Sent for Approval": "bg-blue-50 text-blue-700 border-blue-100",
    "Draft": "bg-slate-50 text-slate-600 border-slate-200",
  };
  const icons: Record<string, React.ReactNode> = {
    "Approved": <CheckCircle2 size={12} />,
    "Sent": <ExternalLink size={12} />,
    "Sent for Approval": <ExternalLink size={12} />,
    "Draft": <AlertCircle size={12} />,
  };
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-tight ${styles[status]}`}>
      {icons[status]}
      <span>{status}</span>
    </div>
  );
}
