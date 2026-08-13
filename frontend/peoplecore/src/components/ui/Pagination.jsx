import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function Pagination({ currentPage, totalPages, onNext, onPrev, totalItems, itemsPerPage = 10, className = "" }) {
  const { isLight } = useTheme();

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || currentPage * itemsPerPage);

  return (
    <div
      className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
        isLight
          ? "border-slate-200 bg-slate-50/50 text-slate-600"
          : "border-slate-800/60 bg-slate-950/40 text-slate-400"
      } ${className}`}
    >
      <div>
        Showing <span className="font-bold text-indigo-400">{startItem}</span> to{" "}
        <span className="font-bold text-indigo-400">{endItem}</span>
        {totalItems ? ` of ${totalItems} entries` : ` (Page ${currentPage} of ${totalPages})`}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed border-transparent"
              : isLight
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed border-transparent"
              : isLight
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
