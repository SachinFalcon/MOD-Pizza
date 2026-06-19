"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Filter, Plus, Play, Eye, Mail } from "lucide-react";
import ReactECharts from "echarts-for-react";
import Link from "next/link";
import { useRbac } from "@/hooks/use-rbac";

import { CreateCampaignModal } from "@/components/organisms/create-campaign-modal";

// Mock Data Types
type CampaignStatus = "Live" | "Draft" | "Paused" | "Failed" | "Scheduled";

interface PublisherCampaign {
  id: string;
  name: string;
  thumbnailUrl: string;
  status: CampaignStatus;
  publisher: {
    name: string;
    region: string;
    avatar: string;
  };
  editor: {
    name: string;
    region: string;
    avatar: string;
  };
  runtimeHours: number;
  runtimeStr?: string;
}

// Fallback dummy data
const MOCK_CAMPAIGNS: PublisherCampaign[] = [
  {
    id: "CMP-2041",
    name: "Weekend Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80",
    status: "Live",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Tiana Arcand", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
    runtimeHours: 145.5,
    runtimeStr: "145h 30m"
  },
  {
    id: "CMP-2042",
    name: "Holiday Promo Loop",
    thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80",
    status: "Live",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Jaxson Calzoni", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
    runtimeHours: 122.2,
    runtimeStr: "122h 14m"
  },
  {
    id: "CMP-2043",
    name: "Festival Campaign",
    thumbnailUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&q=80",
    status: "Live",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Daniel Ross", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    runtimeHours: 118.5,
    runtimeStr: "118h 29m"
  },
  {
    id: "CMP-2044",
    name: "Holiday Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80",
    status: "Draft",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
    runtimeHours: 0,
    runtimeStr: "0"
  },
  {
    id: "CMP-2045",
    name: "Holiday Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80",
    status: "Live",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
    runtimeHours: 119,
    runtimeStr: "119 hrs"
  },
  {
    id: "CMP-2046",
    name: "Holiday Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80",
    status: "Paused",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
    runtimeHours: 98,
    runtimeStr: "98 hrs"
  },
  {
    id: "CMP-2047",
    name: "Holiday Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80",
    status: "Failed",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
    runtimeHours: 0,
    runtimeStr: "0"
  },
  {
    id: "CMP-2048",
    name: "Holiday Promo",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=100&q=80",
    status: "Scheduled",
    publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
    runtimeHours: 0,
    runtimeStr: "0"
  },
];

