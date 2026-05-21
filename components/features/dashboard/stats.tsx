import React from "react";
import Link from "next/link";
import { 
  Megaphone, 
  Clock, 
  Target, 
  Rocket,
  Zap,
  Plus,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Upload,
  MessageSquare,
  FileText,
  Bell
} from "lucide-react";



export function KPICard({ title, value, unit = "", trend, iconType, href }: { title: string; value: string; unit?: string; trend: string; iconType: string; href?: string }) {
  const isPositive = trend.startsWith('+');
  
  const icons: Record<string, React.ReactNode> = {
    megaphone: <Megaphone size={16} className="text-modRed" />,
    clock: <Clock size={16} className="text-orange-500" />,
    target: <Target size={16} className="text-blue-500" />,
    rocket: <Rocket size={16} className="text-modRed" />
  };

  const bgColors: Record<string, string> = {
    megaphone: "bg-red-50",
    clock: "bg-orange-50",
    target: "bg-blue-50",
    rocket: "bg-red-50"
  };

  const card = (
    <div className={`bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full group ${href ? 'cursor-pointer hover:border-modRed/20' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-[11px] font-bold text-[#556987] uppercase tracking-wider">{title}</h4>
        <div className={`p-1.5 rounded-md ${bgColors[iconType]}`}>
           {icons[iconType]}
        </div>
      </div>
      
      <div className="flex items-end space-x-2 mb-3">
        <span className="text-3xl font-black text-slate-900 leading-none">{value}</span>
        <div className="flex items-center space-x-1 mb-0.5">
          {unit && <span className="text-[11px] font-bold text-slate-500 uppercase">{unit}</span>}
          <span className={`text-[13px] font-bold ${isPositive ? 'text-[#00B060]' : 'text-modRed'}`}>
            {trend}
          </span>
        </div>
      </div>
      
      <div className="mt-auto flex items-end justify-between">
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          {title === "Live Campaigns" ? "Active campaigns across 212 Outlets" : 
           title === "Awaiting Approval" ? "Avg time taken by publisher to review" :
           title === "Campaigns Created" ? "Total outlets covered in the network" :
           "Outlets displaying your campaigns"}
        </p>
        {href && (
          <ArrowUpRight size={14} className="text-slate-300 group-hover:text-modRed transition-colors shrink-0 ml-2" />
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{card}</Link>;
  }
  return card;
}

export function TaskItem({ title, desc, actionLabel, status }: { title: string; desc: string; actionLabel?: string; status?: string }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-slate-50 group hover:shadow-sm transition-all">
      <div>
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500 mt-1 font-medium">{desc}</p>
      </div>
      {actionLabel ? (
        <button className="px-6 py-2.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 transition-all uppercase tracking-widest text-slate-900">
          {actionLabel}
        </button>
      ) : status && (
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
           <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></div>
           <span>{status}</span>
        </div>
      )}
    </div>
  );
}

export function QuickActionButton({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="bg-[#F8F9FA] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-slate-100">
      <div className="p-3 bg-red-50 rounded-lg text-modRed mb-4 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-900 leading-tight">{label}</p>
      <p className="text-xs text-slate-500 font-medium mt-1.5 tracking-tight">{sub}</p>
    </div>
  );
}

export function OpportunityItem({ title, date, sub }: { title: string; date: string; sub: string }) {
  return (
    <div className="flex items-center justify-between pl-4 relative group">
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-modRed rounded-full opacity-80"></div>
      
      <div className="py-2">
        <p className="text-xs font-semibold text-slate-500">{date}</p>
        <h4 className="text-base font-bold text-slate-900 leading-tight mt-0.5">{title}</h4>
        <p className="text-sm text-slate-500 font-medium mt-1">{sub}</p>
      </div>
      <button className="px-5 py-2.5 bg-modRed text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest">
        CREATE
      </button>
    </div>
  );
}

export function PerformanceGauge({ rate }: { rate: number }) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative h-28 w-28 flex items-center justify-center">
        <svg className="absolute inset-0 h-full w-full transform -rotate-90">
          <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
          <circle 
            cx="56" 
            cy="56" 
            r="48" 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={301.6} 
            strokeDashoffset={301.6 * (1 - rate / 100)} 
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-1000 ease-out" 
          />
        </svg>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tighter text-slate-900">{rate}%</p>
          <Zap size={14} className="text-emerald-500 mx-auto fill-emerald-500 mt-0.5" />
        </div>
      </div>
      <p className="text-xs font-bold text-slate-500 mt-5 uppercase tracking-[0.2em]">Approval Rate</p>
    </div>
  );
}
