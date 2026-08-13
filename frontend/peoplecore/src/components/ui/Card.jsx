import React from "react";
import useTheme from "../../hooks/useTheme";

export function Card({ children, className = "", variant = "default", onClick, ...props }) {
  const { isLight } = useTheme();

  const baseStyles = "rounded-2xl border backdrop-blur-md transition-all duration-300";

  const variants = {
    default: isLight
      ? "bg-white/90 border-slate-200 shadow-lg shadow-slate-200/50"
      : "bg-slate-900/80 border-slate-800 shadow-lg shadow-slate-950/50",
    hover: isLight
      ? "bg-white/90 border-slate-200 hover:border-indigo-300 shadow-lg shadow-slate-200/50 hover:scale-[1.01]"
      : "bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-lg shadow-slate-950/50 hover:scale-[1.01]",
    glass: isLight
      ? "bg-slate-50/80 border-slate-200/80"
      : "bg-slate-950/60 border-slate-800/80",
    gradient: "bg-gradient-to-br from-indigo-900/40 via-slate-900/90 to-slate-950 border-indigo-500/30 text-white",
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
