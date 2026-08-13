import React from "react";
import { Inbox } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No records found",
  description = "There are no items to display at this time.",
  action,
  className = "",
}) {
  const { isLight } = useTheme();

  return (
    <div
      className={`p-10 border rounded-2xl text-center flex flex-col items-center justify-center space-y-3 ${
        isLight
          ? "bg-white/80 border-slate-200 text-slate-500"
          : "bg-slate-900/60 border-slate-800 text-slate-400"
      } ${className}`}
    >
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
          isLight
            ? "bg-indigo-50 border-indigo-200 text-indigo-600"
            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>
          {title}
        </h4>
        <p className="text-xs leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
