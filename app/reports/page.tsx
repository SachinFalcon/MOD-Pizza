"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download, Search, ChevronDown, AlertCircle,
  ChevronLeft, ChevronRight, FileDown,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import { api, DashboardStats } from "@/services/mock.service";
import { ScreenHealthHeatmap } from "@/components/telemetry/screen-health-heatmap";
import { CampaignPerformanceChart } from "@/components/telemetry/campaign-performance-chart";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";

const MOCK_DETAILED_CAMPAIGNS = [
  { name: "Boost Menu Promo", id: "AD-94821", created: "Mar 31", submitted: "Mar 31", approvalType: "Auto", runtime: "20m", status: "Approved", reason: "-" },
  { name: "BOGO Weekend Pizza", id: "AD-94823", created: "Mar 30", submitted: "Mar 30", approvalType: "Manual", runtime: "48h", status: "Live", reason: "-" },
  { name: "Late Night Delivery", id: "AD-94825", created: "Mar 29", submitted: "Mar 29", approvalType: "Manual", runtime: "12h", status: "Sent", reason: "Under Review" },
  { name: "Student Lunch Combo", id: "AD-94822", created: "Mar 28", submitted: "Mar 28", approvalType: "Auto", runtime: "0", status: "Draft", reason: "Missing Info" },
  { name: "Holiday Family Special", id: "AD-94821", created: "Mar 25", submitted: "Mar 26", approvalType: "Manual", runtime: "72h", status: "Live", reason: "-" },
  { name: "Friday Night Feasts", id: "AD-94825", created: "Mar 24", submitted: "Mar 24", approvalType: "Auto", runtime: "18h", status: "Approved", reason: "-" },
  { name: "Cheese Crust Upgrade", id: "AD-94823", created: "Mar 22", submitted: "Mar 22", approvalType: "Manual", runtime: "0", status: "Under Modification", reason: "Creative Update" },
  { name: "Midweek Crunch Combo", id: "AD-94822", created: "Mar 20", submitted: "Mar 20", approvalType: "Auto", runtime: "8h", status: "Live", reason: "-" },
  { name: "Veggie Supreme Offer", id: "AD-94825", created: "Mar 18", submitted: "Mar 18", approvalType: "Manual", runtime: "24h", status: "Approved", reason: "-" },
  { name: "Morning Coffee & Bites", id: "AD-94824", created: "Mar 15", submitted: "Mar 15", approvalType: "Auto", runtime: "0", status: "Draft", reason: "Awaiting Assets" },
];

const MOCK_INSIGHTS = [
  { id: "cp-001", name: "Late Night Pizza", issue: "Low coverage", rec: "Request wider outlet distribution" },
  { id: "cp-002", name: "Student Combo Deal", issue: "Low runtime", rec: "Improve creative quality/length" },
  { id: "cp-003", name: "Late Night Pizza", issue: "Low coverage", rec: "Request wider outlet distribution" },
];

