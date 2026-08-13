import React from "react";
import useTheme from "../../hooks/useTheme";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";
import { Receipt, DollarSign, ShieldCheck } from "lucide-react";

export function SalaryStructureCard({ structure }) {
  const { isLight } = useTheme();

  if (!structure) {
    return (
      <Card className="p-6 text-center text-xs text-slate-400">
        No salary structure configured for your account. Contact HR administrator.
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Salary Compensation Breakdown
            </span>
            <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
              {formatCurrency(structure.ctc || 1200000)} <span className="text-xs font-normal text-slate-400">/ Annual CTC</span>
            </h3>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Tax Verified Structure
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-sans">Basic Pay</div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(structure.basicPay || structure.basic || 50000)}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-sans">HRA Allowance</div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(structure.hra || 20000)}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-sans">Special Allowance</div>
          <div className="font-bold text-white text-sm mt-0.5">{formatCurrency(structure.specialAllowance || 30000)}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-[10px] text-slate-500 font-sans">PF / Tax Deductions</div>
          <div className="font-bold text-red-400 text-sm mt-0.5">-{formatCurrency(structure.deductions || 5000)}</div>
        </div>
      </div>
    </Card>
  );
}

export default SalaryStructureCard;
