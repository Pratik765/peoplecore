import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import RoleBadge from "../common/RoleBadge";
import {
  Users,
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Sparkles,
  UserCheck2,
  Menu,
  X,
  ChevronRight,
  Bell,
  Megaphone,
  Receipt,
  Crown,
} from "lucide-react";

export function Sidebar() {
  const { isLight } = useTheme();
  const { role: userRole } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/home", icon: LayoutDashboard, roles: ["ADMIN", "HR", "EMPLOYEE"], badge: "Main" },
    { label: "Attendance", path: "/attendance", icon: Clock, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { label: "Payroll", path: "/payroll", icon: Receipt, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { label: "Users Directory", path: "/users", icon: Users, roles: ["ADMIN", "HR"] },
    { label: "Pending Requests", path: "/pending-request", icon: UserCheck2, roles: ["ADMIN", "HR"] },
    { label: "Subscription", path: "/subscription", icon: Crown, roles: ["ADMIN"], badge: "PRO" },
    { label: "My Leaves", path: "/my-leaves", icon: Calendar, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { label: "Notifications", path: "/notifications", icon: Bell, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { label: "Announcements", path: "/announcements", icon: Megaphone, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { label: "My Profile", path: "/profile", icon: User, roles: ["EMPLOYEE", "HR", "ADMIN"] },
  ].filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Toggle Header */}
      <div
        className={`lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between transition-colors border-b ${
          isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-white"
        }`}
      >
        <Link to="/home" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
            <Users className="w-4 h-4" />
          </div>
          <span className="font-bold text-base">PeopleCore</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`p-2 rounded-lg ${isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-slate-800"}`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 backdrop-blur-xl border-r flex flex-col justify-between transition-all duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isLight ? "bg-white/95 border-slate-200/90 shadow-xl" : "bg-slate-900/95 border-slate-800/80"}`}
      >
        <div className="p-5 space-y-6">
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-none ${isLight ? "text-slate-900" : "text-white"}`}>
                PeopleCore
              </span>
              <span className="text-[10px] font-semibold uppercase flex items-center gap-1 mt-1 text-indigo-400">
                {userRole} Portal <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
              </span>
            </div>
          </Link>

          {/* Access Role */}
          <div className={`rounded-xl p-3 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"}`}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-slate-500">Access Role</div>
            <RoleBadge role={userRole} />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider px-3 mb-2 text-slate-500">Navigation Menu</div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const ItemIcon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? isLight
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold shadow-sm"
                          : "bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-indigo-200 border border-indigo-500/40 shadow-sm"
                        : isLight
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon className={`w-4 h-4 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    {active ? (
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                    ) : item.badge ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-800 text-slate-400"}`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={`p-4 border-t text-xs ${isLight ? "border-slate-200 bg-slate-50/80 text-slate-500" : "border-slate-800 bg-slate-950/40 text-slate-500"}`}>
          <div className="flex items-center justify-between text-[11px]">
            <span>PeopleCore v1.0</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
