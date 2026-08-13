import React from "react";
import useTheme from "../../hooks/useTheme";

export function FilterBar({ filters = [], activeFilter, onSelectFilter, className = "" }) {
  const { isLight } = useTheme();

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full ${className}`}>
      {filters.map((filter) => {
        const val = typeof filter === "object" ? filter.value : filter;
        const lbl = typeof filter === "object" ? filter.label : filter;
        const isActive = activeFilter === val;

        return (
          <button
            key={val}
            onClick={() => onSelectFilter(val)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : isLight
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {lbl}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
