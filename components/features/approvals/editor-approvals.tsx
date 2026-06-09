"use client";

import React, { useState } from "react";
import { useApprovals } from "@/lib/contexts/approvals-context";
import { Search, ChevronDown, Calendar, MapPin, Check, X, RefreshCw, Clock } from "lucide-react";
import ApprovalModal from "./approval-modal";

export default function EditorApprovals() {
  const { campaigns } = useApprovals();
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("reviewed");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const pendingCampaigns = campaigns.filter((c) => c.status === "pending");
  const reviewedCampaigns = campaigns.filter((c) => c.status !== "pending");

  const displayCampaigns = activeTab === "pending" ? pendingCampaigns : reviewedCampaigns;

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto px-4 md:px-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${activeTab === "pending" ? "bg-modRed text-white" : "text-slate-500 hover:bg-slate-100"}`}
          >
            Pending Approvals
          </button>
          <button
            onClick={() => setActiveTab("reviewed")}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${activeTab === "reviewed" ? "bg-modRed text-white" : "text-slate-500 hover:bg-slate-100"}`}
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
      <div className="space-y-3">
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
              <h3 className="font-bold text-slate-900 truncate mb-1 text-base">{campaign.name}</h3>
              <p className="text-[10px] text-slate-400 font-medium mb-3">Campaign ID: {campaign.id}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5"><MapPin size={12} /><span>{campaign.targetOutlets} Target Outlets</span></div>
                <div className="flex items-center space-x-1.5"><Calendar size={12} /><span>Submitted: {campaign.submittedDate}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-100 pl-4 w-[200px]">
              <img src={campaign.submitterAvatar} alt={campaign.submitterName} className="w-8 h-8 rounded-full border border-slate-200" />
              <div className="text-xs">
                <span className="font-bold text-slate-900">{campaign.submitterName}</span>
                <span className="text-slate-500 ml-1">({campaign.submitterRole})</span>
              </div>
            </div>

            <div className="ml-auto shrink-0 pr-4 flex flex-col items-end justify-center w-[150px]">
              {campaign.status === "approved" && (
                <span className="inline-flex items-center space-x-1 bg-[#E6F6EC] text-[#00B060] px-3 py-1.5 rounded-full text-sm font-bold mb-1">
                  <Check size={16} /><span>Approved</span>
                </span>
              )}
              {campaign.status === "rejected" && (
                <span className="inline-flex items-center space-x-1 bg-red-50 text-modRed px-3 py-1.5 rounded-full text-sm font-bold mb-1">
                  <X size={16} /><span>Rejected</span>
                </span>
              )}
              {campaign.status === "request_changes" && (
                <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-bold mb-1">
                  <RefreshCw size={16} /><span>Request Changes</span>
                </span>
              )}
              {campaign.status === "pending" && (
                <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-bold mb-1">
                  <Clock size={16} /><span>Pending</span>
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                DATE: Jan 30, 2026
              </span>
            </div>
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
