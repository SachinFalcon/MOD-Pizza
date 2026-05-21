/**
 * components/gantt/campaign-scheduler.tsx
 *
 * Library-agnostic Gantt renderer. Consumes only types from types/gantt.ts.
 *
 * SWAP GUIDE — to adopt Bryntum or FullCalendar later:
 *   1. Keep this file's export signature (CampaignSchedulerProps) identical.
 *   2. Replace the JSX inside <CampaignScheduler> with the vendor component.
 *   3. Map GanttTask → vendor task model in a local adapter function.
 *   4. app/campaigns/page.tsx needs zero changes.
 */

"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  Clock,
  Info,
} from "lucide-react";
import { useRbac } from "@/hooks/use-rbac";
import type {
  CampaignSchedulerProps,
  GanttTask,
  GanttConflict,
  GanttViewMode,
  GanttResource,
} from "@/types/gantt";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bar: string; badge: string }> = {
  Live:               { bar: "bg-emerald-500",  badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Approved:           { bar: "bg-blue-500",     badge: "bg-blue-50 text-blue-700 border-blue-200" },
  Sent:               { bar: "bg-violet-500",   badge: "bg-violet-50 text-violet-700 border-violet-200" },
  Draft:              { bar: "bg-slate-400",    badge: "bg-slate-50 text-slate-600 border-slate-200" },
  "Under Modification": { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

const VIEW_DAYS: Record<GanttViewMode, number> = { day: 7, week: 14, month: 30 };
const COL_WIDTH_PX = 52; // px per day column

// ─── Conflict Detection ───────────────────────────────────────────────────────

function detectConflicts(tasks: GanttTask[]): GanttConflict[] {
  const conflicts: GanttConflict[] = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      const a = tasks[i], b = tasks[j];
      const sharedOutlets = a.outletIds.filter((id) => b.outletIds.includes(id));
      if (!sharedOutlets.length) continue;
      const overlapStart = new Date(Math.max(+a.startDate, +b.startDate));
      const overlapEnd   = new Date(Math.min(+a.endDate,   +b.endDate));
      if (overlapStart < overlapEnd) {
        sharedOutlets.forEach((resourceId) =>
          conflicts.push({ taskIds: [a.id, b.id], resourceId, overlapStart, overlapEnd })
        );
      }
    }
  }
  return conflicts;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  const c = new Date(d); c.setHours(0, 0, 0, 0); return c;
}

function addDays(d: Date, n: number) {
  const c = new Date(d); c.setDate(c.getDate() + n); return c;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((+b - +a) / 86_400_000);
}

function fmt(d: Date, mode: GanttViewMode) {
  if (mode === "day")   return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  if (mode === "week")  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function TaskBar({
  task, offsetDays, durationDays, isConflicted, onClick,
}: {
  task: GanttTask; offsetDays: number; durationDays: number;
  isConflicted: boolean; onClick: (t: GanttTask) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const style = STATUS_STYLES[task.status] ?? STATUS_STYLES.Draft;
  const width  = Math.max(durationDays * COL_WIDTH_PX, 60);
  const left   = offsetDays * COL_WIDTH_PX;

  return (
    <div
      className="absolute top-2 bottom-2 group cursor-pointer"
      style={{ left, width }}
      onClick={() => onClick(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Bar */}
      <div className={`
        h-full rounded-lg flex items-center px-3 gap-2 text-white text-[11px] font-bold
        shadow-md transition-all duration-150 overflow-hidden
        ${style.bar} ${isConflicted ? "ring-2 ring-red-500 ring-offset-1" : ""}
        ${hovered ? "brightness-110 scale-y-105" : ""}
      `}>
        {isConflicted && <AlertTriangle size={11} className="shrink-0 text-white" />}
        <span className="truncate">{task.name}</span>
        <span className="ml-auto shrink-0 opacity-70">{task.runtimeLabel}</span>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-[#111827] text-white rounded-xl shadow-2xl p-3.5 text-[11px] pointer-events-none">
          <p className="font-bold text-sm mb-1.5">{task.name}</p>
          <div className="space-y-1 text-white/70">
            <p>Status: <span className="text-white font-semibold">{task.status}</span></p>
            <p>Approval: <span className="text-white font-semibold">{task.approvalType}</span></p>
            <p>Runtime: <span className="text-white font-semibold">{task.runtimeLabel}</span></p>
            <p>Coverage: <span className="text-white font-semibold">{task.coveragePercent}%</span></p>
            <p>Outlets: <span className="text-white font-semibold">{task.outletIds.length}</span></p>
            {isConflicted && (
              <p className="text-red-400 font-bold mt-1">⚠ Scheduling conflict detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceRow({
  resource, tasks, viewStart, days, conflicts, onTaskClick, onSlotClick,
}: {
  resource: GanttResource; tasks: GanttTask[]; viewStart: Date; days: number;
  conflicts: GanttConflict[]; onTaskClick: (t: GanttTask) => void;
  onSlotClick: (resourceId: string, date: Date) => void;
}) {
  const conflictedTaskIds = new Set(
    conflicts.filter((c) => c.resourceId === resource.id).flatMap((c) => c.taskIds)
  );

  return (
    <div className="flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors" style={{ minHeight: 56 }}>
      {/* Resource label */}
      <div className="w-48 shrink-0 px-4 py-3 flex flex-col justify-center border-r border-slate-100 bg-white sticky left-0 z-10">
        <p className="text-[12px] font-bold text-slate-800 truncate">{resource.name}</p>
        <p className="text-[10px] text-slate-400 font-medium truncate">{resource.region}</p>
      </div>

      {/* Timeline cells + task bars */}
      <div
        className="relative flex-1 cursor-crosshair"
        style={{ width: days * COL_WIDTH_PX }}
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const xInGrid = e.clientX - rect.left;
          const dayIdx  = Math.floor(xInGrid / COL_WIDTH_PX);
          onSlotClick(resource.id, addDays(viewStart, dayIdx));
        }}
      >
        {/* Day-column grid lines */}
        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-r border-slate-100"
            style={{ left: i * COL_WIDTH_PX, width: COL_WIDTH_PX }}
          />
        ))}

        {/* Task bars for this resource */}
        {tasks.map((task) => {
          const taskStart   = task.startDate < viewStart ? viewStart : task.startDate;
          const taskEnd     = addDays(viewStart, days);
          const clampedEnd  = task.endDate > taskEnd ? taskEnd : task.endDate;
          const offset      = daysBetween(viewStart, startOfDay(taskStart));
          const duration    = Math.max(daysBetween(startOfDay(taskStart), startOfDay(clampedEnd)), 1);

          return (
            <TaskBar
              key={task.id}
              task={task}
              offsetDays={offset}
              durationDays={duration}
              isConflicted={conflictedTaskIds.has(task.id)}
              onClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CampaignScheduler({
  tasks,
  resources,
  conflicts: externalConflicts,
  viewStart: initialViewStart,
  defaultViewMode = "week",
  timezone,
  onTaskClick,
  onSlotClick,
  isLoading = false,
}: CampaignSchedulerProps) {
  const { profile } = useRbac();
  const tz = timezone ?? profile.timezone ?? "UTC-05:00";

  const [viewMode, setViewMode] = useState<GanttViewMode>(defaultViewMode);
  const [viewStart, setViewStart] = useState<Date>(() => {
    if (initialViewStart) return startOfDay(initialViewStart);
    const earliest = tasks.reduce(
      (min, t) => (t.startDate < min ? t.startDate : min),
      new Date()
    );
    return startOfDay(earliest);
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const days = VIEW_DAYS[viewMode];

  const conflicts = useMemo(
    () => externalConflicts ?? detectConflicts(tasks),
    [tasks, externalConflicts]
  );

  const conflictCount = useMemo(
    () => new Set(conflicts.flatMap((c) => c.taskIds)).size,
    [conflicts]
  );

  const navigate = useCallback((dir: -1 | 1) => {
    setViewStart((prev) => addDays(prev, dir * Math.floor(days / 2)));
  }, [days]);

  const jumpToday = useCallback(() => setViewStart(startOfDay(new Date())), []);

  // Day header labels
  const dayHeaders = useMemo(
    () => Array.from({ length: days }, (_, i) => addDays(viewStart, i)),
    [viewStart, days]
  );

  const today = startOfDay(new Date());
  const todayOffset = daysBetween(viewStart, today);
  const todayInView = todayOffset >= 0 && todayOffset < days;

  // Tasks visible in this viewport
  const viewEnd = addDays(viewStart, days);
  const visibleTasks = useMemo(
    () => tasks.filter((t) => t.startDate < viewEnd && t.endDate > viewStart),
    [tasks, viewStart, viewEnd]
  );

  // Per-resource task buckets
  const tasksByResource = useMemo(() => {
    const map = new Map<string, GanttTask[]>();
    resources.forEach((r) => map.set(r.id, []));
    visibleTasks.forEach((task) => {
      task.outletIds.forEach((rid) => {
        if (map.has(rid)) map.get(rid)!.push(task);
      });
    });
    return map;
  }, [visibleTasks, resources]);

  if (isLoading) return <GanttSkeleton />;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          {/* Navigate */}
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-modRed hover:border-modRed/30 transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={jumpToday}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-modRed/30 hover:text-modRed transition-all uppercase tracking-wide"
          >
            Today
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-modRed hover:border-modRed/30 transition-all"
          >
            <ChevronRight size={15} />
          </button>

          {/* Date range label */}
          <span className="text-[12px] font-bold text-slate-700 ml-2">
            {fmt(viewStart, viewMode)} — {fmt(addDays(viewStart, days - 1), viewMode)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Timezone badge */}
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Clock size={11} /> {tz}
          </span>

          {/* Conflict badge */}
          {conflictCount > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold">
              <AlertTriangle size={11} />
              {conflictCount} conflict{conflictCount !== 1 ? "s" : ""}
            </span>
          )}

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(["day", "week", "month"] as GanttViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                  viewMode === m
                    ? "bg-modRed text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-modRed transition-all">
            <ZoomIn size={14} />
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-modRed transition-all">
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* ── Status legend ── */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-slate-100 overflow-x-auto">
        {Object.entries(STATUS_STYLES).map(([status, style]) => (
          <span key={status} className="flex items-center gap-1.5 shrink-0">
            <span className={`h-2 w-2 rounded-full ${style.bar}`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{status}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-auto shrink-0">
          <span className="h-2 w-2 rounded-full bg-red-500 ring-2 ring-red-300" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Conflict</span>
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="overflow-auto max-h-[520px]" ref={scrollRef}>
        {/* Day header row */}
        <div className="flex sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="w-48 shrink-0 border-r border-slate-100 px-4 py-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <LayoutGrid size={11} /> Outlet
            </span>
          </div>
          <div className="flex">
            {dayHeaders.map((day, i) => {
              const isToday = +startOfDay(day) === +today;
              const isWeekend = [0, 6].includes(day.getDay());
              return (
                <div
                  key={i}
                  style={{ width: COL_WIDTH_PX }}
                  className={`shrink-0 px-1 py-2.5 text-center border-r border-slate-100 ${
                    isToday ? "bg-modRed/5" : isWeekend ? "bg-slate-50" : ""
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase ${isToday ? "text-modRed" : "text-slate-400"}`}>
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className={`text-[12px] font-black ${isToday ? "text-modRed" : "text-slate-700"}`}>
                    {day.getDate()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today marker */}
        {todayInView && (
          <div
            className="absolute top-0 bottom-0 w-px bg-modRed/60 z-30 pointer-events-none"
            style={{ left: 192 + todayOffset * COL_WIDTH_PX + COL_WIDTH_PX / 2 }}
          />
        )}

        {/* Resource rows */}
        {resources.length === 0 ? (
          <EmptyState message="No outlets configured" />
        ) : tasks.length === 0 ? (
          <EmptyState message="No campaigns in this time range" />
        ) : (
          resources.map((resource) => (
            <ResourceRow
              key={resource.id}
              resource={resource}
              tasks={tasksByResource.get(resource.id) ?? []}
              viewStart={viewStart}
              days={days}
              conflicts={conflicts.filter((c) => c.resourceId === resource.id)}
              onTaskClick={onTaskClick ?? (() => {})}
              onSlotClick={onSlotClick ?? (() => {})}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <Info size={11} />
          {visibleTasks.length} campaign{visibleTasks.length !== 1 ? "s" : ""} · {resources.length} outlet{resources.length !== 1 ? "s" : ""}
          {conflictCount > 0 && ` · ${conflictCount} conflict${conflictCount !== 1 ? "s" : ""}`}
        </p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Custom renderer · Bryntum-ready
        </p>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function GanttSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="h-14 bg-slate-50 border-b border-slate-100" />
      <div className="h-10 bg-slate-50 border-b border-slate-100" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex border-b border-slate-100 h-14">
          <div className="w-48 border-r border-slate-100 px-4 py-3">
            <div className="h-3 bg-slate-200 rounded w-28 mb-1.5" />
            <div className="h-2 bg-slate-100 rounded w-16" />
          </div>
          <div className="flex-1 relative">
            <div
              className="absolute top-3 h-8 bg-slate-200 rounded-lg"
              style={{ left: Math.random() * 200 + 20, width: Math.random() * 180 + 80 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <LayoutGrid size={32} className="mb-3 opacity-30" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
