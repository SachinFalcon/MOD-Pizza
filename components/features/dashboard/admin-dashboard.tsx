"use client";

import React, { useState } from "react";
import {
  Globe,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  FileCheck,
  RefreshCw,
  X,
  Award,
  Rocket,
  Megaphone,
  Clapperboard,
  ArrowUpRight,
  Store
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { USAMap } from "@/components/features/dashboard/usa-map";
import { DateRangePickerPopover } from "@/components/ui/date-range-picker-popover";
import { GhibliOrdersPhase } from "@/components/features/dashboard/ghibli/ghibli-orders-phase";
import { GhibliPrepPhase } from "@/components/features/dashboard/ghibli/ghibli-prep-phase";
import { GhibliBakePhase } from "@/components/features/dashboard/ghibli/ghibli-bake-phase";
import { GhibliInteractivePizza } from "@/components/features/dashboard/ghibli/ghibli-interactive-pizza";
import { useRbac } from "@/hooks/use-rbac";

type BannerPhase = "orders" | "prep" | "bake" | "reveal" | "interactive";

const PUBLISHER_KPIS = [
  { title: "Live Campaigns", value: "118", suffix: " /312", trend: "+5%", desc: "312 campaigns are being broadcast", iconType: "megaphone", color: "bg-red-50 text-modRed" },
  { title: "Offline Screens", value: "8", trend: "-3%", desc: "Action Required", iconType: "screen", color: "bg-red-50 text-modRed", isNegative: true },
  { title: "Pending Approvals", value: "14", trend: "-2%", desc: "Campaigns are waiting for review", iconType: "clipboard", color: "bg-red-50 text-modRed" },
  { title: "Deploy Success Rate", value: "98.4%", trend: "+0.2%", desc: "312 campaigns are being broadcast", iconType: "rocket", color: "bg-red-50 text-modRed" }
];

const ALERTS = [
  { title: "Outlet #12 Screen Offline", message: "15 screens unresponsive", time: "10:05 AM", actionable: true, isNew: true },
  { title: "Failed Deployment", message: "Lunch Promo failed on 2 Outlets", time: "10:01 AM", actionable: true, isNew: true },
  { title: "New Outlet Added", message: "Virginia location registered successfully", time: "Yesterday", actionable: false, isNew: false },
  { title: "System Update Complete", message: "v3.2.1 deployed across all nodes", time: "Yesterday", actionable: false, isNew: false }
];

const PENDING_APPROVALS = [
  { name: "Spring Sale Promo", id: "CMP-10234", target: "42 Target Outlets", date: "12 Mar, 2026", editor: { name: "Chris Wong (Editor)", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" }, publisher: { name: "Olivia Grant (Publisher)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }, waitTime: "120 Hrs, 16 Min", isOverdue: true, thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=100&fit=crop" },
  { name: "Holiday Promo Loop", id: "CMP-10235", target: "42 Target Outlets", date: "12 Mar, 2026", editor: { name: "Maria Lopez (Editor)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }, publisher: { name: "Noah Brooks (Publisher)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, waitTime: "120 Hrs, 16 Min", isOverdue: false, thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=100&fit=crop" },
  { name: "Lunch Promo", id: "CMP-10236", target: "42 Target Outlets", date: "12 Mar, 2026", editor: { name: "Maria Lopez (Editor)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }, publisher: { name: "Noah Brooks (Publisher)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, waitTime: "120 Hrs, 16 Min", isOverdue: false, thumbnail: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&h=100&fit=crop" },
  { name: "Student Offer", id: "CMP-10237", target: "42 Target Outlets", date: "12 Mar, 2026", editor: { name: "Maria Lopez (Editor)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }, publisher: { name: "Noah Brooks (Publisher)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }, waitTime: "120 Hrs, 16 Min", isOverdue: false, thumbnail: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=150&h=100&fit=crop" }
];

const TOP_EDITORS = [
  { name: "Jaxson Calzoni", rank: 2, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" },
  { name: "Tiana Arcand", rank: 1, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", isTop: true },
  { name: "Daniel Ross", rank: 3, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" }
];

const RUNTIME_STATS = [
  { name: "Tiana Arcand", rank: 1, runtime: "145h 30m", tag: "Weekend Promo", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop", color: "bg-yellow-400" },
  { name: "Jaxson Calzoni", rank: 2, runtime: "122h 14m", tag: "Holiday Promo Loop", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop", color: "bg-slate-300" },
  { name: "Daniel Ross", rank: 3, runtime: "118h 29m", tag: "Festival Campaign", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", color: "bg-orange-600" }
];

export default function AdminDashboard() {
  const { profile } = useRbac();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [phase, setPhase] = useState<BannerPhase>("orders");

  React.useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      setPhase("orders");
      timeouts.push(setTimeout(() => setPhase("prep"), 4000));
      timeouts.push(setTimeout(() => setPhase("bake"), 8000));
      timeouts.push(setTimeout(() => setPhase("reveal"), 11000));
      timeouts.push(setTimeout(() => setPhase("interactive"), 12000));
    };

    runSequence();
    const loopInterval = setInterval(() => {
      timeouts.forEach(clearTimeout);
      timeouts = [];
      runSequence();
    }, 32000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  const isRevealed = phase === "reveal" || phase === "interactive";

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-transparent">
      {/* 1. Header Title & Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">Hi, {profile.name}! <span className="ml-2">🍕</span></h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Let's track the Global Campaign Performance.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterButton icon={<Globe size={18} strokeWidth={2} />} label="All USA" />
          <div className="relative">
            <FilterButton
              icon={<Calendar size={18} strokeWidth={2} className={startDate && endDate ? "text-modRed" : ""} />}
              label={startDate && endDate
                ? `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`
                : "Today"}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            />
            <DateRangePickerPopover
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(start, end) => { setStartDate(start); setEndDate(end); setIsCalendarOpen(false); }}
              onClear={() => { setStartDate(undefined); setEndDate(undefined); setIsCalendarOpen(false); }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-4 items-start">
        {/* Main Content Column (Left) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">

          {/* KPI Grid + Alerts */}
          <div className="grid grid-cols-12 gap-6">

            {/* KPI Cards (2x2 Grid) */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
              {PUBLISHER_KPIS.map((kpi, i) => (
                <div key={i} className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-[11px] font-bold text-[#556987] uppercase tracking-wider leading-tight w-2/3">{kpi.title}</h4>
                      <div className={`p-1.5 rounded-md ${kpi.color}`}>
                        {kpi.iconType === 'megaphone' && <Megaphone size={16} />}
                        {kpi.iconType === 'screen' && <AlertTriangle size={16} />}
                        {kpi.iconType === 'clipboard' && <FileCheck size={16} />}
                        {kpi.iconType === 'rocket' && <Rocket size={16} />}
                      </div>
                    </div>
                    <div className="flex items-end space-x-1.5 mt-2">
                      <span className="text-4xl font-bold text-slate-900 leading-none tracking-tight">{kpi.value}</span>
                      {kpi.suffix && <span className="text-sm font-semibold text-slate-400 mb-1">{kpi.suffix}</span>}
                      <span className={`text-[13px] font-bold mb-1 ml-1 ${kpi.isNegative ? 'text-modRed' : 'text-[#00B060]'}`}>{kpi.trend}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-4">{kpi.desc}</p>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="col-span-12 md:col-span-5 flex flex-col">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-[16px] font-medium text-slate-900 tracking-tight">Alerts</h3>
                <button className="text-[14px] font-medium text-modRed hover:underline tracking-tight">View All</button>
              </div>
              <div className="flex-1 flex flex-col justify-start space-y-3">
                {ALERTS.map((alert, i) => (
                  <div key={i} className="bg-white rounded-[8px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex flex-col space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 pr-6">
                        <h4 className="text-[14px] font-medium text-slate-900 leading-tight">{alert.title}</h4>
                        {alert.isNew && (
                          <span className="bg-[#B91C1C] text-white text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[4px] leading-tight">NEW</span>
                        )}
                      </div>
                      <button className="text-slate-500 hover:text-slate-700 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center h-[26px]">
                      <p className="text-[12px] text-slate-500 font-normal truncate pr-2">
                        {alert.message} <span className="mx-1">•</span> {alert.time}
                      </p>
                      {alert.actionable && (
                        <button className="text-modRed text-[12px] font-medium flex items-center shrink-0 bg-[#FFF1F2] px-2 py-1 rounded-[4px] hover:bg-[#FFE4E6] transition-colors">
                          <ArrowUpRight size={14} className="mr-1" strokeWidth={2.5} /> Escalate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pending Approvals List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[16px] font-medium text-slate-900 tracking-tight">Pending Approvals</h3>
              <button className="text-[14px] font-medium text-modRed hover:underline tracking-tight">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {PENDING_APPROVALS.map((item, idx) => (
                <div key={idx} className={`bg-white rounded-[8px] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex items-start gap-4 relative border ${item.isOverdue ? 'border-modRed' : 'border-transparent'}`}>
                  {item.isOverdue && (
                    <div className="absolute top-3.5 right-3.5 bg-[#FFF1F2] text-modRed text-[11px] font-medium px-2 py-0.5 rounded-[4px]">
                      Overdue
                    </div>
                  )}

                  <div className="w-[100px] h-[70px] shrink-0 rounded-[6px] overflow-hidden relative">
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-black/50 border border-white/40 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5 opacity-90" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-20 flex flex-col justify-between h-[70px]">
                    <div>
                      <h4 className="text-[16px] font-medium text-slate-900 truncate leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-normal leading-none mt-1">Campaign ID: {item.id}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-auto">
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center space-x-1.5"><Store size={12} /><span>{item.target}</span></div>
                        <div className="flex items-center space-x-1.5"><Calendar size={12} /><span>Submitted: {item.date}</span></div>
                        <div className={`flex items-center space-x-1.5 font-medium ${item.isOverdue ? 'text-slate-600' : 'text-slate-500'}`}>
                          <Clock size={12} />
                          <span>{item.waitTime}</span>
                          {item.isOverdue && <AlertTriangle size={12} className="text-[#B91C1C]" fill="#B91C1C" stroke="#fff" strokeWidth={1} />}
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="flex items-center space-x-2">
                          <img src={item.editor.avatar} alt="Editor" className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                          <span className="text-[11px] font-medium text-slate-900">{item.editor.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img src={item.publisher.avatar} alt="Publisher" className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                          <span className="text-[11px] font-medium text-slate-900">{item.publisher.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution Map */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[16px] font-medium text-slate-900 tracking-tight">Campaign Distribution</h3>
            </div>
            <div className="pt-2">
              <USAMap />
            </div>
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-12 lg:col-span-3 space-y-6">

          {/* Redemption Pulse (Red Banner with Animation) */}
          <div className="bg-modRed rounded-xl p-6 text-white relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex flex-col justify-between items-center text-center group min-h-[520px]">
            {/* SVG Noise Overlay */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                backgroundSize: '150px 150px'
              }}
            />
            {/* Background Floating Ingredients */}
            <img src="/images/spinach.png" alt="spinach" className="absolute top-10 right-4 w-8 h-8 opacity-90 -rotate-12 pointer-events-none" />
            <img src="/images/mushroom.png" alt="mushroom" className="absolute top-[35%] left-4 w-10 h-10 opacity-80 rotate-12 pointer-events-none" />
            <img src="/images/pice.png" alt="tomato" className="absolute top-[45%] right-10 w-8 h-8 opacity-90 -rotate-45 pointer-events-none" />
            <img src="/images/onionrings.png" alt="onion" className="absolute bottom-16 left-2 w-12 h-12 opacity-80 pointer-events-none" />
            <img src="/images/shimlamirch.png" alt="pepper" className="absolute bottom-[25%] left-[35%] w-10 h-10 opacity-70 rotate-45 pointer-events-none" />
            <img src="/images/pice.png" alt="pepperoni" className="absolute bottom-24 right-12 w-7 h-7 opacity-90 pointer-events-none" />
            <img src="/images/chilli.png" alt="chilli" className="absolute -bottom-2 right-2 w-12 h-12 opacity-80 pointer-events-none" />
            <img src="/images/spinach2.png" alt="basil" className="absolute top-[50%] left-[30%] w-8 h-8 opacity-80 pointer-events-none" />

            <div className="absolute top-0 right-0 p-4 opacity-50"><RefreshCw size={16} /></div>

            <div className="relative z-10 w-full mb-4 text-left">
              <h3 className="text-[16px] font-bold text-white mb-0.5">Insight Pulse</h3>
              <p className="text-[11px] text-white/80 font-medium">Live system intelligence</p>
            </div>

            {/* Sliding Popups */}
            <div className="relative z-20 w-full flex flex-col gap-2 mt-2 mb-6 overflow-hidden pr-2">
              {[
                { title: "Sudden Drop Detected", desc: "4 screens went offline in the last 2 hours", icon: TrendingDown },
                { title: "Approval Bottleneck", desc: "Delays increasing since yesterday evening", icon: Clock },
                { title: "Deployment instability", desc: "Failures higher than usual baseline", icon: AlertTriangle }
              ].map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: "120%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + idx * 0.15, type: "spring", bounce: 0.3 }}
                  className="bg-white/20 backdrop-blur-md rounded-md p-2.5 flex items-center gap-3 border border-white/10 shadow-sm"
                >
                  <div className="bg-white/20 rounded p-1.5 flex items-center justify-center shrink-0">
                    <alert.icon size={14} className="text-white" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h4 className="text-[13px] font-bold text-white leading-tight">{alert.title}</h4>
                    <p className="text-[10px] text-white/80 mt-0.5 leading-tight truncate">{alert.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MOD Pizza Animated Graphic */}
            <div className="relative z-10 mt-auto w-full pt-6 pb-2 flex items-center justify-center">
              <motion.div
                layout
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className={`relative flex items-center select-none origin-center scale-100 ${phase === "interactive" ? "pointer-events-auto z-30" : "pointer-events-none z-10"}`}
              >
                <div className="relative flex items-center font-black text-white leading-none">
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-0 -mr-6 text-[120px] font-black tracking-tighter"
                        style={{ transformOrigin: "right" }}
                      >
                        M
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Central Animation Area */}
                  <div className="w-[160px] h-[160px] relative z-10 shrink-0 flex items-center justify-center">
                    <AnimatePresence>
                      {phase === "orders" && (
                        <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                          <GhibliOrdersPhase />
                        </motion.div>
                      )}
                      {phase === "prep" && (
                        <motion.div key="prep" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                          <GhibliPrepPhase />
                        </motion.div>
                      )}
                      {phase === "bake" && (
                        <motion.div key="bake" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                          <GhibliBakePhase />
                        </motion.div>
                      )}
                      {isRevealed && (
                        <motion.div key="interactive" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                          <GhibliInteractivePizza interactive={phase === "interactive"} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isRevealed && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative z-0 -ml-6 text-[120px] font-black tracking-tighter"
                        style={{ transformOrigin: "left" }}
                      >
                        D
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Top 3 Editors Widget */}
          <div className="bg-[rgba(255,255,255,0.75)] rounded-xl border border-slate-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
            <h3 className="text-[14px] font-bold text-slate-900 mb-6 tracking-tight">Top 3 Editors</h3>

            {/* Podium layout */}
            <div className="flex justify-center items-end h-40 space-x-2 relative mt-4">
              {/* 2nd Place */}
              <div className="w-[30%] flex flex-col items-center z-10 relative">
                <div className="relative mb-2">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 z-10"
                  >
                    <TrophySVG type="silver" className="w-8 h-8 drop-shadow-sm" />
                  </motion.div>
                  <img src={TOP_EDITORS[0].avatar} className="w-12 h-12 rounded-full border-[3px] border-slate-300 object-cover relative z-0 bg-white" alt="2nd" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-700 shadow-sm z-10">
                    2
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-800 text-center leading-tight mt-1">{TOP_EDITORS[0].name}</p>
              </div>

              {/* 1st Place */}
              <div className="w-[40%] flex flex-col items-center z-20 relative -translate-y-6">
                <div className="relative mb-2 mt-4">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="absolute -top-11 left-1/2 -translate-x-1/2 z-10"
                  >
                    <TrophySVG type="gold" className="w-12 h-12 drop-shadow-md" />
                  </motion.div>
                  <img src={TOP_EDITORS[1].avatar} className="w-16 h-16 rounded-full border-[4px] border-yellow-400 object-cover shadow-[0_4px_20px_rgba(0,0,0,0.18)] relative z-0 bg-white" alt="1st" />
                </div>
                <p className="text-xs font-black text-slate-900 text-center leading-tight mt-2">{TOP_EDITORS[1].name}</p>
              </div>

              {/* 3rd Place */}
              <div className="w-[30%] flex flex-col items-center z-10 relative translate-y-2">
                <div className="relative mb-2">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
                  >
                    <TrophySVG type="bronze" className="w-6 h-6 drop-shadow-sm" />
                  </motion.div>
                  <img src={TOP_EDITORS[2].avatar} className="w-10 h-10 rounded-full border-[3px] border-orange-400 object-cover relative z-0 bg-white" alt="3rd" />
                  <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-sm z-10">
                    3
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-800 text-center leading-tight mt-1">{TOP_EDITORS[2].name}</p>
              </div>
            </div>
          </div>

          {/* Campaign Runtime */}
          <div className="mt-8">
            <h3 className="text-[15px] font-semibold text-slate-900 mb-4 tracking-tight">Campaign Runtime</h3>
            <div className="space-y-3">
              {RUNTIME_STATS.map((stat, i) => {
                const isGold = stat.rank === 1;
                const isSilver = stat.rank === 2;

                const badgeColor = isGold ? "bg-[#F5B027]" : isSilver ? "bg-[#9CA3AF]" : "bg-[#A5471B]";
                const tagBgColor = isGold ? "bg-[#FFF9EA]" : isSilver ? "bg-[#F8F9FA]" : "bg-[#FFF4F0]";
                const tagTextColor = isGold ? "text-[#F5B027]" : isSilver ? "text-[#9CA3AF]" : "text-[#A5471B]";

                return (
                  <div key={i} className="bg-white rounded-[8px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.18)] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium text-white shrink-0 ${badgeColor}`}>
                        {stat.rank}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[15px] font-medium text-slate-900 leading-none">{stat.name}</p>
                        <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] w-fit ${tagBgColor}`}>
                          <Clapperboard size={12} className={tagTextColor} />
                          <p className={`text-[12px] font-medium ${tagTextColor}`}>{stat.tag}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[15px] font-medium text-slate-900">{stat.runtime}</span>
                  </div>
                );
              })}
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}

function FilterButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-2 bg-[#F4F4F5] rounded-full px-5 py-2.5 text-[15px] font-medium text-slate-900 cursor-pointer hover:bg-[#E4E4E7] transition-all active:scale-95 shadow-sm"
    >
      <div className="text-slate-900">{icon}</div>
      <span>{label}</span>
      <ChevronDown size={18} className="text-slate-600 ml-1" />
    </div>
  );
}

const TrophySVG = ({ type, className }: { type: 'gold' | 'silver' | 'bronze', className?: string }) => {
  const colors = {
    gold: { main: "#FBBF24", dark: "#D97706", light: "#FDE68A", base: "#92400E" },
    silver: { main: "#D1D5DB", dark: "#9CA3AF", light: "#F3F4F6", base: "#4B5563" },
    bronze: { main: "#D97706", dark: "#92400E", light: "#FBBF24", base: "#78350F" }
  }[type];

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M15 16C10 16 6 20 8 28C10 36 15 36 20 36" stroke={colors.dark} strokeWidth="4" strokeLinecap="round" />
      <path d="M49 16C54 16 58 20 56 28C54 36 49 36 44 36" stroke={colors.dark} strokeWidth="4" strokeLinecap="round" />
      <path d="M16 12C16 12 16 34 32 38C48 34 48 12 48 12H16Z" fill={colors.main} stroke={colors.dark} strokeWidth="2" />
      <ellipse cx="32" cy="12" rx="16" ry="4" fill={colors.light} stroke={colors.dark} strokeWidth="2" />
      <rect x="28" y="38" width="8" height="12" fill={colors.main} stroke={colors.dark} strokeWidth="2" />
      <path d="M22 50H42L44 56H20L22 50Z" fill={colors.base} />
    </svg>
  );
}