export default function ReportsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>(MOCK_DETAILED_CAMPAIGNS);
  const [insights, setInsights] = useState<any[]>(MOCK_INSIGHTS);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDateRange, setSelectedDateRange] = useState<string>("30 Days");
  const [detailedSearchQuery, setDetailedSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All USA");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  // Sorting state for Detailed Campaign Data
  const [reportsSortBy, setReportsSortBy] = useState<"name" | "created" | "submitted" | "approvalType" | "runtime" | "status" | "reason" | null>(null);
  const [reportsSortOrder, setReportsSortOrder] = useState<"asc" | "desc">("asc");

  // Sorting state for Underperforming Campaign Insights
  const [insightsSortBy, setInsightsSortBy] = useState<"name" | "issue" | "rec" | null>(null);
  const [insightsSortOrder, setInsightsSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let isMounted = true;
    api.getCampaigns()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          const merged = data.map((c, idx) => {
            const fallbackById = MOCK_DETAILED_CAMPAIGNS.find(item => item.id === c.id);
            const fallbackByIndex = MOCK_DETAILED_CAMPAIGNS[idx % MOCK_DETAILED_CAMPAIGNS.length];
            const fallback = fallbackById || fallbackByIndex || {};

            return {
              id: c.id,
              name: c.name,
              runtime: c.runtime ? c.runtime.replace(/\s*hrs?/gi, "h").replace(/\s*mins?/gi, "m") : (fallback.runtime || "0"),
              status: c.status || fallback.status || "Draft",
              created: (c as any).created || fallback.created || "Mar 01",
              submitted: (c as any).submitted || fallback.submitted || "Mar 01",
              approvalType: (c as any).approvalType || fallback.approvalType || "Auto",
              reason: (c as any).reason || fallback.reason || "-",
            };
          });
          setCampaigns(merged);

          // Update insights dynamically based on fetched campaigns
          const updatedInsights = MOCK_INSIGHTS.map(insight => {
            const matchingCamp = data.find(c => c.id === insight.id);
            return {
              ...insight,
              name: matchingCamp ? matchingCamp.name : insight.name
            };
          });
          setInsights(updatedInsights);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load campaigns in reports page", err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReportsSort = (column: "name" | "created" | "submitted" | "approvalType" | "runtime" | "status" | "reason") => {
    if (reportsSortBy === column) {
      setReportsSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setReportsSortBy(column);
      setReportsSortOrder("asc");
    }
  };

  const handleInsightsSort = (column: "name" | "issue" | "rec") => {
    if (insightsSortBy === column) {
      setInsightsSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setInsightsSortBy(column);
      setInsightsSortOrder("asc");
    }
  };

  // Helper date parser for "MMM DD" (e.g. "Mar 31")
  const parseReportDate = (dateStr: string) => {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const parts = dateStr.toLowerCase().trim().split(/\s+/);
    if (parts.length >= 2) {
      const month = months[parts[0]];
      const day = parseInt(parts[1], 10);
      if (month !== undefined && !isNaN(day)) {
        return month * 100 + day;
      }
    }
    return 0;
  };

  // Helper runtime parser (e.g. "20m", "48h", "0")
  const parseRuntimeToMins = (runtimeStr: string) => {
    const str = runtimeStr.toLowerCase().trim();
    if (str === "0" || !str) return 0;
    if (str.endsWith("m")) {
      return parseInt(str, 10) || 0;
    }
    if (str.endsWith("h")) {
      return (parseInt(str, 10) || 0) * 60;
    }
    return parseInt(str, 10) || 0;
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(detailedSearchQuery.toLowerCase())
  );

  const sortedCampaigns = React.useMemo(() => {
    if (!reportsSortBy) return filteredCampaigns;
    return [...filteredCampaigns].sort((a, b) => {
      let valA: any = "";
      let valB: any = "";
      
      if (reportsSortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (reportsSortBy === "created") {
        valA = parseReportDate(a.created);
        valB = parseReportDate(b.created);
      } else if (reportsSortBy === "submitted") {
        valA = parseReportDate(a.submitted);
        valB = parseReportDate(b.submitted);
      } else if (reportsSortBy === "approvalType") {
        valA = a.approvalType.toLowerCase();
        valB = b.approvalType.toLowerCase();
      } else if (reportsSortBy === "runtime") {
        valA = parseRuntimeToMins(a.runtime);
        valB = parseRuntimeToMins(b.runtime);
      } else if (reportsSortBy === "status") {
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
      } else if (reportsSortBy === "reason") {
        valA = a.reason.toLowerCase();
        valB = b.reason.toLowerCase();
      }
      
      if (typeof valA === "number" && typeof valB === "number") {
        return reportsSortOrder === "asc" ? valA - valB : valB - valA;
      }
      
      if (valA < valB) return reportsSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return reportsSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCampaigns, reportsSortBy, reportsSortOrder]);

  const sortedInsights = React.useMemo(() => {
    if (!insightsSortBy) return insights;
    return [...insights].sort((a, b) => {
      let valA = "";
      let valB = "";
      if (insightsSortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (insightsSortBy === "issue") {
        valA = a.issue.toLowerCase();
        valB = b.issue.toLowerCase();
      } else if (insightsSortBy === "rec") {
        valA = a.rec.toLowerCase();
        valB = b.rec.toLowerCase();
      }
      if (valA < valB) return insightsSortOrder === "asc" ? -1 : 1;
      if (valA > valB) return insightsSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [insights, insightsSortBy, insightsSortOrder]);

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto overflow-x-hidden px-4 md:px-0 bg-transparent">
      
      {/* 1. Header Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 px-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Insights</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track performance, monitor activity, and gain actionable insights across the platform.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[rgba(255,255,255,0.75)] border border-[#FDE8E8] text-[#A61932] rounded-xl font-bold text-sm hover:bg-[#FDF2F2] transition-all active:scale-95 shadow-[(0,0,0,0.18)]">
            <FileDown size={16} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#A61932] text-white rounded-xl font-bold text-sm hover:bg-[#8F161A] transition-all shadow-lg shadow-red-900/10 active:scale-95">
            <FileDown size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="px-4 space-y-4">
        
        {/* 2. Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto relative group">
            <input
              type="text"
              placeholder="Search...."
              value={detailedSearchQuery}
              onChange={(e) => setDetailedSearchQuery(e.target.value)}
              className="w-full pl-6 pr-12 py-3.5 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 rounded-md text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#A61932]/5 focus:border-[#A61932]/30 outline-none transition-all"
            />
            <Search size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-950 font-bold pointer-events-none" />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto shrink-0 items-center justify-end">
            {/* Region Selector */}
            <FilterDropdown
              options={["All USA", "North", "South", "East"]}
              value={regionFilter}
              onChange={setRegionFilter}
              className="w-[140px] sm:w-[160px]"
              buttonClassName="w-full flex items-center justify-between pl-6 pr-4 py-3.5 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 rounded-md text-sm font-bold text-slate-800 hover:border-slate-305 hover:bg-slate-50 transition-all shadow-sm cursor-pointer active:scale-95"
            />

            {/* Segmented Date Switcher */}
            <div className="relative">
              <div className="flex bg-[rgba(255,255,255,0.75)] border border-slate-200 rounded-lg p-1.5 items-center -[inset_0_1.5px_3.5px_rgba(0,0,0,0.07)]">
                {(["7 Days", "30 Days", "Custom"] as const).map((range) => {
                  const isActive = (range === "7 Days" && (selectedDateRange === "7 Days" || selectedDateRange === "2 Days")) ||
                                   (range === "30 Days" && selectedDateRange === "30 Days") ||
                                   (range === "Custom" && !["7 Days", "30 Days", "2 Days"].includes(selectedDateRange));
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        if (range === "Custom") {
                          setIsCalendarOpen(!isCalendarOpen);
                        } else {
                          setSelectedDateRange(range);
                          setIsCalendarOpen(false);
                        }
                      }}
                      className={`px-5 py-1.5 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#A61932] text-white rounded-[6px] shadow-[(0,0,0,0.18)] font-bold"
                          : "text-[#A61932] hover:bg-slate-50 rounded-[6px] font-semibold"
                      }`}
                    >
                      {range === "Custom" && !["7 Days", "30 Days", "2 Days"].includes(selectedDateRange)
                        ? selectedDateRange
                        : range}
                    </button>
                  );
                })}
              </div>

              <DateRangePickerPopover
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                initialStartDate={customStartDate}
                initialEndDate={customEndDate}
                onApply={(start, end) => {
                  setCustomStartDate(start);
                  setCustomEndDate(end);
                  const formatted = `${start.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${end.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`;
                  setSelectedDateRange(formatted);
                  setIsCalendarOpen(false);
                }}
                onClear={() => {
                  setCustomStartDate(undefined);
                  setCustomEndDate(undefined);
                  setSelectedDateRange("30 Days");
                  setIsCalendarOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. ROW 1: Campaign Performance Leaderboard & Coverage Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Card: Campaign Performance Leaderboard */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between bg-[rgba(255,255,255,0.75)] rounded-md border border-slate-100 p-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Campaign Performance Leaderboard</h3>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold text-[#A61932] bg-[#FDF2F2] border border-[#FDE8E8] uppercase tracking-wider">
                  TOP COVERAGE
                </span>
              </div>
              <CampaignPerformanceChart />
            </div>
            <div className="border-t border-slate-50 pt-3 mt-2">
              <button className="w-full py-2 text-[#A61932] font-bold text-sm hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>View Full Report</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Card: Coverage Distribution */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-between bg-[rgba(255,255,255,0.75)] rounded-md border border-slate-100 p-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Coverage Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: "81-100%", count: 12, bar: 45, color: "bg-[#A91D22]" },
                  { label: "61-80%", count: 24, bar: 75, color: "bg-[#C86875]" },
                  { label: "41-60%", count: 8, bar: 30, color: "bg-[#D49CA5]" },
                  { label: "21-40%", count: 5, bar: 20, color: "bg-[#E4C7CB]" },
                  { label: "11-20%", count: 2, bar: 10, color: "bg-[#FCD5D9]" },
                  { label: "0-10%", count: 1, bar: 5, color: "bg-[#FFF0F1]" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-semibold text-slate-700">{item.label}</div>
                    <div className="flex-1 h-6 bg-[rgba(255,255,255,0.75)] rounded-sm overflow-hidden">
                      <div className={`h-full ${item.color} rounded-sm transition-all duration-500`} style={{ width: `${item.bar}%` }} />
                    </div>
                    <div className="w-6 text-right text-sm font-bold text-slate-900">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-5">
              <div className="border-l-4 border-[#A91D22] pl-4 bg-[rgba(255,255,255,0.75)] py-3.5 pr-3 rounded-r-md">
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  <span className="font-bold text-slate-800">Insight:</span> Most campaigns achieved 61-80% outlet coverage, but a few campaigns had limited distribution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. ROW 2: Underperforming Campaign Insights & Campaign Lifecycle Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Card: Underperforming Campaign Insights */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between bg-[rgba(255,255,255,0.75)] rounded-md border border-slate-100 p-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-slate-900">Underperforming Campaign Insights</h3>
                <button className="text-xs font-bold text-modRed bg-red-50 px-2.5 py-1 rounded-md hover:bg-red-100 transition-colors">Click row to drill in</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left bg-black/[0.03]">
                      <th className="py-2.5 px-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider select-none">
                        Campaign Name
                      </th>
                      <th className="py-2.5 px-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider select-none">
                        Issue
                      </th>
                      <th className="py-2.5 px-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider select-none">
                        Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedInsights.map((item, idx) => {
                      const isLowRuntime = item.issue.toLowerCase().includes("runtime");
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => router.push(`/campaigns/${item.id}?from=reports`)}
                          className="hover:bg-slate-50 transition-all cursor-pointer group"
                        >
                          <td className="py-2 px-4 font-bold text-slate-900 text-sm group-hover:text-modRed transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-7 h-7 rounded-sm bg-slate-100 flex-shrink-0 relative overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop&${idx}`} alt="Pizza" className="object-cover w-full h-full" />
                              </div>
                              <div>
                                <div className="leading-tight">{item.name}</div>
                                <div className="text-[10px] text-slate-400 font-normal mt-0.5">#Camp0{idx+1}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isLowRuntime ? 'text-amber-500' : 'text-modRed'}`}>
                              <AlertCircle size={13} /> {item.issue}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-slate-600 text-xs font-medium">{item.rec}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Card: Campaign Lifecycle Funnel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-between bg-[rgba(255,255,255,0.75)] rounded-md border border-slate-100 p-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Campaign Lifecycle Funnel</h3>
              <div className="space-y-2">
                {[
                  { stage: "Draft", count: 18, color: "bg-slate-400" },
                  { stage: "Submitted", count: 12, color: "bg-[#A91D22]" },
                  { stage: "Review", count: 7, color: "bg-[#F59E0B]" },
                  { stage: "Approved", count: 5, color: "bg-[#10B981]" },
                  { stage: "Running", count: 4, color: "bg-[#3B82F6]" }
                ].map((item, idx) => (
                  <div key={idx} className="relative h-8 flex bg-[rgba(255,255,255,0.75)] rounded-md overflow-hidden">
                    <div 
                      className={`${item.color} h-full text-white text-xs font-bold flex items-center justify-between px-4 rounded-md transition-all duration-500`}
                      style={{ width: `${Math.max(25, (item.count / 18) * 100)}%` }}
                    >
                      <span>{item.stage}</span>
                      <span>{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-3xl font-extrabold text-[#A61932] tracking-tight leading-none">2.3 Days</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">AVERAGE APPROVAL TIME</p>
            </div>
          </div>
        </div>

        {/* 5. ROW 3: Campaign Activity Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="col-span-12 flex flex-col bg-[rgba(255,255,255,0.75)] rounded-md border border-slate-100 p-5 min-h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Campaign Activity Heatmap</h3>
              <div className="flex gap-4 items-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <div className="flex gap-2 items-center">
                  <span>LOW RUNTIME</span>
                  <div className="flex gap-0.5">
                    <div className="w-4 h-2.5 bg-[#FFF0F1] rounded-xs" />
                    <div className="w-4 h-2.5 bg-[#FFCCD0] rounded-xs" />
                    <div className="w-4 h-2.5 bg-[#FAA0A9] rounded-xs" />
                    <div className="w-4 h-2.5 bg-[#F26D7D] rounded-xs" />
                    <div className="w-4 h-2.5 bg-[#D84A5C] rounded-xs" />
                  </div>
                  <span>PEAK RUNTIME</span>
                </div>
              </div>
            </div>
            <ScreenHealthHeatmap />
            <div className="mt-4 pt-4 border-t border-slate-50">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full border border-modRed text-modRed flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">!</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900">Insight:</span> Peak runtime occurs Friday-Sunday evenings. <span className="text-modRed font-semibold">Opportunity:</span> Weekday mornings show low activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. ROW 4: Detailed Campaign Data */}
        <div className="col-span-12 mt-6">
          
          {/* Card Header with Search Input */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Detailed Campaign Data</h3>
            <div className="relative group w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search...."
                value={detailedSearchQuery}
                onChange={(e) => setDetailedSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 bg-[rgba(31,31,31,0.05)] border border-slate-200/80 rounded-md text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-modRed/5 outline-none transition-all w-full sm:w-72 shadow-sm"
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-800 bg-[#EFEBE4]">
                  <th 
                    onClick={() => handleReportsSort("name")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Campaign</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("created")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("submitted")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Submitted</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("approvalType")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Approval Time</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("runtime")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Runtime</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("status")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleReportsSort("reason")}
                    className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:bg-black/5 select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Reason</span>
                      <ArrowUpDown size={11} className="opacity-70" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider select-none text-center">
                    Expand
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedCampaigns.map((camp, idx) => {
                  const handleRowClick = (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("button") || target.closest("a")) {
                      return;
                    }
                    router.push(`/campaigns/${camp.id}?from=reports`);
                  };
                  return (
                    <tr 
                      key={idx} 
                      onClick={handleRowClick}
                      className="transition-all cursor-pointer hover:bg-slate-50/50 bg-[rgba(255,255,255,0.75)]"
                    >
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">
                        {camp.name}
                      </td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">{camp.created}</td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">{camp.submitted}</td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">-</td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">{camp.runtime}</td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">
                        {camp.status}
                      </td>
                      <td className="py-4 px-4 text-slate-700 text-sm font-medium">{camp.reason === "-" ? "Missing Info" : camp.reason}</td>
                      <td className="py-4 px-4 text-center">
                        <Link href={`/campaigns/${camp.id}?from=reports`} className="text-blue-600 font-medium text-sm hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {sortedCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm font-semibold text-slate-400">
                      No campaigns found matching search query
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-slate-500 font-bold">Showing {filteredCampaigns.length} of {campaigns.length}</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <button className="px-2 py-1 hover:text-modRed transition-colors">Prev</button>
              <button className="w-6 h-6 rounded bg-[#A61932] text-white flex items-center justify-center">1</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-6 h-6 rounded bg-[#A61932] text-white flex items-center justify-center">8</button>
              <button className="px-2 py-1 hover:text-modRed transition-colors">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
