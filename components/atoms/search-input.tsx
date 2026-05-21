import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ placeholder = "Search...", className = "", value, onChange }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-sm w-56 focus:ring-2 focus:ring-[#A61932]/10 focus:border-[#A61932]/30 transition-all outline-none"
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
    </div>
  );
}
