import React from "react";
import useTheme from "../../hooks/useTheme";

export function SectionHeader({ icon: Icon, title, subtitle, action, className = "" }) {
  const { isLight } = useTheme();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-5 h-5 text-indigo-600 shrink-0" />}
        <div>
          <h2 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-slate-100"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SectionHeader;
