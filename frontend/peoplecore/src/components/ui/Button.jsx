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
    primary: "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 active:scale-95",
    amber: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold shadow-lg shadow-amber-500/25 active:scale-95",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/25 active:scale-95",
    secondary: isLight
      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700",
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
