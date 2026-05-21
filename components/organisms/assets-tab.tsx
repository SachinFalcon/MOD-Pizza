"use client";

import React, { useState, useEffect } from "react";
import { AssetCard, type AssetCardData } from "@/components/molecules/asset-card";
import { api } from "@/services/mock.service";

export function AssetsTab({ searchTerm = "" }: { searchTerm?: string }) {
  const [assets, setAssets] = useState<AssetCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.getAssets();
        // Map to AssetCardData format
        const mappedData: AssetCardData[] = data.map((a) => ({
          id: a.id,
          title: a.title,
          res: a.res,
          size: a.size,
          type: a.type,
          used: a.used,
          img: a.img
        }));
        setAssets(mappedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filtered = assets.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest">No assets found matching "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map((a) => (
        <AssetCard key={a.id} data={a} />
      ))}
    </div>
  );
}
