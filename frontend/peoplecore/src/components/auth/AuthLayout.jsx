import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { Users, Sparkles, Clock, Zap } from "lucide-react";

export function AuthLayout({ children, linkText, linkTo, linkLabel }) {
  const { isLight } = useTheme();

  return (
    <div
      className={`min-h-screen lg:h-screen w-screen overflow-y-auto lg:overflow-hidden flex transition-colors selection:bg-indigo-500 selection:text-white ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Left Column: Visual Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/20 blur-[110px] rounded-full pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">PeopleCore</span>
            <span className="block text-[10px] text-indigo-300 font-semibold tracking-wider uppercase">
              HR Microservice Engine
            </span>
          </div>
        </div>

        {/* Hero Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Enterprise Workforce Management</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Streamline your workforce, attendance & leaves in one place.
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div className="font-bold text-sm">Real-Time Attendance</div>
              <div className="text-xs text-slate-400">Automated check-ins & hours calculation</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-sm">Instant Leave Approvals</div>
              <div className="text-xs text-slate-400">One-click workflow for HR managers</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>© 2026 PeopleCore Inc.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            6 Microservices Active
          </span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-base">PeopleCore</span>
          </div>
          {linkTo && (
            <div className="ml-auto text-xs">
              <span className={isLight ? "text-slate-600" : "text-slate-400"}>{linkText} </span>
              <Link
                to={linkTo}
                className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
              >
                {linkLabel}
              </Link>
            </div>
          )}
        </div>

        <div className="w-full max-w-md mx-auto z-10 space-y-5 my-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
