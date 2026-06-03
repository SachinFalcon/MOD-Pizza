"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, MapPin, Calendar, Clock, CheckSquare, Square, RefreshCw, Check } from "lucide-react";
import { useApprovals, CampaignApproval } from "@/lib/contexts/approvals-context";
import { useRbac } from "@/hooks/use-rbac";

interface ApprovalModalProps {
  campaignId: string;
  onClose: () => void;
}

export default function ApprovalModal({ campaignId, onClose }: ApprovalModalProps) {
  const { campaigns, updateStatus } = useApprovals();
  const { profile } = useRbac();
  const [note, setNote] = useState("");

  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) return null;

  const isPublisher = profile.id === "publisher";

  const handleApprove = () => {
    updateStatus(campaign.id, "approved");
    onClose();
  };

  const handleReject = () => {
    updateStatus(campaign.id, "rejected");
    onClose();
  };

  const handleRequestChanges = () => {
    updateStatus(campaign.id, "request_changes");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#f8f9fa] rounded-2xl shadow-2xl w-full max-w-[1200px] max-h-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{campaign.name}</h2>
              {campaign.isOverdue && campaign.status === "pending" && (
                <span className="bg-red-50 text-modRed text-xs font-bold px-2 py-1 rounded border border-red-100">Overdue</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <img src={campaign.submitterAvatar} alt={campaign.submitterName} className="w-6 h-6 rounded-full border border-slate-200" />
              <span className="font-medium text-slate-700">{campaign.submitterName} ({campaign.submitterRole})</span>
              <span>•</span>
              <span>3 days ago</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors bg-white shadow-sm border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Creative Player) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">Creative Player</h3>
                  <div className="flex bg-red-50 rounded-lg p-1 border border-red-100">
                    <button className="px-3 py-1.5 text-xs font-bold text-modRed bg-white rounded-md shadow-sm">Player</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Preview on Screen</button>
                  </div>
                </div>
                
                <div className="bg-black rounded-xl overflow-hidden relative aspect-video shadow-lg">
                  <img src={campaign.thumbnail} alt="Video frame" className="w-full h-full object-cover opacity-80" />
                  
                  {/* Fake Video UI */}
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 backdrop-blur-sm"><ChevronLeft size={24} /></button>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 backdrop-blur-sm"><ChevronRight size={24} /></button>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-modRed transition-colors"><Play size={20} fill="currentColor" /></button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-modRed rounded-full" />
                      </div>
                      <span className="text-white text-xs font-medium font-mono">0:05 / 0:15</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">Creative Variants</h3>
                  <span className="text-xs font-medium text-slate-400">4 Assets</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { title: "Main_4K.mp4", sub: "Video15s", img: campaign.thumbnail, active: true },
                    { title: "Watch_Static.jpg", sub: "ImageStatic", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop" },
                    { title: "Audio_Sync.mp4", sub: "Video10s", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop" },
                    { title: "B-Roll_Alt.mp4", sub: "Video6s", img: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=200&h=150&fit=crop" },
                  ].map((asset, i) => (
                    <div key={i} className={`bg-white rounded-lg border overflow-hidden cursor-pointer ${asset.active ? 'border-modRed ring-1 ring-modRed shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="h-20 w-full overflow-hidden">
                        <img src={asset.img} alt={asset.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{asset.title}</p>
                        <p className="text-[10px] text-slate-500">{asset.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

            {/* Right Column (Details) */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Campaign Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Name</span>
                    <span className="font-bold text-slate-900">Summer 2024 Blast</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">ID</span>
                    <span className="font-bold text-slate-900">#CMP-99021</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Promo Code</span>
                    <span className="font-bold text-slate-900">{campaign.promoCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500">Priority</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${campaign.priority === 'High' ? 'bg-red-50 text-modRed' : 'bg-slate-100 text-slate-700'}`}>{campaign.priority}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Targeting & Scheduling</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-slate-400"><MapPin size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{campaign.targetOutlets} Outlets</p>
                      <p className="text-xs text-slate-500 mt-0.5">Midtown, Chelsea, Financial District..</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-slate-400"><Calendar size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Jun 01 - Aug 31</p>
                      <p className="text-xs text-slate-500 mt-0.5">Prime time slots (08:00 - 20:00)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-slate-400"><Clock size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">15s Slot Duration</p>
                      <p className="text-xs text-slate-500 mt-0.5">Frequency: 4 plays per hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Compliance Checklist</h3>
                <div className="space-y-3">
                  {[
                    { label: "Brand Guidelines Approved", checked: true },
                    { label: "Pricing Verified", checked: true },
                    { label: "Rights & Licenses Cleared", checked: false },
                    { label: "Legal Disclaimer Included", checked: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {item.checked ? (
                        <CheckSquare size={18} className="text-modRed shrink-0" />
                      ) : (
                        <Square size={18} className="text-slate-300 shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${item.checked ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-3">Editor Notes</h3>
                <textarea 
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed resize-none"
                  rows={4}
                  placeholder="Add a comment or internal note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-8 py-5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-sm text-slate-500">Make your decision for this campaign</p>
          
          {isPublisher && campaign.status === "pending" ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRequestChanges}
                className="bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold transition-colors"
              >
                <RefreshCw size={16} /><span>Request Changes</span>
              </button>
              <button 
                onClick={handleReject}
                className="bg-white text-modRed border border-modRed hover:bg-red-50 px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold transition-colors"
              >
                <X size={16} /><span>Reject</span>
              </button>
              <button 
                onClick={handleApprove}
                className="bg-modRed text-white hover:bg-[#c62828] px-6 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold transition-colors shadow-sm"
              >
                <Check size={16} /><span>Approve</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500">Current Status:</span>
              {campaign.status === "approved" && <span className="bg-[#E6F6EC] text-[#00B060] px-3 py-1 rounded text-sm font-bold">Approved</span>}
              {campaign.status === "rejected" && <span className="bg-red-50 text-modRed px-3 py-1 rounded text-sm font-bold">Rejected</span>}
              {campaign.status === "request_changes" && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-bold">Changes Requested</span>}
              {campaign.status === "pending" && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-sm font-bold">Pending Review</span>}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
