"use client";

import React, { useState } from "react";
import { Upload, Sparkles, Monitor, Grid3X3, X, Calendar } from "lucide-react";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";
import { SearchInput } from "@/components/atoms/search-input";
import { CampaignTab } from "@/components/organisms/campaign-tab";
import { AssetsTab } from "@/components/organisms/assets-tab";
import { TemplatesTab } from "@/components/organisms/templates-tab";

type TabType = "campaign" | "assets" | "templates";

export function LibraryPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>("campaign");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState("Campaign Type");
  const [statusFilter, setStatusFilter] = useState("Status");

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"upload" | "import">("upload");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "campaign",  label: "Campaign",  icon: <Sparkles size={16} /> },
    { id: "assets",    label: "Assets",    icon: <Monitor  size={16} /> },
    { id: "templates", label: "Templates", icon: <Grid3X3  size={16} /> },
  ];

  return (
    <div className="pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Global Library</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all global campaigns and assets in one place</p>
        </div>
        <button
          onClick={() => {
            setModalTab("upload");
            setIsUploadModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-[#A61932] hover:bg-[#8F161A] text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
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
            className={`flex items-center space-x-2 pb-3 px-1 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab.id
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            options={["All Regions", "Northeast", "Southeast", "Midwest", "Southwest", "West Coast"]}
            value={regionFilter}
            onChange={setRegionFilter}
          />
          <FilterDropdown
            options={["Campaign Type", "Promotion", "Event", "Notice"]}
            value={campaignTypeFilter}
            onChange={setCampaignTypeFilter}
          />
          <FilterDropdown
            options={["Status", "Draft", "Approved", "Live", "Sent"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          {/* Date Range Filter */}
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center space-x-2 bg-[#F4F4F5] rounded-full px-5 py-2.5 text-[15px] font-medium text-slate-900 cursor-pointer hover:bg-[#E4E4E7] transition-all active:scale-95 shadow-sm"
          >
            <Calendar size={18} className={startDate && endDate ? "text-[#A61932]" : ""} />
            <span>
              {startDate && endDate
                ? `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`
                : "All Time"}
            </span>
          </button>
          <DateRangePickerPopover
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            initialStartDate={startDate ?? undefined}
            initialEndDate={endDate ?? undefined}
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setIsDatePickerOpen(false);
            }}
            onClear={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setIsDatePickerOpen(false);
            }}
          />
        </div>
        <div className="relative group">
          <SearchInput value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "campaign"  && <CampaignTab searchTerm={searchTerm} />}
        {activeTab === "templates" && <TemplatesTab searchTerm={searchTerm} />}
        {activeTab === "assets" && <AssetsTab searchTerm={searchTerm} />}
      </div>

      {/* Upload/Import Dialog Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
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
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalTab === "upload"
                    ? "bg-[#A61932] text-white shadow-md shadow-red-900/10"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                Upload Files
              </button>
              <button
                onClick={() => setModalTab("import")}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalTab === "import"
                    ? "bg-[#A61932] text-white shadow-md shadow-red-900/10"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
                }`}
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
