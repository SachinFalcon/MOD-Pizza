"use client";

import React, { useState, useEffect } from "react";
import { CampaignCard, type CampaignCardData } from "@/components/molecules/campaign-card";
import { api } from "@/services/mock.service";
import { RefreshCw } from "lucide-react";

export function CampaignTab({ searchTerm = "" }: { searchTerm?: string }) {
  const [campaigns, setCampaigns] = useState<CampaignCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.getCampaigns();
        // Map to CampaignCardData format
        const mappedData: CampaignCardData[] = data.map((c, idx) => ({
          id: idx + 1,
          title: c.name,
          desc: "Global campaign targeting multiple regions.",
          img: `https://images.unsplash.com/photo-${['1565299624946-b28f40a0ae38', '1574071318508-1cdbab80d002', '1513104890138-7c749659a591', '1571407970349-bc81e7e96d47'][idx % 4]}?w=400&h=300&fit=crop`,
          loc: "USA & Europe",
          extra: 1,
          date: "Jan 15, 2026 – Feb 28, 2026",
          archived: c.status === 'Draft'
        }));
        setCampaigns(mappedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest">No campaigns found matching "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map((c) => (
        <CampaignCard key={c.id} data={c} />
      ))}
    </div>
  );
}
