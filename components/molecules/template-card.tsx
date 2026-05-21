import { Badge } from "@/components/atoms/badge";

export interface TemplateCardData {
  id: number;
  title: string;
  img: string;
  slots: number;
  duration: string;
  used: string;
  badge: string | null;
}

export function TemplateCard({ data }: { data: TemplateCardData }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-44 overflow-hidden">
        <img src={data.img} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {data.badge && (
          <div className="absolute top-3 right-3">
            <Badge label={data.badge} variant="dark" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3">{data.title}</h3>
        <div className="grid grid-cols-3 border border-slate-100 rounded-lg overflow-hidden text-center">
          <div className="py-2 border-r border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Slots</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{data.slots}</p>
          </div>
          <div className="py-2 border-r border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Duration</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{data.duration}</p>
          </div>
          <div className="py-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Used</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{data.used}</p>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 bg-[#A61932]/10 text-[#A61932] font-semibold text-sm rounded-lg hover:bg-[#A61932] hover:text-white transition-all">
          Use Template
        </button>
      </div>
    </div>
  );
}
