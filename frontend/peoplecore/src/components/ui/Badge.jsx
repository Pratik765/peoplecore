import React from "react";
import useTheme from "../../hooks/useTheme";

export function Badge({ children, variant = "indigo", size = "md", icon: Icon, className = "" }) {
  const { isLight } = useTheme();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-xs font-bold",
  };

  const variants = {
    indigo: isLight
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    amber: isLight
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30",
    emerald: isLight
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    red: isLight
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-red-500/10 text-red-400 border-red-500/30",
    blue: isLight
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-blue-500/10 text-blue-400 border-blue-500/30",
    violet: isLight
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : "bg-violet-500/10 text-violet-400 border-violet-500/30",
    gold: "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-400 shadow-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClasses[size] || sizeClasses.md} ${variants[variant] || variants.indigo} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
