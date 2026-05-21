"use client";

import React, { useState, useEffect } from "react";
import { TemplateCard, type TemplateCardData } from "@/components/molecules/template-card";
import { PopularTemplateCard, type PopularTemplateData } from "@/components/molecules/popular-template-card";
import { api } from "@/services/mock.service";

const popularTemplates: PopularTemplateData[] = [
  { id: 1, title: "Weekend Combo Offer", desc: "Best for high-volume retail weekends.", badge: "TOP PERFORMING", color: "bg-[#A61932]", used: "12.4k", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
  { id: 2, title: "Weekend Combo Offer", desc: "Best for high-volume retail weekends.", badge: "TRENDING", color: "bg-orange-500", used: "12.4k", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
];

export function TemplatesTab({ searchTerm = "" }: { searchTerm?: string }) {
  const [templates, setTemplates] = useState<TemplateCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.getTemplates();
        // Map to TemplateCardData format
        const mappedData: TemplateCardData[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          img: t.img,
          slots: t.screens,
          duration: t.duration,
          used: t.used,
          badge: t.badge || null,
        }));
        setTemplates(mappedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filtered = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Popular Templates */}
      {!searchTerm && (
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Popular Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularTemplates.map((t) => (
              <PopularTemplateCard key={t.id} data={t} />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
          {searchTerm ? `Search Results for "${searchTerm}"` : "All Templates"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-[350px] bg-slate-100 animate-pulse rounded-2xl" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No templates found matching "{searchTerm}"</p>
            </div>
          ) : (
            filtered.map((t) => (
              <TemplateCard key={t.id} data={t} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
