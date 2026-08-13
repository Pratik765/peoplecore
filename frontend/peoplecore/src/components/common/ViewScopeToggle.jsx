import React from "react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";

export function ViewScopeToggle({ viewScope, onChangeScope, className = "" }) {
  const { isLight } = useTheme();
  const { isHR } = useAuth();

  if (!isHR) return null;

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
      isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
    } ${className}`}>
      <button
        onClick={() => onChangeScope("my")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewScope === "my"
            ? "bg-indigo-600 text-white shadow-sm"
            : isLight
            ? "text-slate-600 hover:text-slate-900"
            : "text-slate-400 hover:text-white"
        }`}
      >
        My Records
      </button>
      <button
        onClick={() => onChangeScope("all")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewScope === "all"
            ? "bg-indigo-600 text-white shadow-sm"
            : isLight
            ? "text-slate-600 hover:text-slate-900"
            : "text-slate-400 hover:text-white"
        }`}
      >
        All Organization Records (HR View)
      </button>
    </div>
  );
}

export default ViewScopeToggle;
