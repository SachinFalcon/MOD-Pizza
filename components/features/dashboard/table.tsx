import React from "react";
import { MoreVertical, Play, Clock, ExternalLink, AlertCircle, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";

interface CampaignRowProps {
  name: string;
  id: string;
  outlets: string;
  runtime: string;
  coverage: number;
  status: string;
  color: string;
  creatives?: string;
  lastEdit?: string;
}

export function CampaignTableRow({ name, id, outlets, runtime, coverage, status, color, creatives, lastEdit }: CampaignRowProps) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
             <img src={`https://picsum.photos/seed/${id}/100/100`} alt="Creative" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          </div>
          <div>
            <Link href={`/campaigns/${id}`} className="text-[13px] font-bold text-slate-900 hover:text-modRed transition-colors">
              {name}
            </Link>
            <p className="text-[11px] text-slate-400 font-medium">ID: {id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-5 text-[13px] font-semibold text-slate-800">{creatives || "3 Assets"}</td>
      <td className="px-4 py-5 text-[13px] font-semibold text-slate-800">{outlets}</td>
      <td className="px-4 py-5">
        <StatusBadge status={status} />
      </td>
      <td className="px-4 py-5 text-[13px] font-semibold text-slate-800">{runtime}</td>
      <td className="px-4 py-5">
        {lastEdit?.includes("ago") ? (
          <div className="flex items-center space-x-2 text-slate-500">
            <Clock size={14} />
            <span className="text-[13px] font-medium">{lastEdit}</span>
          </div>
        ) : (
          <span className="text-[13px] font-medium text-slate-500">{lastEdit || "Mar 10, 2026"}</span>
        )}
      </td>
      <td className="px-6 py-5 text-right">
        <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}

export function CampaignMobileRow({ name, id, outlets, runtime, coverage, status, color, creatives, lastEdit }: CampaignRowProps) {
  return (
    <div className="p-4 space-y-4 border-b border-slate-100 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
             <img src={`https://picsum.photos/seed/${id}/100/100`} alt="Creative" className="w-full h-full object-cover" />
          </div>
          <div>
            <Link href={`/campaigns/${id}`} className="text-sm font-bold text-slate-900 hover:text-modRed transition-colors">
              {name}
            </Link>
            <p className="text-[11px] text-slate-400 font-medium">ID: {id}</p>
          </div>
        </div>
        <button className="p-1.5 text-slate-300">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Outlets</p>
          <p className="text-xs font-bold text-slate-600">{outlets}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Runtime</p>
          <p className="text-xs font-bold text-slate-600">{runtime}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-slate-400">
          <Clock size={14} />
          <span className="text-[12px] font-medium">{lastEdit || "Mar 10, 2026"}</span>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Live": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Sent": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "Under Modification": "bg-amber-50 text-amber-600 border-amber-100",
    "Approved": "bg-emerald-50/60 text-emerald-500 border-emerald-100/50",
    "Draft": "bg-slate-50 text-slate-600 border-slate-100",
  };

  const icons: Record<string, React.ReactNode> = {
    "Live": <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />,
    "Sent": <Send size={10} />,
    "Under Modification": <AlertCircle size={12} />,
    "Approved": <CheckCircle2 size={12} />,
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold whitespace-nowrap ${styles[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {icons[status]}
      <span>{status}</span>
    </div>
  );
}
