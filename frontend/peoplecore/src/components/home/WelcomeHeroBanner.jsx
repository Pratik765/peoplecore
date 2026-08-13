import React from "react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import RoleBadge from "../common/RoleBadge";
import { Sparkles, RefreshCw } from "lucide-react";

export function WelcomeHeroBanner({ activeServicesCount, onRefresh, isLoading }) {
  const { isLight } = useTheme();
  const { role: userRole, userName } = useAuth();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
        isLight
          ? "bg-white/90 border-slate-200 shadow-slate-200/50"
          : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
      }`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RoleBadge role={userRole} />
            <span className={`text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {currentDate}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            Welcome back, <span className="text-indigo-600">{userName}</span> 👋
          </h1>
          <p className={`text-sm max-w-xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Real-time workforce management, attendance, leave tracking, and payroll operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
              isLight
                ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div
            className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800/80"
            }`}
          >
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <div className={`font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Microservices
              </div>
              <div className="text-emerald-600 font-semibold">
                {activeServicesCount || "3 / 3 Services Online"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHeroBanner;
