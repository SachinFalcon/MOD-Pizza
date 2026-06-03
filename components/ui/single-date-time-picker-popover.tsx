"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, ChevronDown } from "lucide-react";

interface SingleDateTimePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (date: Date) => void;
  onClear?: () => void;
  initialDate?: Date;
}

type PickerView = "days" | "months" | "years";

export function SingleDateTimePickerPopover({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialDate,
}: SingleDateTimePickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = initialDate || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [view, setView] = useState<PickerView>("days");

  // Time state
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("PM");
  const [openDropdown, setOpenDropdown] = useState<"hour" | "minute" | null>(null);

  // Sync initial date if it changes
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      setCurrentMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
      
      let hrs = initialDate.getHours();
      const pm = hrs >= 12;
      setAmpm(pm ? "PM" : "AM");
      
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // 0 is 12
      setHour(String(hrs).padStart(2, "0"));
      setMinute(String(initialDate.getMinutes()).padStart(2, "0"));
    } else {
      setSelectedDate(null);
      setHour("12");
      setMinute("00");
      setAmpm("PM");
    }
    setOpenDropdown(null); // Reset when opening/closing
  }, [initialDate, isOpen]);

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

  // Month navigation
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

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleApply = () => {
    if (selectedDate) {
      let hrs = parseInt(hour, 10);
      if (ampm === "PM" && hrs < 12) hrs += 12;
      if (ampm === "AM" && hrs === 12) hrs = 0;
      const mins = parseInt(minute, 10);

      const finalDate = new Date(selectedDate);
      finalDate.setHours(hrs, mins, 0, 0);
      onApply(finalDate);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
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

  // Years options
  const currentYearVal = new Date().getFullYear();
  const yearsRange = Array.from({ length: (currentYearVal + 10) - 2000 + 1 }, (_, i) => 2000 + i);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl border border-slate-200 p-5 z-10 w-[340px] animate-in zoom-in-95 duration-200 shadow-[(0,0,0,0.18)]"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Date & Time</span>
        </div>

        {/* Header View Toggle */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
          <div className="flex space-x-1.5 items-center">
            <button
              type="button"
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
              type="button"
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
                type="button"
                onClick={prevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
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
                  type="button"
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
                  type="button"
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

                const active = isSameDay(day, selectedDate);

                return (
                  <button
                    key={`day-${day.getTime()}`}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`h-9 w-9 text-xs font-bold transition-all relative flex items-center justify-center ${
                      active
                        ? "bg-[#A61932] text-white rounded-full shadow-[(0,0,0,0.18)] z-10"
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

        {/* Time Picker Section */}
        <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs font-bold text-slate-700 space-x-1.5">
              <Clock size={14} className="text-slate-400" />
              <span>Time</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Hour select */}
              <CustomTimeDropdown
                label="Hour"
                value={hour}
                options={Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))}
                onChange={setHour}
                isOpen={openDropdown === "hour"}
                onToggle={() => setOpenDropdown(openDropdown === "hour" ? null : "hour")}
              />
              
              <span className="text-slate-400 font-bold text-xs">:</span>

              {/* Minute select */}
              <CustomTimeDropdown
                label="Min"
                value={minute}
                options={Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))}
                onChange={setMinute}
                isOpen={openDropdown === "minute"}
                onToggle={() => setOpenDropdown(openDropdown === "minute" ? null : "minute")}
              />

              {/* AM/PM toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setAmpm("AM")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${ ampm === "AM" ? " bg-white text-slate-900 border border-slate-100" : "text-slate-400 hover:text-slate-600" }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setAmpm("PM")}
                  className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${ ampm === "PM" ? " bg-white text-slate-900 border border-slate-100" : "text-slate-400 hover:text-slate-600" }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Selected Date & Output Preview */}
          <div className="flex justify-between items-center text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Selected Date</span>
              <span className={`font-bold mt-0.5 ${selectedDate ? "text-slate-800" : "text-slate-400"}`}>
                {formatDateLabel(selectedDate)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Selected Time</span>
              <span className="font-bold mt-0.5 text-slate-800">
                {hour}:{minute} {ampm}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 hover:bg-red-50 text-[#A61932] rounded-lg text-xs font-bold transition-colors"
            >
              Clear
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setView("days");
                }}
                className="px-4 py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!selectedDate}
                className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all ${
                  selectedDate
                    ? "bg-[#A61932] text-white hover:bg-[#8F161A] active:scale-95 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                Apply Date
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomTimeDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  label: string;
}

function CustomTimeDropdown({ value, options, onChange, isOpen, onToggle, label }: CustomTimeDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Scroll active item into view when dropdown opens
  useEffect(() => {
    if (isOpen && activeItemRef.current && menuRef.current) {
      const activeItem = activeItemRef.current;
      const menu = menuRef.current;
      menu.scrollTop = activeItem.offsetTop - menu.offsetTop - (menu.clientHeight / 2) + (activeItem.clientHeight / 2);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 hover:bg-slate-100 transition-colors min-w-[56px] justify-between shadow-xs active:scale-95"
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-[70px] bg-white border border-slate-200 rounded-xl py-1 max-h-[160px] overflow-y-auto z-[200] animate-in fade-in slide-in-from-bottom-2 duration-150 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.1)_transparent] shadow-[(0,0,0,0.18)]"
        >
          <div className="text-[9px] font-black text-slate-400 text-center uppercase tracking-wider py-1 border-b border-slate-50 sticky top-0 bg-white z-10">
            {label}
          </div>
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                ref={isSelected ? activeItemRef : null}
                type="button"
                onClick={() => {
                  onChange(opt);
                  onToggle();
                }}
                className={`w-full text-center py-1.5 text-xs font-bold transition-colors cursor-pointer block ${
                  isSelected
                    ? "bg-[#A61932] text-white font-black"
                    : "text-slate-700 hover:bg-[#FDF2F2] hover:text-[#A61932]"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
