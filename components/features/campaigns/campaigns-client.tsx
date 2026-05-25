"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  RefreshCw, Search, Plus, ChevronDown, Filter, AlertCircle, ArrowUp, ArrowDown, ArrowUpDown
} from "lucide-react";
import { CampaignTableRow, CampaignMobileRow } from "@/components/features/dashboard/table";
import { CreateCampaignModal } from "@/components/organisms/create-campaign-modal";
import { RbacGuard } from "@/components/providers/rbac-guard";
import { api, Campaign } from "@/services/mock.service";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";

function SortIcon({ active, direction }: { active: boolean, direction?: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={10} className="opacity-40" />;
  return direction === 'asc'
    ? <ArrowUp size={10} className="text-modRed" />
    : <ArrowDown size={10} className="text-modRed" />;
}

function parseLastEditToDate(lastEditStr: string): Date {
  const now = new Date();
  const lower = lastEditStr.toLowerCase().trim();

  if (lower.includes("now") || lower.includes("min") || lower.includes("hr") || lower.includes("hour")) {
    return now;
  }
  if (lower.includes("yesterday")) {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return yesterday;
  }

  const parsed = Date.parse(lastEditStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }

  return now;
}

export default function CampaignsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: 'asc' | 'desc' } | null>(null);

  // Date Calendar States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError("Failed to fetch campaigns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCampaigns();
    // Pre-set filter from query param (e.g., ?status=Live)
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setStatusFilter(decodeURIComponent(statusParam));
    }
  }, []);

  const handleCampaignCreated = (name: string) => {
    const newCampaign: Campaign = {
      id: `CAM-${Math.floor(Math.random() * 90000) + 10000}`,
      name: name,
      creatives: "0 Assets",
      outlets: "0",
      status: "Sent for Approval",
      runtime: "0",
      lastEdit: "Just now"
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    alert(`Campaign "${name}" has been created successfully!`);
  };

  const requestSort = (key: keyof Campaign) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const filteredCampaigns = useMemo(() => {
    let result = campaigns.filter(camp => {
      const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || camp.status === statusFilter;

      // Filter by custom date range if selected
      if (startDate && endDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        const lastEditDate = parseLastEditToDate(camp.lastEdit);
        if (lastEditDate < startOfDay || lastEditDate > endOfDay) {
          return false;
        }
      }

      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let valA: any = a[key];
        let valB: any = b[key];

        if (key === "creatives") {
          valA = parseInt(a.creatives, 10) || 0;
          valB = parseInt(b.creatives, 10) || 0;
        } else if (key === "outlets") {
          valA = parseInt(a.outlets, 10) || 0;
          valB = parseInt(b.outlets, 10) || 0;
        } else if (key === "runtime") {
          valA = parseInt(a.runtime, 10) || 0;
          valB = parseInt(b.runtime, 10) || 0;
        } else if (key === "lastEdit") {
          valA = parseLastEditToDate(a.lastEdit).getTime();
          valB = parseLastEditToDate(b.lastEdit).getTime();
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [campaigns, searchTerm, statusFilter, sortConfig, startDate, endDate]);

  return (
    <div className="space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Campaigns</h2>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Manage &amp; Monitor All Campaigns across USA</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button
            onClick={fetchCampaigns}
            className="p-2.5 border border-slate-200 rounded-md text-slate-400 hover:text-modRed transition-all active:rotate-180 duration-500"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <RbacGuard module="Campaign Management" require="Full Access" fallback={null}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-modRed text-white rounded-md font-bold shadow-md shadow-modRed/20 hover:bg-red-700 transition-all active:scale-95 text-[13px]"
            >
              <Plus size={18} />
              <span>Create Campaign</span>
            </button>
          </RbacGuard>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-modRed transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or ID...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md py-2.5 pl-12 pr-4 text-[13px] font-medium focus:ring-2 focus:ring-modRed/5 focus:border-modRed/10 transition-all outline-none"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 items-center">
          <FilterDropdown
            options={["All Status", "Live", "Sent for Approval", "Approved", "Draft", "Under Modification"]}
            value={statusFilter}
            onChange={setStatusFilter}
            className="flex-1 sm:flex-none"
          />

          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center space-x-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-[13px] font-bold text-slate-700 shadow-sm hover:border-modRed/20 hover:bg-slate-50 transition-all outline-none cursor-pointer"
            >
              <Filter size={14} className={startDate && endDate ? "text-modRed" : "text-slate-400"} />
              <span>
                {startDate && endDate
                  ? `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`
                  : "Filter Date"}
              </span>
            </button>
            <DateRangePickerPopover
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
                setIsCalendarOpen(false);
              }}
              onClear={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setIsCalendarOpen(false);
              }}
            />
          </div>

          <div className="hidden lg:flex items-center space-x-3 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-[12px] font-bold text-slate-700 shadow-sm">
            <span className="text-slate-400 font-medium whitespace-nowrap">Rows:</span>
            <span>{filteredCampaigns.length}</span>
          </div>
        </div>
      </div>

      {/* Campaign Content */}
      {error ? (
        <div className="bg-white rounded-md border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Oops! Something went wrong</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">{error}</p>
          <button
            onClick={fetchCampaigns}
            className="px-6 py-2 bg-modRed text-white rounded-md font-bold text-sm shadow-lg shadow-modRed/10"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-md border border-slate-200 p-24 flex flex-col items-center justify-center">
          <RefreshCw size={32} className="text-modRed animate-spin mb-4" />
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Fetching Campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-md border border-slate-200 p-24 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matches found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your filters or search term.</p>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("All Status"); }}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-md font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-[#F3F4F6] border-b border-slate-200">
                <th className="px-6 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Campaign Name &amp; ID</span>
                    <SortIcon active={sortConfig?.key === 'name'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('creatives')}>
                  <div className="flex items-center space-x-1">
                    <span>Creatives</span>
                    <SortIcon active={sortConfig?.key === 'creatives'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('outlets')}>
                  <div className="flex items-center space-x-1">
                    <span>Target Outlets</span>
                    <SortIcon active={sortConfig?.key === 'outlets'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIcon active={sortConfig?.key === 'status'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('runtime')}>
                  <div className="flex items-center space-x-1">
                    <span>Runtime</span>
                    <SortIcon active={sortConfig?.key === 'runtime'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('lastEdit')}>
                  <div className="flex items-center space-x-1">
                    <span>Last Edit</span>
                    <SortIcon active={sortConfig?.key === 'lastEdit'} direction={sortConfig?.direction} />
                  </div>
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#1C1C1C] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCampaigns.map((camp, idx) => (
                <CampaignTableRow
                  key={idx}
                  name={camp.name}
                  id={camp.id}
                  outlets={camp.outlets}
                  creatives={camp.creatives}
                  status={camp.status}
                  runtime={camp.runtime}
                  lastEdit={camp.lastEdit}
                  coverage={0}
                  color=""
                />
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden">
            {filteredCampaigns.map((camp, idx) => (
              <CampaignMobileRow
                key={idx}
                name={camp.name}
                id={camp.id}
                outlets={camp.outlets}
                creatives={camp.creatives}
                status={camp.status}
                runtime={camp.runtime}
                lastEdit={camp.lastEdit}
                coverage={0}
                color=""
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="px-8 py-4 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
            <p className="text-[12px] font-bold text-slate-400">Showing {filteredCampaigns.length} Campaigns</p>
            <div className="flex items-center space-x-2">
              <button className="text-[12px] font-bold text-slate-400 hover:text-slate-900 px-2 py-1 transition-colors uppercase tracking-widest">Prev</button>
              <div className="flex items-center space-x-1.5">
                <PageNumber num={1} active />
              </div>
              <button className="text-[12px] font-bold text-slate-900 px-2 py-1 transition-colors uppercase tracking-widest">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageNumber({ num, active = false }: { num: number; active?: boolean }) {
  return (
    <button className={`h-8 w-8 rounded-md flex items-center justify-center text-[12px] font-bold transition-all ${active ? 'bg-modRed text-white shadow-md shadow-modRed/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'}`}>
      {num}
    </button>
  );
}
