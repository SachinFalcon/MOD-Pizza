import Link from "next/link";
import { MapPin, Calendar, MoreVertical } from "lucide-react";
import { Badge } from "@/components/atoms/badge";

export interface CampaignCardData {
  id: number;
  campaignId?: string;
  title: string;
  desc: string;
  img: string;
  loc: string;
  extra: number;
  date: string;
  archived: boolean;
}

export function CampaignCard({ data }: { data: CampaignCardData }) {
  const cardContent = (
    <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 overflow-hidden hover: transition-all group h-full flex flex-col justify-between cursor-pointer shadow-[(0,0,0,0.18)]">
      <div>
        <div className="relative h-48 overflow-hidden">
          <img src={data.img} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {data.archived && (
            <div className="absolute top-3 right-3">
              <Badge label="Archived" variant="orange" />
            </div>
          )}
        </div>
        <div className="p-5 pb-0">
          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-modRed transition-colors">{data.title}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{data.desc}</p>
          <div className="flex items-center space-x-1 mt-3 text-xs text-slate-500">
            <MapPin size={13} className="text-[#A61932]" />
            <span>{data.loc}</span>
            <span className="text-[#A61932] font-semibold ml-1">+{data.extra}</span>
          </div>
        </div>
      </div>
      <div className="p-5 pt-3 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Calendar size={13} />
          <span>{data.date}</span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );

  if (data.campaignId) {
    return (
      <Link href={`/campaigns/${data.campaignId}?from=library`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

