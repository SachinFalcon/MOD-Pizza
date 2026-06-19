"use client";

import React, { useState } from "react";
import { useApprovals } from "@/lib/contexts/approvals-context";
import { Globe, Calendar, Search, ChevronDown, Clock, MapPin, AlertTriangle, FileCheck, X, RefreshCw, Check, Mail, Play, ArrowUpDown } from "lucide-react";
import ApprovalModal from "./approval-modal";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";

export default function AdminApprovals() {
  const { campaigns } = useApprovals();
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const pendingCampaigns = campaigns.filter((c) => c.status === "pending");
  const reviewedCampaigns = campaigns.filter((c) => c.status !== "pending");

  const displayCampaigns = activeTab === "pending" ? pendingCampaigns : reviewedCampaigns;

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 px-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Approvals</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Campaign review queue</p>
        </div>
        <div className="flex gap-3">
          <FilterButton icon={<Globe size={18} strokeWidth={2} />} label="All USA" />
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
              onApply={(start, end) => { setStartDate(start); setEndDate(end); setIsCalendarOpen(false); }}
              onClear={() => { setStartDate(undefined); setEndDate(undefined); setIsCalendarOpen(false); }}
            />
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-slate-500 tracking-wide">Overdue Items</h4>
            <div className="bg-red-50 p-1.5 rounded text-modRed"><FileCheck size={14} /></div>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900 leading-none">2</span>
              <span className="text-xs font-bold text-modRed mb-1 tracking-wide">Requests <span className="text-modRed">+1%</span></span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Approvals pending beyond their expected review time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-slate-500 tracking-wide">Avg Response Time</h4>
            <div className="bg-red-50 p-1.5 rounded text-modRed"><Clock size={14} /></div>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900 leading-none">14</span>
              <span className="text-xs font-bold text-slate-500 mb-1 tracking-wide">Hours</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Average time taken to review and approve requests</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-slate-500 tracking-wide">Rejection Rate</h4>
            <div className="bg-red-50 p-1.5 rounded text-modRed"><AlertTriangle size={14} /></div>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900 leading-none">18%</span>
              <span className="text-xs font-bold text-modRed mb-1 tracking-wide">+5%</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Percentage of requests that were not approved</p>
          </div>
        </div>
      </div>

      {/* List Controls */}
      <div className="px-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            className={`px-6 py-2.5 rounded-md text-sm font-bold transition-colors ${activeTab === "pending" ? "bg-modRed text-white" : "text-slate-500 hover:text-slate-700 bg-transparent"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Approvals
          </button>
          <button
            className={`px-6 py-2.5 rounded-md text-sm font-bold transition-colors ${activeTab === "reviewed" ? "bg-modRed text-white" : "text-slate-500 hover:text-slate-700 bg-transparent"}`}
            onClick={() => setActiveTab("reviewed")}
          >
            Reviewed Approvals
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search...."
              className="pl-4 pr-10 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm w-[350px] focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-800 font-medium">
            <span>Rows per page:</span>
            <button className="flex items-center space-x-2 border border-slate-200 shadow-sm rounded-lg px-3 py-2 bg-white hover:bg-slate-50 transition-colors">
              <span>5</span>
              <ChevronDown size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Request Name / ID</th>
                {activeTab === "pending" && (
                  <th className="py-4 px-6 font-bold cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-1">
                      <span>Target</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                )}
                <th className="py-4 px-6 font-bold cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-1">
                    <span>Submitted Date</span>
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="py-4 px-6 font-bold">Submitted By</th>
                {activeTab === "pending" ? (
                  <th className="py-4 px-6 font-bold cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-1">
                      <span>Waiting Time</span>
                      <ArrowUpDown size={12} className="text-slate-400" />
                    </div>
                  </th>
                ) : (
                  <th className="py-4 px-6 font-bold">Review Outcome</th>
                )}
                <th className="py-4 px-6 font-bold">Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-[48px] h-[48px] shrink-0 rounded-md overflow-hidden relative">
                        <img src={campaign.thumbnail} alt={campaign.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play size={16} className="text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-[15px]">{campaign.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {campaign.id.replace("CMP-", "AD-")}</p>
                      </div>
                    </div>
                  </td>
                  
                  {activeTab === "pending" && (
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-slate-700">{campaign.targetOutlets} Outlets</span>
                    </td>
                  )}

                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-700">{campaign.submittedDate}</span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={campaign.submitterAvatar} alt={campaign.submitterName} className="w-8 h-8 rounded-full border border-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{campaign.submitterName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">Midwest Region</span>
                      </div>
                    </div>
                  </td>

                  {activeTab === "pending" ? (
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${campaign.isOverdue ? "text-modRed" : "text-slate-700"}`}>
                          {campaign.isOverdue ? "5 Days, 1 Hrs" : "9 Hrs, 5 min"}
                        </span>
                        {campaign.isOverdue && (
                          <div className="flex items-center space-x-1 mt-0.5 text-modRed">
                            <AlertTriangle size={10} className="fill-modRed text-white" />
                            <span className="text-[10px] font-bold">Review Overdue</span>
                          </div>
                        )}
                      </div>
                    </td>
                  ) : (
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        {campaign.status === "approved" && (
                          <span className="inline-flex items-center space-x-1.5 bg-[#f0fdf4] text-[#16a34a] px-2.5 py-1 rounded-md border border-[#bbf7d0] text-xs font-bold">
                            <Check size={14} /><span>Approved</span>
                          </span>
                        )}
                        {campaign.status === "rejected" && (
                          <span className="inline-flex items-center space-x-1.5 bg-[#fef2f2] text-modRed px-2.5 py-1 rounded-md border border-[#fecaca] text-xs font-bold">
                            <X size={14} /><span>Rejected</span>
                          </span>
                        )}
                        {campaign.status === "request_changes" && (
                          <span className="inline-flex items-center space-x-1.5 bg-[#f0f9ff] text-[#0284c7] px-2.5 py-1 rounded-md border border-[#bae6fd] text-xs font-bold">
                            <RefreshCw size={14} /><span>Modified</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider pl-1">
                          DATE: Jan 30, 2026
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=miracle" alt="Miracle" className="w-8 h-8 rounded-full border border-slate-200" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">Miracle</span>
                          <span className="text-[11px] text-slate-500 font-medium">Publisher -South</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-modRed hover:bg-red-50 transition-colors">
                        <Mail size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-slate-500 font-medium">
            Showing {displayCampaigns.length} of {displayCampaigns.length}
          </div>
          <div className="flex items-center space-x-1 text-sm font-bold">
            <button className="px-3 py-1.5 text-slate-400 hover:text-slate-700 transition-colors">Prev</button>
            <button className="w-8 h-8 bg-modRed text-white rounded-md flex items-center justify-center">1</button>
            <button className="px-3 py-1.5 text-slate-700 hover:text-slate-900 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {selectedCampaignId && (
        <ApprovalModal 
          campaignId={selectedCampaignId} 
          onClose={() => setSelectedCampaignId(null)} 
        />
      )}
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
