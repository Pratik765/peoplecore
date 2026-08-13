import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { Crown, ChevronRight } from "lucide-react";

export function SubscriptionCallout() {
  const { isLight } = useTheme();
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-violet-500/15 border border-amber-500/30 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg shadow-amber-500/20">
          <Crown className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Upgrade Available
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
              PRO
            </span>
          </div>
          <h3 className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
            Unlock Silver, Gold & Diamond Subscription Tiers
          </h3>
          <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Expand employee seats, automate payroll disbursals, and access AI-driven insights.
          </p>
        </div>
      </div>
      <Link
        to="/subscription"
        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:opacity-95 transition-all shadow-md shrink-0 flex items-center gap-1.5"
      >
        <span>Explore Plans</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default SubscriptionCallout;
