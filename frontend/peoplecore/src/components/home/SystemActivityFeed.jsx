import React from "react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import SectionHeader from "../ui/SectionHeader";
import { Activity, Shield, CheckCircle2 } from "lucide-react";

export function SystemActivityFeed({ activeServicesCount }) {
  const { isLight } = useTheme();
  const { role: userRole, userName } = useAuth();

  return (
    <section className="space-y-4">
      <SectionHeader icon={Activity} title="Real-time System Log" />

      <div
        className={`border rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4 ${
          isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/70 border-slate-800/80"
        }`}
      >
        <div className={`flex items-start gap-3 pb-3.5 border-b ${isLight ? "border-slate-200" : "border-slate-800/60"}`}>
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isLight ? "text-indigo-600 bg-indigo-50" : "text-indigo-400 bg-indigo-500/10"}`}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold truncate ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                User Session Active
              </span>
              <span className="text-[10px] text-slate-500 shrink-0">Now</span>
            </div>
            <p className={`text-xs truncate leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Role: {userRole} ({userName})
            </p>
          </div>
        </div>

        <div className={`flex items-start gap-3 pb-3.5 border-b ${isLight ? "border-slate-200" : "border-slate-800/60"}`}>
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isLight ? "text-emerald-600 bg-emerald-50" : "text-emerald-400 bg-emerald-500/10"}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold truncate ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                Microservice Health Check
              </span>
              <span className="text-[10px] text-slate-500 shrink-0">Live</span>
            </div>
            <p className={`text-xs truncate leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Status: {activeServicesCount || "Checking services..."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isLight ? "text-blue-600 bg-blue-50" : "text-blue-400 bg-blue-500/10"}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold truncate ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                Account Status
              </span>
              <span className="text-[10px] text-slate-500 shrink-0">Active</span>
            </div>
            <p className={`text-xs truncate leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Verified token access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemActivityFeed;
