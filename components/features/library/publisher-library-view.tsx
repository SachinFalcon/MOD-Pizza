"use client";

import React, { useState } from "react";
import { Upload, Megaphone, FileText, LayoutGrid, Search, Globe, Calendar, Layers, CheckCircle2, Copy, X } from "lucide-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";

type TabType = "campaign" | "assets" | "templates";

const MOCK_CAMPAIGNS = [
  { id: 1, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: false, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: false, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: false, img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: false, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: false, img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Pepperoni Pizza Frenzy", desc: "Weekend special featuring our signature pepperoni with extra cheese", loc: "USA East, Chicago +1", date: "Jan 15, 2026 - Feb 28, 2026", archived: true, img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=600&auto=format&fit=crop" },
];

const MOCK_ASSETS = [
  { id: 1, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "VIDEO", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "VIDEO", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "IMAGE", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "VIDEO", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "IMAGE", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Summer Collection 2026...", specs: "1920 x 1080 • 24.5 MB", used: 12, type: "VIDEO", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop" },
];

const MOCK_POPULAR_TEMPLATES = [
  { id: 1, title: "Weekend Combo Offer", desc: "Best for high-volume retail weekends.", used: "12.4k", badge: "TOP PERFORMING", badgeColor: "bg-red-50 text-[#A61932]", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300&auto=format&fit=crop" },
  { id: 2, title: "Weekend Combo Offer", desc: "Best for high-volume retail weekends.", used: "12.4k", badge: "TRENDING", badgeColor: "bg-blue-50 text-blue-600", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop" },
];

const MOCK_ALL_TEMPLATES = [
  { id: 1, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "", img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "VIDEO", img: "https://images.unsplash.com/photo-1539136782209-64abdb6c89fa?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "", img: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Weekend Offer Template", slots: 3, duration: "5 Days", used: "24x", type: "", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop" },
];

export function PublisherLibraryView() {
  const [activeTab, setActiveTab] = useState<TabType>("campaign");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState("Campaign Type");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [timeframeFilter, setTimeframeFilter] = useState("Last 7 Days");

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"upload" | "import">("upload");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "campaign", label: "Campaign", icon: <Megaphone size={16} /> },
    { id: "assets", label: "Assets", icon: <Layers size={16} /> },
    { id: "templates", label: "Templates", icon: <LayoutGrid size={16} /> },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Library</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage all global campaigns and assets in one place</p>
        </div>
        <button
          onClick={() => {
            setModalTab("upload");
            setIsUploadModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#A61932] text-white rounded-md font-bold text-sm shadow-sm hover:bg-[#8F161A] transition-colors"
        >
          <Upload size={16} />
          Upload Assets
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-3 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id
                ? "border-[#A61932] text-[#A61932]"
                : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <FilterDropdown
            options={["All Regions", "Northeast", "Southeast", "Midwest"]}
            value={regionFilter}
            onChange={setRegionFilter}
            buttonClassName="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-800 shadow-sm min-w-[140px]"
          />
          <FilterDropdown
            options={["Campaign Type", "Promotion", "Event", "Notice"]}
            value={campaignTypeFilter}
            onChange={setCampaignTypeFilter}
            buttonClassName="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-800 shadow-sm min-w-[140px]"
          />
          <FilterDropdown
            options={["Status", "Draft", "Approved", "Live"]}
            value={statusFilter}
            onChange={setStatusFilter}
            buttonClassName="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-800 shadow-sm min-w-[120px]"
          />
          <FilterDropdown
            options={["Last 7 Days", "Last 30 Days", "This Year"]}
            value={timeframeFilter}
            onChange={setTimeframeFilter}
            buttonClassName="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-800 shadow-sm min-w-[130px]"
          />
        </div>

        <div className="relative w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A61932]/20 transition-all shadow-sm"
          />
          <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "campaign" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CAMPAIGNS.map(camp => (
              <div key={camp.id} className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group relative">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={camp.img} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {camp.archived && (
                    <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ARCHIVED</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1 leading-tight">{camp.title}</h3>
                  <p className="text-[12px] text-slate-500 font-medium mb-4 line-clamp-2">{camp.desc}</p>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Globe size={12} />
                      {camp.loc}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <Calendar size={12} />
                        {camp.date}
                      </div>
                      <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ASSETS.map(asset => (
              <div key={asset.id} className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group relative">
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                  <img src={asset.img} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5">
                    {asset.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1 truncate">{asset.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-4">
                    <LayoutGrid size={12} />
                    {asset.specs}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#A61932]">
                      <Layers size={14} />
                      Used in {asset.used} campaigns
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <div>
            <h2 className="text-[14px] font-bold text-slate-900 tracking-wider uppercase mb-4">Popular Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {MOCK_POPULAR_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="bg-white rounded-xl border border-[#A61932]/20 shadow-[0_2px_15px_-4px_rgba(166,25,50,0.15)] flex overflow-hidden h-[160px]">
                  <div className="w-[40%] bg-slate-100 relative">
                    <img src={tpl.img} alt={tpl.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[60%] p-6 flex flex-col justify-center">
                    <div className={`self-start text-[10px] font-bold px-2 py-1 rounded mb-3 ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </div>
                    <h3 className="text-[16px] font-bold text-slate-900 mb-1">{tpl.title}</h3>
                    <p className="text-[12px] text-slate-500 font-medium mb-3">{tpl.desc}</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      {tpl.used} used
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-[14px] font-bold text-slate-900 tracking-wider uppercase mb-4">All Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_ALL_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={tpl.img} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {tpl.type === "VIDEO" && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                        VIDEO
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-slate-900 mb-4 text-center">{tpl.title}</h3>

                    <div className="flex justify-between items-center bg-slate-50 rounded-lg p-3 mb-5">
                      <div className="text-center flex-1 border-r border-slate-200">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Slots</div>
                        <div className="text-[13px] font-black text-slate-900">{tpl.slots}</div>
                      </div>
                      <div className="text-center flex-1 border-r border-slate-200">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</div>
                        <div className="text-[13px] font-black text-slate-900">{tpl.duration}</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Used</div>
                        <div className="text-[13px] font-black text-slate-900">{tpl.used}</div>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-[#F9EBED] text-[#A61932] hover:bg-[#F2D7DB] rounded-md font-bold text-[12px] transition-colors mt-auto">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload/Import Dialog Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgba(255,255,255,0.75)] rounded-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col relative max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 shadow-[(0,0,0,0.18)]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Assets</h3>
                <p className="text-xs text-slate-500 mt-1">Choose between standard media uploads or a CSV file import.</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Sub-Options Switcher */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex gap-2">
              <button
                onClick={() => setModalTab("upload")}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${modalTab === "upload" ? "bg-[#A61932] text-white -red-900/10" : " bg-[rgba(255,255,255,0.75)] border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"}`}
              >
                Upload Files
              </button>
              <button
                onClick={() => setModalTab("import")}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${modalTab === "import" ? "bg-[#A61932] text-white -red-900/10" : " bg-[rgba(255,255,255,0.75)] border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"}`}
              >
                Bulk Import CSV
              </button>
            </div>

            {/* Modal Body content */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[50vh]">
              {modalTab === "upload" ? (
                <UploadFilesPanel onComplete={() => setIsUploadModalOpen(false)} />
              ) : (
                <BulkImportPanel onComplete={() => setIsUploadModalOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Upload Files panel ────────────────────────────────────────────────────────
function UploadFilesPanel({ onComplete }: { onComplete: () => void }) {
  const [AssetUploaderComp, setAUC] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    import("@/components/governance/asset-uploader").then((m) => setAUC(() => m.AssetUploader));
  }, []);

  if (!AssetUploaderComp) {
    return <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />;
  }

  return (
    <AssetUploaderComp onUploaded={(n: number) => {
      alert(`${n} file(s) uploaded successfully`);
      onComplete();
    }} />
  );
}

// ── Bulk Import CSV panel ─────────────────────────────────────────────────────
function BulkImportPanel({ onComplete }: { onComplete: () => void }) {
  const [CsvImporterComp, setCSV] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    import("@/components/governance/csv-importer").then((m) => setCSV(() => m.CsvImporter));
  }, []);

  if (!CsvImporterComp) {
    return <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />;
  }

  return (
    <CsvImporterComp onComplete={(n: number) => {
      alert(`${n} campaign(s) imported`);
      onComplete();
    }} />
  );
}
