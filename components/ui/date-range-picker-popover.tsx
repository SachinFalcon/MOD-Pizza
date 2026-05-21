"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface DateRangePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: Date, end: Date) => void;
  onClear?: () => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

type PickerView = "days" | "months" | "years";

export function DateRangePickerPopover({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialStartDate,
  initialEndDate,
}: DateRangePickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [view, setView] = useState<PickerView>("days");

  // Sync initial dates if they change in the parent
  useEffect(() => {
    setStartDate(initialStartDate || null);
  }, [initialStartDate]);

  useEffect(() => {
    setEndDate(initialEndDate || null);
  }, [initialEndDate]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
        setView("days"); // Reset view
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Month navigation (only relevant in days view)
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Calendar generation logic
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const blankCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const allCells = [...blankCells, ...days];

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isBetween = (day: Date) => {
    if (!startDate) return false;
    if (endDate) {
      return day > startDate && day < endDate;
    }
    if (hoverDate && hoverDate > startDate) {
      return day > startDate && day < hoverDate;
    }
    return false;
  };

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    if (onClear) {
      onClear();
    }
  };

  const formatDateLabel = (d: Date | null) => {
    if (!d) return "--/--/----";
    return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Years options (from 2000 to current year)
  const currentYearVal = new Date().getFullYear();
  const yearsRange = Array.from({ length: currentYearVal - 2000 + 1 }, (_, i) => 2000 + i);

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 z-50 w-[340px] animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header View Toggle */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
        <div className="flex space-x-1.5 items-center">
          <button 
            onClick={() => setView(view === "months" ? "days" : "months")}
            className={`px-2.5 py-1 text-sm font-black rounded-lg transition-all ${
              view === "months" 
                ? "bg-[#FDF2F2] text-[#A61932]" 
                : "text-slate-900 hover:bg-slate-50"
            }`}
          >
            {monthNames[month]}
          </button>
          <button 
            onClick={() => setView(view === "years" ? "days" : "years")}
            className={`px-2.5 py-1 text-sm font-black rounded-lg transition-all ${
              view === "years" 
                ? "bg-[#FDF2F2] text-[#A61932]" 
                : "text-slate-900 hover:bg-slate-50"
            }`}
          >
            {year}
          </button>
        </div>

        {view === "days" && (
          <div className="flex space-x-1">
            <button 
              onClick={prevMonth} 
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* MONTHS VIEW */}
      {view === "months" && (
        <div className="grid grid-cols-3 gap-2 py-2">
          {shortMonthNames.map((name, index) => {
            const isSelected = index === month;
            return (
              <button
                key={name}
                onClick={() => {
                  setCurrentMonth(new Date(year, index, 1));
                  setView("days");
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  isSelected
                    ? "bg-[#A61932] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-[#FDF2F2] hover:text-[#A61932]"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* YEARS VIEW */}
      {view === "years" && (
        <div className="grid grid-cols-3 gap-2 py-2 max-h-[180px] overflow-y-auto pr-1">
          {yearsRange.map((yr) => {
            const isSelected = yr === year;
            return (
              <button
                key={yr}
                onClick={() => {
                  setCurrentMonth(new Date(yr, month, 1));
                  setView("days");
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  isSelected
                    ? "bg-[#A61932] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-[#FDF2F2] hover:text-[#A61932]"
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>
      )}

      {/* DAYS VIEW (Standard Calendar Grid) */}
      {view === "days" && (
        <>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {allCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-9 w-9" />;

              const selectedStart = isSameDay(day, startDate);
              const selectedEnd = isSameDay(day, endDate);
              const between = isBetween(day);
              const active = selectedStart || selectedEnd;

              return (
                <button
                  key={`day-${day.getTime()}`}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => startDate && !endDate && setHoverDate(day)}
                  className={`h-9 w-9 text-xs font-bold transition-all relative flex items-center justify-center ${
                    active 
                      ? "bg-[#A61932] text-white rounded-full shadow-[0_2px_4px_rgba(166,25,50,0.25)] z-10" 
                      : between
                      ? "bg-[#FDF2F2] text-[#A61932] rounded-none hover:bg-[#FDE8E8]"
                      : "text-slate-800 hover:bg-slate-100 rounded-full"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Date Range Output Preview & Actions */}
      <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</span>
            <span className={`font-bold mt-0.5 ${startDate ? "text-slate-800" : "text-slate-400"}`}>
              {formatDateLabel(startDate)}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</span>
            <span className={`font-bold mt-0.5 ${endDate ? "text-slate-800" : "text-slate-400"}`}>
              {formatDateLabel(endDate)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-1">
          <button 
            onClick={handleClear} 
            className="px-3 py-2 hover:bg-red-50 text-[#A61932] rounded-lg text-xs font-bold transition-colors"
          >
            Clear
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                onClose();
                setView("days");
              }} 
              className="px-4 py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all ${
                startDate && endDate
                  ? "bg-[#A61932] text-white hover:bg-[#8F161A] active:scale-95 cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Apply Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
