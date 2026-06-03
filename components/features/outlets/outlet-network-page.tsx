"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Eye, Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { RegisterOutletModal } from "./register-outlet-modal";
import { OutletDetailsPanel } from "./outlet-details-panel";
import { DeactivateOutletModal } from "./deactivate-outlet-modal";

interface OutletData {
  id: string;
  outletId: string;
  screens: string;
  publisher: { name: string; region: string; avatar: string };
  editor: { name: string; region: string; avatar: string };
  campaigns: number;
}

interface Locality {
  id: string;
  name: string;
  outlets: OutletData[];
}

interface StateNode {
  id: string;
  name: string;
  localities: Locality[];
}

interface Region {
  id: string;
  name: string;
  states: StateNode[];
}

interface HQ {
  id: string;
  name: string;
  regions: Region[];
}

// Dummy Database
const generateOutlets = (prefix: string, count: number): OutletData[] => {
  return Array.from({ length: count }).map((_, i) => {
    // Use deterministic numbers based on index to avoid hydration mismatch
    const activeScreens = (i % 3) + 2; 
    const totalScreens = (i % 3) + 4;
    const campaignCount = (i % 10) + 1;
    
    return {
      id: `${prefix}-${i + 1}`,
      outletId: `${prefix}-${1000 + i}`,
      screens: `${activeScreens}/${totalScreens} Active`,
      publisher: { name: "Olivia Grant", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=olivia" },
      editor: { name: "Miracle", region: "Midwest Region", avatar: "https://i.pravatar.cc/150?u=miracle" },
      campaigns: campaignCount,
    };
  });
};

const hqData: HQ = {
  id: "hq",
  name: "MTAS HQ",
  regions: [
    {
      id: "ne",
      name: "North East",
      states: [
        { id: "ny", name: "New York", localities: [{ id: "nyc", name: "NYC", outlets: generateOutlets("NYC", 3) }] },
        { id: "ma", name: "Massachusetts", localities: [{ id: "bos", name: "Boston", outlets: generateOutlets("BOS", 2) }] }
      ]
    },
    {
      id: "west",
      name: "West",
      states: [
        { id: "ca", name: "California", localities: [{ id: "la", name: "Los Angeles", outlets: generateOutlets("LA", 5) }, { id: "sf", name: "San Francisco", outlets: generateOutlets("SF", 3) }] },
        { id: "wa", name: "Washington", localities: [{ id: "sea", name: "Seattle", outlets: generateOutlets("SEA", 2) }] }
      ]
    },
    {
      id: "mw",
      name: "Mid West",
      states: [
        { 
          id: "ks", 
          name: "Kansas", 
          localities: [
            { id: "wic", name: "Wichita", outlets: generateOutlets("WIC", 3) },
            { id: "op", name: "Overland Park", outlets: generateOutlets("OP", 2) }
          ] 
        },
        { id: "wi", name: "Wisconsin", localities: [{ id: "mil", name: "Milwaukee", outlets: generateOutlets("MIL", 3) }] },
        { id: "oh", name: "Ohio", localities: [{ id: "col", name: "Columbus", outlets: generateOutlets("COL", 4) }] },
        { id: "in", name: "Indiana", localities: [{ id: "ind", name: "Indianapolis", outlets: generateOutlets("IND", 2) }] },
        { id: "il", name: "Illinois", localities: [{ id: "chi", name: "Chicago", outlets: generateOutlets("CHI", 6) }] },
        { id: "mi", name: "Michigan", localities: [{ id: "det", name: "Detroit", outlets: generateOutlets("DET", 3) }] },
        { id: "mo", name: "Missouri", localities: [{ id: "kc", name: "Kansas City", outlets: generateOutlets("KC", 4) }] },
      ]
    },
    {
      id: "south",
      name: "South",
      states: [
        { id: "tx", name: "Texas", localities: [{ id: "aus", name: "Austin", outlets: generateOutlets("AUS", 4) }, { id: "dal", name: "Dallas", outlets: generateOutlets("DAL", 5) }] },
        { id: "fl", name: "Florida", localities: [{ id: "mia", name: "Miami", outlets: generateOutlets("MIA", 3) }] }
      ]
    }
  ]
};

const OrgNode = ({ title, subtitle, active = false, onClick, className = "" }: { title: string; subtitle: string; active?: boolean; onClick?: () => void; className?: string }) => (
  <div 
    onClick={onClick}
    className={`
      w-[140px] px-2 py-3 rounded-xl flex flex-col items-center justify-center relative z-10 cursor-pointer transition-all hover:scale-105
      ${active 
        ? 'bg-gradient-to-b from-[#EFC8C8] to-[#E4AEAE] border border-[#F4D1D1] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_12px_rgba(200,100,100,0.25)]' 
        : 'bg-gradient-to-b from-[#FFFFFF] to-[#FDF5F5] border border-[#F6E1E1] shadow-[inset_0_2px_3px_rgba(255,255,255,1),0_6px_12px_rgba(200,100,100,0.12)] hover:border-[#E8B8B8]'
      }
      ${className}
    `}
  >
    <span className="font-bold text-[#921B1B] text-sm text-center tracking-tight truncate w-full px-1">{title}</span>
    <span className="text-[10px] font-medium text-[#B84040] mt-0.5">{subtitle}</span>
  </div>
);

export default function OutletNetworkPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Dynamic Tree State
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>("mw");
  const [selectedStateId, setSelectedStateId] = useState<string | null>("ks");
  const [selectedLocalityId, setSelectedLocalityId] = useState<string | null>("wic");

  // Get active entities based on state
  const activeRegion = hqData.regions.find(r => r.id === selectedRegionId);
  const activeState = activeRegion?.states.find(s => s.id === selectedStateId);
  const activeLocality = activeState?.localities.find(l => l.id === selectedLocalityId);

  // Derive outlets to display in table
  let displayOutlets: OutletData[] = [];
  let pathText = "MTAS HQ";
  
  if (activeLocality) {
    displayOutlets = activeLocality.outlets;
    pathText = `${activeRegion?.name} Region > ${activeState?.name} State > ${activeLocality.name}`;
  } else if (activeState) {
    displayOutlets = activeState.localities.flatMap(l => l.outlets);
    pathText = `${activeRegion?.name} Region > ${activeState?.name} State`;
  } else if (activeRegion) {
    displayOutlets = activeRegion.states.flatMap(s => s.localities.flatMap(l => l.outlets));
    pathText = `${activeRegion?.name} Region`;
  } else {
    displayOutlets = hqData.regions.flatMap(r => r.states.flatMap(s => s.localities.flatMap(l => l.outlets)));
  }

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === displayOutlets.length && displayOutlets.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayOutlets.map(o => o.id));
    }
  };

  const handleDeactivateClick = () => {
    setSelectedOutletId(null);
    setIsDeactivateModalOpen(true);
  };

  const handleRegionClick = (id: string) => {
    setSelectedRegionId(id);
    setSelectedStateId(null);
    setSelectedLocalityId(null);
  };

  const handleStateClick = (id: string) => {
    setSelectedStateId(id);
    setSelectedLocalityId(null);
  };

  const handleLocalityClick = (id: string) => {
    setSelectedLocalityId(id);
  };

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto px-4 md:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10 px-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Outlet Network</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Total Outlets Across USA: 532</p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-[#B32626] text-white hover:bg-[#921b1b] px-5 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-bold transition-all shadow-md shadow-[#B32626]/20 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Register New Outlet</span>
        </button>
      </div>

      {/* Org Chart / Tree View */}
      <div className="w-full overflow-x-auto pb-12 scrollbar-hide pt-4">
        <div className="min-w-[900px] flex flex-col items-center">
          
          {/* Level 1: HQ */}
          <div className="flex flex-col items-center relative">
            <OrgNode 
              title="MTAS HQ" 
              subtitle="Headquarter" 
              active={selectedRegionId === null} 
              onClick={() => { setSelectedRegionId(null); setSelectedStateId(null); setSelectedLocalityId(null); }} 
            />
            <div className="w-px h-8 bg-[#E8B8B8]"></div>
          </div>

          {/* Level 2: Regions container */}
          <div className="relative flex justify-center w-[850px]">
            <div className="flex justify-between w-full relative">
              
              {hqData.regions.map((region, idx) => (
                <div key={region.id} className="flex flex-col items-center relative flex-1 pt-6">
                  {/* Connectors to Parent */}
                  {idx === 0 && <div className="absolute top-0 right-0 w-1/2 h-6 border-t border-l border-[#E8B8B8] rounded-tl-[16px]"></div>}
                  {idx === hqData.regions.length - 1 && <div className="absolute top-0 left-0 w-1/2 h-6 border-t border-r border-[#E8B8B8] rounded-tr-[16px]"></div>}
                  {idx > 0 && idx < hqData.regions.length - 1 && (
                    <>
                      <div className="absolute top-0 left-0 w-full h-px bg-[#E8B8B8]"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-[#E8B8B8]"></div>
                    </>
                  )}

                  <OrgNode 
                    title={region.name} 
                    subtitle="Region" 
                    active={selectedRegionId === region.id} 
                    onClick={() => handleRegionClick(region.id)}
                  />
                  
                  {/* Stem going down to states if active */}
                  {selectedRegionId === region.id && (
                    <>
                      <div className="w-px h-8 bg-[#E8B8B8] relative">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-[#E8B8B8]"></div>
                      </div>

                      {/* Level 3: States Bounding Box */}
                      <div className="absolute top-[115px] left-1/2 -translate-x-1/2 z-20">
                        <div className="border border-[#E8B8B8] rounded-[20px] p-6 bg-[#FCF9F9] w-max shadow-sm relative flex flex-col items-center">
                          <div className="grid grid-cols-3 gap-x-5 gap-y-5 relative">
                            {activeRegion?.states.map((state) => (
                              <OrgNode 
                                key={state.id}
                                title={state.name} 
                                subtitle="State" 
                                active={selectedStateId === state.id}
                                onClick={() => handleStateClick(state.id)}
                              />
                            ))}
                          </div>

                          {/* Level 4: Localities Branch (Drops down from the entire states box) */}
                          {selectedStateId && activeState?.localities && (
                            <div className="mt-6 flex flex-col items-center relative w-full">
                              <div className="w-px h-8 bg-[#E8B8B8] relative">
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-[#E8B8B8]"></div>
                              </div>
                              <div className="border border-[#E8B8B8] rounded-[20px] p-6 bg-[#FFFFFF] w-max shadow-sm">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">
                                  {activeState.name} Localities
                                </div>
                                <div className="flex gap-4 justify-center">
                                  {activeState.localities.map((locality) => (
                                    <OrgNode 
                                      key={locality.id}
                                      title={locality.name} 
                                      subtitle="Locality" 
                                      active={selectedLocalityId === locality.id}
                                      onClick={() => handleLocalityClick(locality.id)}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

            </div>
          </div>
          
          {/* Dynamic Spacer based on expanded state */}
          <div className="transition-all duration-300" style={{ height: selectedStateId ? '450px' : selectedRegionId ? '250px' : '0px' }}></div>

        </div>
      </div>

      {/* List / Table Section */}
      <div className="mt-8 px-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              <span className="text-slate-900 font-bold">{pathText}</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{displayOutlets.length.toString().padStart(2, '0')} Outlets</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search...."
                className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 shadow-sm rounded-lg text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            
            <button className="flex items-center space-x-2 border border-slate-200 shadow-sm rounded-lg px-4 py-2.5 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
              <span>Filter</span>
              <ChevronDown size={16} className="text-slate-500" />
            </button>

            <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium ml-4">
              <span>Rows per page:</span>
              <button className="flex items-center space-x-2 border border-slate-200 shadow-sm rounded-lg px-3 py-2.5 bg-white hover:bg-slate-50 transition-colors">
                <span>5</span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#F6F5F4] rounded-2xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 bg-[#EFECE8]">
                <tr>
                  <th scope="col" className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-modRed focus:ring-modRed/20 bg-white cursor-pointer" 
                      checked={selectedRows.length === displayOutlets.length && displayOutlets.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-4">Outlet</th>
                  <th scope="col" className="px-6 py-4">Active Screens</th>
                  <th scope="col" className="px-6 py-4">Publisher</th>
                  <th scope="col" className="px-6 py-4">Editor</th>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-700">
                      <span>Active Campaigns</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-[#FCFAF6]">
                {displayOutlets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No outlets found for this selection.
                    </td>
                  </tr>
                )}
                {displayOutlets.map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-white transition-colors group">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-modRed focus:ring-modRed/20 bg-white cursor-pointer" 
                        checked={selectedRows.includes(outlet.id)}
                        onChange={() => toggleRow(outlet.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {outlet.outletId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {outlet.screens}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img src={outlet.publisher.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-tight">{outlet.publisher.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{outlet.publisher.region}</div>
                        </div>
                        <div className="text-modRed bg-red-50 p-1 rounded">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img src={outlet.editor.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-tight">{outlet.editor.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{outlet.editor.region}</div>
                        </div>
                        <div className="text-modRed bg-red-50 p-1 rounded">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-center whitespace-nowrap">
                      {outlet.campaigns}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setSelectedOutletId(outlet.outletId)}
                        className="p-2 text-slate-400 hover:text-modRed hover:bg-red-50 rounded-lg transition-colors border border-transparent group-hover:border-slate-200 group-hover:bg-white"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          {displayOutlets.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-[#FCFAF6] flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Showing {displayOutlets.length} of {displayOutlets.length}</span>
              <div className="flex items-center space-x-4 text-sm font-bold">
                <button className="text-slate-400 hover:text-slate-700 transition-colors">Prev</button>
                <button className="bg-modRed text-white w-7 h-7 rounded flex items-center justify-center shadow-sm">1</button>
                <button className="text-slate-700 hover:text-modRed transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>

      </div>

      <RegisterOutletModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />

      <OutletDetailsPanel 
        isOpen={selectedOutletId !== null} 
        onClose={() => setSelectedOutletId(null)}
        outletId={selectedOutletId}
        onDeactivateClick={handleDeactivateClick}
      />

      <DeactivateOutletModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
      />

    </div>
  );
}