const StatusPill = ({ status }: { status: CampaignStatus }) => {
  const styles = {
    Live: "bg-[#E6F6EC] text-[#00B060]",
    Draft: "bg-[#F0F2F5] text-[#6B7280]",
    Paused: "bg-[#EBF3FF] text-[#2F80ED]",
    Failed: "bg-[#FFEBEB] text-[#EB5757]",
    Scheduled: "bg-[#FFF4E5] text-[#F2994A]",
  };

  const dots = {
    Live: "bg-[#00B060]",
    Draft: "bg-[#6B7280]",
    Paused: "bg-[#2F80ED]",
    Failed: "bg-[#EB5757]",
    Scheduled: "bg-[#F2994A]",
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`}></span>
      <span>{status}</span>
    </div>
  );
};

export default function PublisherCampaignsView() {
  const { profile } = useRbac();
  const isAdmin = profile.id === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const rowsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target as Node)) {
        setIsRowsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  // Donut Chart Options
  const donutOptions = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Campaigns',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}',
          fontSize: 10,
          fontWeight: 'bold',
          color: '#64748b'
        },
        data: [
          { value: 53, name: 'Live', itemStyle: { color: '#2b9d75' } },
          { value: 18, name: 'Failed', itemStyle: { color: '#c72e45' } },
          { value: 5, name: 'Paused', itemStyle: { color: '#2563eb' } },
          { value: 15, name: 'Draft', itemStyle: { color: '#e2e8f0' } },
          { value: 38, name: 'Schedule', itemStyle: { color: '#f59e0b' } },
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
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#0f172a'
          }
        }
      ]
    }
  };

  // Bar Chart Options
  const barOptions = {
    grid: { top: 20, right: 0, bottom: 20, left: 20 },
    xAxis: {
      type: 'category',
      data: ['0-30 min', '30-60 min', '1-2 hrs', '2-4 hrs', '4+ hrs'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' }
    },
    series: [
      {
        data: [
          { value: 12, itemStyle: { color: '#f1d4d4' } },
          { value: 16, itemStyle: { color: '#f1d4d4' } },
          { value: 25, itemStyle: { color: '#a61b29' } },
          { value: 20, itemStyle: { color: '#f1d4d4' } },
          { value: 8, itemStyle: { color: '#f1d4d4' } }
        ],
        type: 'bar',
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  return (
    <div className="space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden relative">

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCampaignCreated={(name) => {
          console.log("Campaign Created:", name);
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Campaigns</h2>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Manage & Monitor All Campaigns across USA</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-[#a61b29] text-white rounded-md font-bold shadow-md shadow-modRed/20 hover:bg-red-800 transition-all active:scale-95 text-[13px]"
        >
          <Plus size={18} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-50 rounded flex items-center justify-center">
            <span className="text-[#a61b29] text-xs font-bold">⧖</span>
          </div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Turnaround Time</h4>
          <div className="flex items-end space-x-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 leading-none">2</span>
            <span className="text-sm font-bold text-slate-600 mb-0.5">Days Avg</span>
            <span className="text-xs font-bold text-red-500 mb-1">+2%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Time from creation to full deployment</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-50 rounded flex items-center justify-center">
            <span className="text-[#a61b29] text-xs font-bold">⚡</span>
          </div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Campaign Pipeline</h4>
          <div className="flex items-end space-x-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 leading-none">25</span>
            <span className="text-xs font-bold text-green-500 mb-1">+1%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Approved campaigns waiting to go live</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-50 rounded flex items-center justify-center">
            <span className="text-[#a61b29] text-xs font-bold">↗</span>
          </div>
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Screen Uptime</h4>
          <div className="flex items-end space-x-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 leading-none">98.4%</span>
            <span className="text-xs font-bold text-green-500 mb-1">+5%</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Percentage of requests that were not approved</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="p-2">
          <h3 className="text-sm font-bold text-slate-900">Campaign Status Overview</h3>
          <p className="text-xs text-slate-400 font-medium mb-6">Quick snapshot of all campaigns by their current state.</p>
          <div className="h-[320px]">
            <ReactECharts option={donutOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-2 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Runtime Distribution</h3>
              <p className="text-xs text-slate-400 font-medium">How campaigns are distributed by runtime</p>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase mt-1">
              <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#a61b29] rounded-sm"></span><span className="text-slate-500">Dominant Bucket</span></div>
              <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#f1d4d4] rounded-sm"></span><span className="text-slate-500">Other Buckets</span></div>
            </div>
          </div>
          <div className="mb-2 text-xs font-bold text-slate-500">Total campaigns: 74<br />Dominant bucket: <span className="text-[#a61b29]">1-2 hrs (25 campaigns)</span></div>

          <div className="min-h-[260px] w-full flex-1 -ml-2">
            <ReactECharts option={barOptions} style={{ height: '100%', width: '100%' }} />
          </div>

          <div className="mt-4 bg-white border border-slate-100 p-4 rounded-xl flex items-center space-x-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] mx-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#a61b29] shrink-0"><span className="text-sm font-bold">💡</span></div>
            <div>
              <p className="text-[13px] font-medium text-slate-700">this chart shows how campaigns are distributed across runtime buckets.</p>
              <a href="#" className="text-[12px] font-bold text-[#a61b29] hover:underline flex items-center mt-0.5">Most campaigns run between 1-2 hrs ↗</a>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All Campaigns</h3>
            <p className="text-xs text-slate-400 font-medium">View and manage campaigns across all statuses</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-modRed transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px] bg-white border border-slate-200 rounded-md py-2 pl-9 pr-3 text-[12px] font-medium focus:ring-2 focus:ring-modRed/5 focus:border-modRed/10 transition-all outline-none"
              />
            </div>
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={`bg-white border border-slate-200 py-2 pl-3 pr-8 text-[12px] font-bold text-slate-800 focus:outline-none flex items-center justify-between min-w-[110px] transition-all
                  ${isStatusDropdownOpen ? 'rounded-t-lg rounded-b-none border-b-white z-50' : 'rounded-lg'}`}
              >
                <span>{statusFilter === "All" ? "All Status" : statusFilter}</span>
                <ChevronDown size={14} className={`absolute right-2.5 text-slate-400 pointer-events-none transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute top-[100%] left-0 w-full bg-white border border-t-0 border-slate-200 shadow-lg z-40 py-0 overflow-hidden rounded-b-lg -mt-[1px]">
                  {["All", "Live", "Sent for Approval", "Approved", "Draft", "Under Modification"].map(status => {
                    const label = status === "All" ? "All Status" : status;
                    const isSelected = statusFilter === status;
                    return (
                      <div
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 text-[12px] cursor-pointer transition-colors
                          ${isSelected
                            ? 'bg-red-50 text-[#a61b29] font-bold'
                            : 'text-slate-700 font-medium hover:bg-slate-50 bg-white'}`}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md py-2 px-3">
              <span className="text-[12px] font-bold text-slate-600">Rows per page:</span>
              <div className="relative" ref={rowsDropdownRef}>
                <button
                  onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                  className="bg-transparent text-[12px] font-bold text-slate-900 focus:outline-none pr-4 flex items-center justify-between min-w-[20px]"
                >
                  <span>6</span>
                  <ChevronDown size={12} className="absolute right-0 text-slate-400 pointer-events-none" />
                </button>
                {isRowsDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-12 bg-white border border-slate-200 shadow-lg z-50 py-0 overflow-hidden">
                    {["6", "10"].map(num => (
                      <div
                        key={num}
                        onClick={() => {
                          setIsRowsDropdownOpen(false);
                        }}
                        className="px-3 py-2 text-[12px] cursor-pointer transition-colors text-slate-700 hover:bg-[#1966d2] hover:text-white bg-white text-center"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#EFECE8]">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest">Campaign Name & ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest">Status</th>
                {isAdmin && <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest">Publisher</th>}
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest">Editor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-1"><span>Runtime</span> <span className="text-[9px]">◆</span></th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-slate-100/60">
              {filteredCampaigns.map((camp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded shadow-sm overflow-hidden flex-shrink-0">
                        <img src={camp.thumbnailUrl} alt={camp.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play size={12} className="text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{camp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">ID: {camp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <StatusPill status={camp.status} />
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-3">
                        <img src={camp.publisher.avatar} alt={camp.publisher.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-[13px] font-bold text-slate-900">{camp.publisher.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{camp.publisher.region}</p>
                        </div>
                        <button className="ml-2 w-6 h-6 rounded-full border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                          <Mail size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <img src={camp.editor.avatar} alt={camp.editor.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{camp.editor.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{camp.editor.region}</p>
                      </div>
                      <button className="ml-2 w-6 h-6 rounded-full border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                        <Mail size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-bold text-slate-900">{camp.runtimeStr || `${camp.runtimeHours} ${camp.runtimeHours > 0 ? "hrs" : ""}`}</span>
                      {camp.runtimeHours > 100 && <span title="Top Performer">🏆</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Link href={`/campaigns/${camp.id}`} className="w-10 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mx-auto shadow-sm">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-slate-100/60">
          <p className="text-[11px] font-bold text-slate-400">Showing {filteredCampaigns.length} of 6</p>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed">Prev</span>
            <div className="w-6 h-6 bg-[#a61b29] text-white rounded text-[11px] font-bold flex items-center justify-center shadow-sm">1</div>
            <span className="text-[11px] font-bold text-slate-400 px-1">...</span>
            <div className="w-6 h-6 bg-[#a61b29] text-white rounded text-[11px] font-bold flex items-center justify-center cursor-pointer hover:bg-red-800 shadow-sm">8</div>
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest cursor-pointer hover:underline">Next</span>
          </div>
        </div>
      </div>

    </div>
  );
}
