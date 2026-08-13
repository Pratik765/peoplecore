import React from "react";
import useTheme from "../../hooks/useTheme";

export function PageHeader({
  badgeText,
  badgeIcon: BadgeIcon,
  title,
  highlightTitle,
  description,
  action,
  children,
  className = "",
}) {
  const { isLight } = useTheme();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all ${
        isLight
          ? "bg-white/90 border-slate-200 shadow-slate-200/50"
          : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
      } ${className}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            {title} {highlightTitle && <span className="text-indigo-600">{highlightTitle}</span>}
          </h1>

          {description && (
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {description}
            </p>
          )}
        </div>

        {(action || children) && <div className="shrink-0">{action || children}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
