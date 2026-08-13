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
    <div className={`overflow-x-auto rounded-2xl border ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/60"} ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className={`border-b font-bold ${isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-950/70 border-slate-800 text-slate-300"}`}>
            {headers.map((header, idx) => (
              <th key={idx} className="py-3 px-4 uppercase tracking-wider text-[11px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isLight ? "divide-slate-200" : "divide-slate-800/60"}`}>
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
