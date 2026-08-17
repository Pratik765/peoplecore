import React from "react";
import useTheme from "../../hooks/useTheme";
import { Shield, Briefcase, UserCheck } from "lucide-react";

export function QuickFillButtons({ onQuickFill }) {
  const { isLight } = useTheme();

  return (
    <div className="space-y-2 pt-2">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block text-center">
        Quick Sign In
      </span>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onQuickFill("pratik.kamble@peoplecore.in", "pratik@123")}
          className={`p-2.5 rounded-xl border text-left transition-all group ${
            isLight
              ? "bg-slate-50 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300"
              : "bg-slate-900/60 hover:bg-indigo-500/10 border-slate-800 hover:border-indigo-500/30"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-0.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">Pratik Kamble</p>
        </button>

        <button
          type="button"
          onClick={() => onQuickFill("meghna.kulkarni@peoplecore.in", "meghna@123")}
          className={`p-2.5 rounded-xl border text-left transition-all group ${
            isLight
              ? "bg-slate-50 hover:bg-amber-50/60 border-slate-200 hover:border-amber-300"
              : "bg-slate-900/60 hover:bg-amber-500/10 border-slate-800 hover:border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-0.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>HR Manager</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">Meghna Kulkarni</p>
        </button>

        <button
          type="button"
          onClick={() => onQuickFill("arjun.patil@peoplecore.in", "arjun@123")}
          className={`p-2.5 rounded-xl border text-left transition-all group ${
            isLight
              ? "bg-slate-50 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300"
              : "bg-slate-900/60 hover:bg-emerald-500/10 border-slate-800 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Employee</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">Arjun Patil</p>
        </button>
      </div>
    </div>
  );
}

export default QuickFillButtons;
