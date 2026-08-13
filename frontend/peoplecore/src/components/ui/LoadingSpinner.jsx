import React from "react";
import { Loader2 } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function LoadingSpinner({ message = "Loading data...", fullPage = false, className = "" }) {
  const { isLight } = useTheme();

  const containerClasses = fullPage
    ? "min-h-[60vh] flex flex-col items-center justify-center p-8"
    : "p-8 flex flex-col items-center justify-center space-y-3";

  return (
    <div className={`${containerClasses} ${className}`}>
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      {message && (
        <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {message}
        </span>
      )}
    </div>
  );
}

export default LoadingSpinner;
