import React from "react";
import { Search, X } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  const { isLight } = useTheme();

  return (
    <div className={`relative min-w-[200px] sm:w-64 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border transition-all outline-none ${
          isLight
            ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500"
            : "bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500"
        }`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
