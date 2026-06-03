"use client";

import React, { useState } from "react";
import { useApprovals } from "@/lib/contexts/approvals-context";
import { Globe, Calendar, Search, ChevronDown, Clock, MapPin, AlertTriangle, FileCheck, X, RefreshCw, Check } from "lucide-react";
import ApprovalModal from "./approval-modal";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";

export default function PublisherApprovals() {
  const { campaigns, updateStatus } = useApprovals();
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const pendingCampaigns = campaigns.filter((c) => c.status === "pending");
  const reviewedCampaigns = campaigns.filter((c) => c.status !== "pending");

  const displayCampaigns = activeTab === "pending" ? pendingCampaigns : reviewedCampaigns;

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus(id, "approved");
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus(id, "rejected");
  };

  const handleRequestChanges = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus(id, "request_changes");
  };

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
              <span className="text-xs font-bold text-modRed mb-1 tracking-wide">-5%</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Percentage of requests that were not approved</p>
          </div>
        </div>
      </div>

      {/* List Controls */}
      <div className="px-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-6 border-b border-slate-200 pb-2">
          <button
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "pending" ? "text-modRed border-modRed" : "text-slate-400 border-transparent hover:text-slate-600"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Approvals
          </button>
          <button
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "reviewed" ? "text-modRed border-modRed" : "text-slate-400 border-transparent hover:text-slate-600"}`}
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
              <span>10</span>
              <ChevronDown size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="px-4 space-y-3">
        {displayCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => setSelectedCampaignId(campaign.id)}
            className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:border-modRed/30 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-center gap-4"
          >
            <div className="w-[140px] h-[80px] shrink-0 rounded-lg overflow-hidden relative">
              <img src={campaign.thumbnail} alt={campaign.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-slate-900 truncate">{campaign.name}</h3>
                {campaign.isOverdue && campaign.status === "pending" && (
                  <span className="bg-red-50 text-modRed text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">Overdue</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mb-3">Campaign ID: {campaign.id}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5"><MapPin size={12} /><span>{campaign.targetOutlets} Target Outlets</span></div>
                <div className="flex items-center space-x-1.5"><Calendar size={12} /><span>Submitted: {campaign.submittedDate}</span></div>
                {campaign.status === "pending" && (
                  <div className={`flex items-center space-x-1.5 ${campaign.isOverdue ? 'text-modRed' : ''}`}>
                    <Clock size={12} />
                    <span>{campaign.waitTime}</span>
                    {campaign.isOverdue && <AlertTriangle size={12} className="text-modRed" />}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <img src={campaign.submitterAvatar} alt={campaign.submitterName} className="w-8 h-8 rounded-full border border-slate-200" />
              <div className="text-xs">
                <span className="font-bold text-slate-900">{campaign.submitterName}</span>
                <span className="text-slate-500 ml-1">[{campaign.submitterRole}]</span>
              </div>
            </div>

            {campaign.status === "pending" ? (
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <button onClick={(e) => handleApprove(campaign.id, e)} className="bg-modRed text-white hover:bg-[#c62828] px-4 py-2 rounded flex items-center space-x-1.5 text-xs font-bold transition-colors">
                  <Check size={14} /><span>Approve</span>
                </button>
                <button onClick={(e) => handleReject(campaign.id, e)} className="bg-white text-modRed border border-modRed hover:bg-red-50 px-4 py-2 rounded flex items-center space-x-1.5 text-xs font-bold transition-colors">
                  <X size={14} /><span>Reject</span>
                </button>
                <button onClick={(e) => handleRequestChanges(campaign.id, e)} className="bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded flex items-center space-x-1.5 text-xs font-bold transition-colors">
                  <RefreshCw size={14} /><span>Request Changes</span>
                </button>
              </div>
            ) : (
              <div className="ml-auto shrink-0 pr-4">
                {campaign.status === "approved" && (
                  <span className="inline-flex items-center space-x-1 bg-[#E6F6EC] text-[#00B060] px-3 py-1.5 rounded text-sm font-bold">
                    <Check size={16} /><span>Approved</span>
                  </span>
                )}
                {campaign.status === "rejected" && (
                  <span className="inline-flex items-center space-x-1 bg-red-50 text-modRed px-3 py-1.5 rounded text-sm font-bold">
                    <X size={16} /><span>Rejected</span>
                  </span>
                )}
                {campaign.status === "request_changes" && (
                  <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-sm font-bold">
                    <RefreshCw size={16} /><span>Changes Requested</span>
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
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
