import React from "react";

export function ToggleSwitch({ checked, onChange, leftLabel, rightLabel, badgeText, className = "" }) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
      {leftLabel && <span className="text-sm font-medium text-slate-400">{leftLabel}</span>}

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-300 ${
          checked ? "bg-gradient-to-r from-amber-500 to-indigo-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
            checked ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>

      {rightLabel && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{rightLabel}</span>
          {badgeText && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ToggleSwitch;
