import { Users } from "lucide-react";

export interface PopularTemplateData {
  id: number;
  title: string;
  desc: string;
  badge: string;
  color: string;
  used: string;
  img: string;
}

export function PopularTemplateCard({ data }: { data: PopularTemplateData }) {
  return (
    <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 overflow-hidden hover: transition-all flex flex-row h-40 shadow-[(0,0,0,0.18)]">
      <div className="w-40 shrink-0 overflow-hidden">
        <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-center">
        <span className={`self-start text-[10px] font-bold text-white px-2.5 py-0.5 rounded-md uppercase tracking-wide mb-2 ${data.color}`}>
          {data.badge}
        </span>
        <h3 className="text-[15px] font-bold text-slate-900">{data.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{data.desc}</p>
        <div className="flex items-center space-x-1 mt-3 text-xs text-slate-400">
          <Users size={13} />
          <span>{data.used} used</span>
        </div>
      </div>
    </div>
  );
}
