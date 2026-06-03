"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || "flex items-center justify-between space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer min-w-[130px] active:scale-95 shadow-[(0,0,0,0.18)]"}
      >
        <span>{value || label}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-full w-[180px] bg-white border border-slate-100 rounded-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150 shadow-[(0,0,0,0.18)]">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#FDF2F2] text-[#A61932] font-black"
                    : "text-slate-700 hover:bg-slate-50 font-bold"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
