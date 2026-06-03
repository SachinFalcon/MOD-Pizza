"use client";

import React, { useState } from "react";
import { X, MapPin, Plus, RefreshCw, Megaphone, Globe, MonitorPlay, Camera, Maximize, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface OutletDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  outletId: string | null;
  onDeactivateClick: () => void;
}

export function OutletDetailsPanel({ isOpen, onClose, outletId, onDeactivateClick }: OutletDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"live" | "scheduled" | "failed">("live");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[750px] lg:w-[850px] bg-[#FCFAF6] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-slate-200 flex flex-col">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              MID WEST &gt; KANSAS &gt; <span className="text-[#B32626]">{outletId || "KA-1021"}</span>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{outletId || "KA-1021"}</h2>
                <div className="flex items-center space-x-1.5 bg-[#E6F6EC] text-[#00B060] px-3 py-1 rounded-full text-xs font-bold border border-[#bbf2d1]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00B060]"></div>
                  <span>Active</span>
                </div>
              </div>
              <div className="flex items-center text-slate-500 text-sm font-medium">
                <MapPin size={16} className="mr-1.5" />
                <span>315 N Mead St, Old Town, Wichita, KS 67202, USA</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success("New screen provisioning started")}
              className="bg-[#B32626] text-white hover:bg-[#921b1b] px-4 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add New Screen</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8 flex-1">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500">Active Screens</span>
                <div className="bg-red-50 text-[#B32626] p-1.5 rounded"><MonitorPlay size={14} /></div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-slate-900">3</span>
                <span className="text-sm font-bold text-slate-400">/4</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500">Campaign Schedule</span>
                <div className="bg-red-50 text-[#B32626] p-1.5 rounded"><Megaphone size={14} /></div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-slate-900">4</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500">System Uptime</span>
                <div className="bg-red-50 text-[#B32626] p-1.5 rounded"><Globe size={14} /></div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-slate-900">99.8%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Screen Status */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Screen Status</h3>
                <button 
                  onClick={() => toast.success("Synced all screen statuses")}
                  className="flex items-center space-x-1.5 text-xs font-bold text-[#B32626] hover:text-[#921b1b] transition-colors"
                >
                  <RefreshCw size={12} />
                  <span>Sync All Screens</span>
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { id: "#SC-01", status: "ONLINE" },
                  { id: "#SC-02", status: "ONLINE" },
                  { id: "#SC-03", status: "OFFLINE" },
                  { id: "#SC-04", status: "ONLINE" },
                ].map((screen) => (
                  <div key={screen.id} className="bg-white border border-slate-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-3">
                      <MonitorPlay size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{screen.id}</span>
                      <RefreshCw size={12} className="text-slate-300" />
                    </div>
                    <span className={`text-xs font-bold tracking-wider ${screen.status === 'ONLINE' ? 'text-[#00B060]' : 'text-[#B32626]'}`}>
                      {screen.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Alerts</h3>
              <div className="space-y-3">
                <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm relative">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-900">Connectivity Issue</h4>
                    <span className="text-[10px] text-slate-400 font-medium">10:05 AM</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-3 pr-4">Screen 3 is intermittent (Packet loss &gt;20%)</p>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => toast.success("Alert escalated to Level 2 support")}
                      className="bg-red-50 text-[#B32626] px-3 py-1 rounded text-[10px] font-bold flex items-center space-x-1 hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle size={10} />
                      <span>Escalate</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm relative">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-900">Connectivity Focused</h4>
                    <span className="text-[10px] text-slate-400 font-medium">10:05 AM</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-3 pr-4">One or more screens recently showed unstable connectivity.</p>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => toast.success("Notification sent to on-site technicians")}
                      className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-[10px] font-bold flex items-center space-x-1 hover:bg-orange-100 transition-colors"
                    >
                      <AlertTriangle size={10} />
                      <span>Notify</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Schedule */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Campaign Schedule</h3>
            <div className="flex items-center space-x-6 border-b border-slate-200 mb-4">
              <button 
                onClick={() => setActiveTab("live")}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'live' ? 'border-[#B32626] text-[#B32626]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >Live</button>
              <button 
                onClick={() => setActiveTab("scheduled")}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'scheduled' ? 'border-[#B32626] text-[#B32626]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >Scheduled</button>
              <button 
                onClick={() => setActiveTab("failed")}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'failed' ? 'border-[#B32626] text-[#B32626]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >Failed Deployments</button>
            </div>
            
            {activeTab === 'live' && (
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=100&h=100" alt="Promo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center pl-0.5">
                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-white border-b-[3px] border-b-transparent" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Weekend Promo</h4>
                    <p className="text-[10px] text-slate-400 font-medium">#CAMP01</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RUNTIME</p>
                    <p className="text-sm font-bold text-slate-900">660 min (11h)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SCHEDULE</p>
                    <p className="text-sm font-bold text-slate-900">12 Mar — 18 Mar <span className="text-slate-500 font-medium text-[11px] ml-1">06:10 AM — 08:50 PM</span></p>
                  </div>
                  <div className="bg-red-50 text-[#B32626] text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                    CUSTOM
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scheduled' && (
              <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
                <Megaphone className="text-slate-300 mb-2" size={32} />
                <p className="text-sm font-bold text-slate-500">No scheduled campaigns for this outlet.</p>
              </div>
            )}

            {activeTab === 'failed' && (
              <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
                <AlertTriangle className="text-slate-300 mb-2" size={32} />
                <p className="text-sm font-bold text-slate-500">All campaigns deployed successfully.</p>
              </div>
            )}
          </div>

          {/* Bottom Grid: Live Cameras & Map */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#B32626]"></div>
                  <h3 className="text-sm font-bold text-slate-900">Live Camera Network</h3>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <button onClick={() => toast.success("Camera feeds refreshed")} className="hover:text-slate-600 transition-colors"><RefreshCw size={14} /></button>
                  <button className="hover:text-slate-600 transition-colors"><Camera size={14} /></button>
                  <button className="hover:text-slate-600 transition-colors"><Maximize size={14} /></button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-lg overflow-hidden h-28 bg-slate-200 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?auto=format&fit=crop&q=80&w=300" alt="Cam 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5">
                    <p className="text-[10px] text-white font-bold text-center">CAM-01 / OUTSIDE ENTRANCE</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden h-28 bg-slate-200 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=300" alt="Cam 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5">
                    <p className="text-[10px] text-white font-bold text-center">CAM-02 / MAIN FLOOR</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden h-28 bg-slate-200 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=300" alt="Cam 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5">
                    <p className="text-[10px] text-white font-bold text-center">CAM-03 / ELEVATOR A</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden h-28 bg-[#1B1D28] flex flex-col items-center justify-center border border-slate-700 cursor-not-allowed">
                  <MonitorPlay size={24} className="text-[#B32626] mb-2" />
                  <p className="text-xs text-slate-400 font-bold">SIGNAL LOST</p>
                  <div className="absolute inset-x-0 bottom-0 bg-[#B32626] p-1.5">
                    <p className="text-[10px] text-white font-bold text-center">CAM-04 / LOADING DOCK</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-sm h-[250px]">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" style={{ filter: "hue-rotate(180deg) saturate(150%)" }} />
              
              {/* Map Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-[#B32626]"></div>
              </div>

              {/* Location Details Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-3 shadow-sm border border-white/20">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Location Details</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">654 Madison Avenue, Suite 100, New York, NY 10021<br/>Premium foot traffic zone.</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-end">
          <button 
            onClick={onDeactivateClick}
            className="text-sm font-bold text-[#B32626] border border-transparent hover:border-[#B32626]/30 px-4 py-2 rounded-lg transition-all"
          >
            Deactivate Outlet
          </button>
        </div>

      </div>
    </>
  );
}
