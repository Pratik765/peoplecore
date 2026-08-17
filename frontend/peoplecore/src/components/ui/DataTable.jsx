import React from "react";
import useTheme from "../../hooks/useTheme";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

export function DataTable({ headers = [], children, loading = false, empty = false, emptyMessage = "No data available.", className = "" }) {
  const { isLight } = useTheme();

  if (loading) {
    return <LoadingSpinner message="Loading records..." />;
  }

  if (empty) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div
      className={`overflow-x-auto rounded-2xl border transition-colors ${
        isLight
          ? "border-slate-200/90 bg-white shadow-sm"
          : "border-slate-800/80 bg-slate-900/70 shadow-lg shadow-slate-950/40 backdrop-blur-md"
      } ${className}`}
    >
      <table className="w-full min-w-[640px] text-left text-xs border-collapse">
        <thead>
          <tr
            className={`border-b text-[11px] font-semibold tracking-wider uppercase ${
              isLight
                ? "bg-slate-50/90 border-slate-200/80 text-slate-500"
                : "bg-slate-950/80 border-slate-800/80 text-slate-400"
            }`}
          >
            {headers.map((header, idx) => (
              <th key={idx} className="py-3.5 px-5 font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`divide-y text-xs ${
            isLight ? "divide-slate-100 text-slate-700" : "divide-slate-800/50 text-slate-200"
          }`}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
