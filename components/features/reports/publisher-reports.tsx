"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Download, BarChart2, Radio, MonitorSmartphone, CheckCircle, Clock } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";

export function PublisherReportsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All USA");
  const [timeframe, setTimeframe] = useState("7 Days");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  // Options for Chart 1: Campaigns Created vs Deployed
  const createdVsDeployedOptions = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Created Campaigns', 'Deployed Campaigns'],
      bottom: 0,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 10, color: '#64748B', fontWeight: 'bold' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', margin: 16 }
    },
    yAxis: {
      type: 'value',
      name: 'No. Of Campaigns →',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
      min: 0, max: 80, interval: 20,
      splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' }
    },
    series: [
      {
        name: 'Created Campaigns',
        type: 'line',
        data: [45, 52, 51, 68, 73, 73, 58],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#94A3B8', borderColor: '#FFFFFF', borderWidth: 2 }
      },
      {
        name: 'Deployed Campaigns',
        type: 'line',
        data: [28, 40, 44, 60, 65, 60, 50],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#A61932', borderColor: '#FFFFFF', borderWidth: 2 }
      }
    ]
  };

  // Options for Chart 2: Approvals Trend
  const approvalsTrendOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['Rejected', 'Approved'],
      bottom: 0,
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 10, color: '#64748B', fontWeight: 'bold' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', margin: 16 }
    },
    yAxis: {
      type: 'value',
      min: 0, max: 80, interval: 20,
      splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' }
    },
    series: [
      {
        name: 'Approved',
        type: 'bar',
        stack: 'total',
        barWidth: '40%',
        data: [60, 38, 32, 40, 45, 24, 26],
        itemStyle: { color: '#95C5A8' } // Greenish
      },
      {
        name: 'Rejected',
        type: 'bar',
        stack: 'total',
        data: [8, 12, 8, 5, 6, 6, 2],
        itemStyle: { color: '#D2858F' } // Reddish
      }
    ]
  };

  // Options for Chart 3: Status Distribution
  const statusDistributionOptions = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: ['55%', '85%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}',
          fontSize: 10,
          fontWeight: 'bold',
          color: '#64748B',
          backgroundColor: '#F8FAFC',
          padding: [4, 8],
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#E2E8F0'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          lineStyle: { color: '#CBD5E1' }
        },
        data: [
          { value: 53, name: 'Live', itemStyle: { color: '#2EB574' } },
          { value: 38, name: 'Schedule', itemStyle: { color: '#F59E0B' } },
          { value: 15, name: 'Draft', itemStyle: { color: '#CBD5E1' } },
          { value: 5, name: 'Paused', itemStyle: { color: '#3B82F6' } },
          { value: 18, name: 'Failed', itemStyle: { color: '#EF4444' } }
        ]
      }
    ],
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '129\nCampaigns',
            textAlign: 'center',
            fill: '#0F172A',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'sans-serif'
          }
        }
      ]
    }
  };

  // Options for Chart 4: Runtime Distribution
  const runtimeDistributionOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '20%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Short (60-120 min)', 'Medium (120-240 min)', 'Long (240-600 min)', 'Extended (600+ min)'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold', margin: 16 }
    },
    yAxis: {
      type: 'value',
      name: 'No. Of Campaigns ↑',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
      min: 0, max: 80, interval: 20,
      splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' }
    },
    series: [
      {
        name: 'Runtime',
        type: 'bar',
        barWidth: '35%',
        data: [
          { value: 48, itemStyle: { color: '#A61932' } },
          { value: 58, itemStyle: { color: '#C95C6A' } },
          { value: 42, itemStyle: { color: '#E1A2A9' } },
          { value: 25, itemStyle: { color: '#F6E4E6' } }
        ]
      }
    ],
    graphic: {
      elements: [
        {
          type: 'text',
          bottom: 0,
          left: 'center',
          style: {
            text: 'Campaign Runtime Ranges →',
            fill: '#94A3B8',
            fontSize: 10,
            fontWeight: 'bold'
          }
        }
      ]
    }
  };

  // Options for Chart 5: Screen Uptime Trend
  const uptimeTrendOptions = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', margin: 16 }
    },
    yAxis: {
      type: 'value',
      min: 0, max: 80, interval: 20,
      splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' }
    },
    series: [
      {
        name: 'Uptime',
        type: 'line',
        smooth: true,
        data: [28, 30, 25, 30, 28, 35, 38],
        itemStyle: { color: '#2EB574' },
        lineStyle: { width: 2, color: '#2EB574' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(46, 181, 116, 0.3)' }, { offset: 1, color: 'rgba(46, 181, 116, 0.0)' }]
          }
        },
        showSymbol: false
      }
    ]
  };

  const MOCK_TOP_CAMPAIGNS = Array(5).fill({
    name: "Summer_Promo_Main.mp4",
    specs: "MP4 • 1920x1080 • 12.4 MB",
    runtime: "1.2K hrs",
    coverage: 52,
    editor: "Hanna Vetrovs",
    region: "Midwest Region"
  }).map((camp, i) => ({ ...camp, id: i, runtime: i === 0 ? "1.2K hrs" : i === 1 ? "980 hrs" : i === 2 ? "830 hrs" : "142 hrs 12 min" }));

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Insights</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Track performance, monitor activity, and gain actionable insights across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#FDE8E8] text-[#A61932] rounded-md font-bold text-sm shadow-sm hover:bg-[#FDF2F2] transition-colors">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#A61932] text-white rounded-md font-bold text-sm shadow-sm hover:bg-[#8F161A] transition-colors">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-[400px]">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A61932]/20 transition-all shadow-sm"
          />
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <FilterDropdown
            options={["All USA", "North", "South", "East"]}
            value={regionFilter}
            onChange={setRegionFilter}
            buttonClassName="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm font-bold text-slate-800 shadow-sm min-w-[140px]"
          />
          <div className="relative">
            <div className="flex bg-white border border-slate-200 rounded-md p-1 shadow-sm">
              {(["7 Days", "30 Days", "Custom"] as const).map(tab => {
                const isActive = (tab === "7 Days" && timeframe === "7 Days") ||
                                 (tab === "30 Days" && timeframe === "30 Days") ||
                                 (tab === "Custom" && !["7 Days", "30 Days"].includes(timeframe));
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      if (tab === "Custom") {
                        setIsCalendarOpen(!isCalendarOpen);
                      } else {
                        setTimeframe(tab);
                        setIsCalendarOpen(false);
                      }
                    }}
                    className={`px-4 py-1.5 text-[11px] font-bold rounded transition-colors ${
                      isActive ? 'bg-[#A61932] text-white' : 'text-[#A61932] hover:bg-slate-50'
                    }`}
                  >
                    {tab === "Custom" && !["7 Days", "30 Days"].includes(timeframe) ? timeframe : tab}
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
                setTimeframe(formatted);
                setIsCalendarOpen(false);
              }}
              onClear={() => {
                setCustomStartDate(undefined);
                setCustomEndDate(undefined);
                setTimeframe("7 Days");
                setIsCalendarOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Campaigns", value: "248", change: "+12%", changeType: "pos", icon: <BarChart2 size={12} strokeWidth={3} className="text-[#A61932]" /> },
          { label: "Live Campaigns", value: "86", change: "+8%", changeType: "pos", icon: <Radio size={12} strokeWidth={3} className="text-[#A61932]" /> },
          { label: "Active Screens", value: "1,247", change: "-5%", changeType: "neg", icon: <MonitorSmartphone size={12} strokeWidth={3} className="text-[#A61932]" /> },
          { label: "Success Rate", value: "94.2%", change: "+2.1%", changeType: "pos", icon: <CheckCircle size={12} strokeWidth={3} className="text-[#A61932]" /> },
          { label: "Avg Approval Time", value: "2.4h", change: "-15%", changeType: "neg", icon: <Clock size={12} strokeWidth={3} className="text-[#A61932]" /> }
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-[90px]">
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold text-slate-700">{kpi.label}</span>
              <div className="w-5 h-5 rounded-[4px] bg-[#FDF2F2] border border-[#FDE8E8] flex items-center justify-center shrink-0">
                {kpi.icon}
              </div>
            </div>
            <div className="flex items-end gap-1.5 mt-auto">
              <span className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{kpi.value}</span>
              <span className={`text-[10px] font-bold mb-0.5 ${kpi.changeType === 'pos' ? 'text-emerald-500' : 'text-modRed'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 1: Platform Activity Trends */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A61932" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Platform Activity Trends
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Campaigns Created vs Deployed</h3>
            <div className="h-[280px]">
              <ReactECharts option={createdVsDeployedOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Approvals Trend</h3>
            <div className="h-[280px]">
              <ReactECharts option={approvalsTrendOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Campaign Intelligence */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A61932" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          Campaign Intelligence
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Status Distribution</h3>
            <div className="h-[280px]">
              <ReactECharts option={statusDistributionOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Runtime Distribution</h3>
            <div className="h-[280px]">
              <ReactECharts option={runtimeDistributionOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Campaign Intelligence (Continued) */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A61932" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          Campaign Intelligence
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Campaigns</h3>
                <p className="text-[11px] text-slate-500 font-medium">Campaigns with highest outlet coverage + runtime</p>
              </div>
              <button className="text-[10px] font-bold text-[#A61932] bg-red-50 px-2 py-1 rounded">Click row to drill in</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#F8FAFC]">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Campaign</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Runtime</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Outlet Coverage</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Editor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_TOP_CAMPAIGNS.map(camp => (
                    <tr key={camp.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-8 rounded bg-slate-200 overflow-hidden shrink-0">
                            <img src={`https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100&auto=format&fit=crop`} alt="Thumb" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-slate-900 group-hover:text-[#A61932] transition-colors">{camp.name}</div>
                            <div className="text-[10px] font-medium text-slate-500">{camp.specs}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-bold text-slate-700">
                        {camp.runtime} {camp.id < 3 && <span className="ml-1 text-[13px]">🏆</span>}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-bold text-slate-700 text-center">{camp.coverage}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            <img src={`https://i.pravatar.cc/100?img=${camp.id + 10}`} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-slate-900 leading-tight">{camp.editor}</div>
                            <div className="text-[10px] font-medium text-slate-500">{camp.region}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-lg p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Screen Uptime Trend (%)</h3>
            <div className="h-[300px]">
              <ReactECharts option={uptimeTrendOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
