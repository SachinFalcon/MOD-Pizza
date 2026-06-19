"use client";

import React, { useState } from "react";
import { Upload, Megaphone, FileImage, LayoutTemplate, MapPin, Calendar, MoreVertical, Search, Monitor, Image as ImageIcon, Users } from "lucide-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { SearchInput } from "@/components/atoms/search-input";
import { Badge } from "@/components/atoms/badge";

type TabType = "campaign" | "assets" | "templates";

export function AdminLibraryView() {
  const [activeTab, setActiveTab] = useState<TabType>("campaign");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState("Campaign Type");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [timeFilter, setTimeFilter] = useState("Last 7 Days");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "campaign",  label: "Campaign",  icon: <Megaphone size={16} /> },
    { id: "assets",    label: "Assets",    icon: <FileImage  size={16} /> },
    { id: "templates", label: "Templates", icon: <LayoutTemplate  size={16} /> },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Library</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all global campaigns and assets in one place</p>
        </div>
        <button className="flex items-center space-x-2 px-5 py-2.5 bg-modRed hover:bg-[#8F161A] text-white rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0">
          <Upload size={18} />
          <span>Upload Assets</span>
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-3 px-1 text-[14px] font-bold transition-all border-b-[3px] ${
              activeTab === tab.id
                ? "border-modRed text-modRed"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters Area */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            options={["All Regions", "North America", "Europe", "Asia"]}
            value={regionFilter}
            onChange={setRegionFilter}
          />
          <FilterDropdown
            options={["Campaign Type", "Promo", "Brand", "Seasonal"]}
            value={campaignTypeFilter}
            onChange={setCampaignTypeFilter}
          />
          <FilterDropdown
            options={["Status", "Active", "Draft", "Archived"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            options={["Last 7 Days", "Last 30 Days", "This Year"]}
            value={timeFilter}
            onChange={setTimeFilter}
          />
        </div>
        <div className="w-full md:w-[320px]">
          <SearchInput value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300 pt-2">
        {activeTab === "campaign" && <CampaignsView searchTerm={searchTerm} />}
        {activeTab === "assets" && <AssetsView searchTerm={searchTerm} />}
        {activeTab === "templates" && <TemplatesView searchTerm={searchTerm} />}
      </div>
    </div>
  );
}

// --- Specific Views for Admin ---

function CampaignsView({ searchTerm }: { searchTerm: string }) {
  const campaigns = Array(6).fill({
    title: "Pepperoni Pizza Frenzy",
    desc: "Weekend special featuring our signature pepperoni with extra cheese",
    loc: "USA East, Chicago",
    extra: 1,
    date: "Jan 15, 2026 – Feb 28, 2026",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    archived: false
  });
  
  // Make the last one archived for mockup accuracy
  campaigns[5] = { ...campaigns[5], archived: true, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80" };
  campaigns[1] = { ...campaigns[1], img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" };
  campaigns[2] = { ...campaigns[2], img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80" };
  campaigns[3] = { ...campaigns[3], img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80" };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {campaigns.map((c, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group h-full flex flex-col justify-between cursor-pointer">
          <div>
            <div className="relative h-56 overflow-hidden">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {c.archived && (
                <div className="absolute top-3 right-3">
                  <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">ARCHIVED</span>
                </div>
              )}
            </div>
            <div className="p-5 pb-0">
              <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-modRed transition-colors">{c.title}</h3>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{c.desc}</p>
              <div className="flex items-center space-x-1.5 mt-4 text-[12px] text-slate-500">
                <MapPin size={14} className="text-slate-400" />
                <span>{c.loc}</span>
                <span className="text-slate-400">+{c.extra}</span>
              </div>
            </div>
          </div>
          <div className="p-5 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[12px] text-slate-500">
              <Calendar size={14} className="text-slate-400" />
              <span>{c.date}</span>
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssetsView({ searchTerm }: { searchTerm: string }) {
  const assets = [
    { type: "VIDEO", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
    { type: "VIDEO", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80" },
    { type: "IMAGE", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80" },
    { type: "VIDEO", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" },
    { type: "IMAGE", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80" },
    { type: "VIDEO", title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", used: 12, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {assets.map((a, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
          <div className="relative h-56 overflow-hidden">
            <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 right-3">
              <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded ${a.type === 'VIDEO' ? 'bg-slate-900/80 backdrop-blur' : 'bg-modRed/90 backdrop-blur'}`}>
                {a.type}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-[16px] font-bold text-slate-900">{a.title}</h3>
            <div className="flex items-center space-x-2 mt-2 text-[13px] text-slate-500">
              <Monitor size={14} className="text-slate-400" />
              <span>{a.res}</span>
              <span className="text-slate-300">•</span>
              <span>{a.size}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-1.5 text-[13px] text-modRed font-bold">
                <LayoutTemplate size={14} />
                <span>Used in {a.used} campaigns</span>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplatesView({ searchTerm }: { searchTerm: string }) {
  const allTemplates = Array(6).fill({
    title: "Weekend Offer Template",
    slots: 3,
    duration: "5 Days",
    used: "24k",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
  });

  allTemplates[1].img = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80";
  allTemplates[2].img = "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80";
  allTemplates[3].img = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
  allTemplates[4].img = "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80";
  allTemplates[5].img = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80";

  return (
    <div className="space-y-10">
      {/* Popular Templates */}
      <div>
        <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest mb-4">POPULAR TEMPLATES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-xl border border-modRed shadow-[0_0_15px_rgba(166,25,50,0.15)] overflow-hidden flex flex-row h-36">
            <div className="w-36 shrink-0 overflow-hidden bg-modRed">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" alt="Template" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-center">
              <span className="self-start text-[9px] font-bold text-modRed bg-modRed/10 px-2 py-0.5 rounded uppercase tracking-widest mb-2 border border-modRed/20">
                TOP PERFORMING
              </span>
              <h3 className="text-[15px] font-bold text-slate-900">Weekend Combo Offer</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Best for high-volume retail weekends.</p>
              <div className="flex items-center space-x-1.5 mt-2.5 text-[12px] text-slate-500">
                <Users size={12} className="text-slate-400" />
                <span>12.4k used</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-row h-36">
            <div className="w-36 shrink-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" alt="Template" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-center">
              <span className="self-start text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest mb-2 border border-blue-100">
                TRENDING
              </span>
              <h3 className="text-[15px] font-bold text-slate-900">Weekend Combo Offer</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Best for high-volume retail weekends.</p>
              <div className="flex items-center space-x-1.5 mt-2.5 text-[12px] text-slate-500">
                <Users size={12} className="text-slate-400" />
                <span>12.4k used</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest mb-4">ALL TEMPLATES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allTemplates.map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={t.img} alt={t.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {i === 3 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded">VIDEO</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">{t.title}</h3>
                <div className="grid grid-cols-3 border border-slate-200 rounded-lg overflow-hidden text-center bg-slate-50">
                  <div className="py-2.5 border-r border-slate-200">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">SLOTS</p>
                    <p className="text-[15px] font-bold text-slate-900 mt-0.5">{t.slots}</p>
                  </div>
                  <div className="py-2.5 border-r border-slate-200">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">DURATION</p>
                    <p className="text-[15px] font-bold text-slate-900 mt-0.5">{t.duration}</p>
                  </div>
                  <div className="py-2.5">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">USED</p>
                    <p className="text-[15px] font-bold text-slate-900 mt-0.5">{t.used}</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2.5 bg-modRed/10 text-modRed font-bold text-[13px] rounded-lg hover:bg-modRed hover:text-white transition-all">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
