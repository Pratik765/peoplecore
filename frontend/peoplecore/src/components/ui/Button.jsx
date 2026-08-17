import React from "react";
import { Loader2 } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const { isLight } = useTheme();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-xs font-semibold rounded-xl gap-2",
    lg: "px-6 py-3 text-sm font-bold rounded-2xl gap-2.5",
  };

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/25 active:scale-95",
    emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/25 active:scale-95",
    amber: "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/25 active:scale-95",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-600/25 active:scale-95",
    secondary: isLight
      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80"
      : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80",
    ghost: isLight
      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
    outline: isLight
      ? "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
      : "border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 ${sizeClasses[size] || sizeClasses.md} ${variants[variant] || variants.primary} ${disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
