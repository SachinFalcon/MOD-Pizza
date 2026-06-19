"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface MultiSelectOption {
  id: string;
  label: string;
  subLabel?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
  buttonClassName?: string;
  searchPlaceholder?: string;
}

export function MultiSelectDropdown({
  label,
  options,
  selectedIds,
  onChange,
  className = "",
  buttonClassName = "",
  searchPlaceholder = "Search....",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(query))
    );
  }, [options, searchQuery]);

  const handleSelectAll = () => {
    const newSelectedIds = new Set(selectedIds);
    filteredOptions.forEach((opt) => newSelectedIds.add(opt.id));
    onChange(Array.from(newSelectedIds));
  };

  const handleClear = () => {
    const newSelectedIds = new Set(selectedIds);
    filteredOptions.forEach((opt) => newSelectedIds.delete(opt.id));
    onChange(Array.from(newSelectedIds));
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Compute button text
  let finalDisplayText = label;
  if (selectedIds.length > 0) {
    if (selectedIds.length === options.length && options.length > 1) {
      finalDisplayText = "All Selected";
    } else if (selectedIds.length === 1) {
      const selectedOpt = options.find((o) => o.id === selectedIds[0]);
      finalDisplayText = selectedOpt ? selectedOpt.label : label;
    } else {
      finalDisplayText = `${selectedIds.length} Selected`;
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || "flex items-center justify-between space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer min-w-[130px] active:scale-95 shadow-[(0,0,0,0.18)]"}
      >
        <span>{finalDisplayText}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-[280px] w-max max-w-[350px] bg-white border border-slate-200 rounded-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg overflow-hidden flex flex-col">
          
          {/* Search Bar */}
          <div className="p-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Select All / Clear */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[13px] font-bold text-[#A61932] hover:text-[#8a152a] transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-[13px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto py-2 flex flex-col">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSelection(option.id);
                    }}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-center pt-0.5">
                      <div className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#A61932] border-[#A61932]' : 'bg-white border-slate-300'
                      }`}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[14px] font-semibold text-slate-900 leading-tight">
                        {option.label}
                      </span>
                      {option.subLabel && (
                        <span className="text-[12px] text-slate-500 mt-0.5 leading-tight">
                          {option.subLabel}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
