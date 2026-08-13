import React from "react";
import { TrendingUp } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function StatCard({ title, value, change, icon: Icon, color = "", className = "" }) {
  const { isLight } = useTheme();

  return (
    <div
      className={`border rounded-2xl p-5 backdrop-blur-md shadow-lg transition-all duration-300 group hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/90 border-slate-200 hover:border-indigo-300 shadow-slate-200/50"
          : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80"
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
          {value}
        </div>
        {change && (
          <div className={`text-xs mt-1 flex items-center gap-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
