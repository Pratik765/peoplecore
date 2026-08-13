import React from "react";
import { Sun, Moon } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function ThemeToggle({ showLabel = true, className = "" }) {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
        isLight
          ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
      } ${className}`}
      title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
      {showLabel && (
        <span className="hidden md:inline">
          {isLight ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
