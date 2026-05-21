import { Monitor, Image as ImageIcon, MoreVertical } from "lucide-react";
import { Badge } from "@/components/atoms/badge";

export interface AssetCardData {
  id: number;
  title: string;
  res: string;
  size: string;
  type: "VIDEO" | "IMAGE";
  used: number;
  img: string;
}

export function AssetCard({ data }: { data: AssetCardData }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img src={data.img} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3">
          <Badge label={data.type} variant={data.type === "VIDEO" ? "dark" : "red"} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-slate-900">{data.title}</h3>
        <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-400">
          <Monitor size={13} />
          <span>{data.res}</span>
          <span>•</span>
          <span>{data.size}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-1 text-xs text-[#A61932] font-medium">
            <ImageIcon size={13} />
            <span>Used in {data.used} campaigns</span>
          </div>
          <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
