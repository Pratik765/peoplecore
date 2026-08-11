import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userAction } from "../store/userSlice";
import { themeAction } from "../store/themeSlice";
import NotificationBell from "./NotificationBell";
import {
  Users,
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Shield,
  Briefcase,
  UserCheck2,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Megaphone,
} from "lucide-react";

function Sidebar() {
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    reduxDispatch(userAction.logout());
    navigate("/");
  };

  const handleToggleTheme = () => {
    reduxDispatch(themeAction.toggleTheme());
  };

  const userRole = user?.user?.role || "EMPLOYEE";
  const userName = user?.user?.name || "User";

  // Role Badge Styling
  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMINISTRATOR",
          color: isLight
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          icon: Shield,
        };
      case "HR":
        return {
          label: "HR MANAGER",
          color: isLight
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Briefcase,
        };
      default:
        return {
          label: "EMPLOYEE",
          color: isLight
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: UserCheck2,
        };
    }
  };

  const roleInfo = getRoleBadge(userRole);
  const RoleIcon = roleInfo.icon;

  const isActive = (path) => location.pathname === path;

  // Dynamic Navigation Items based on Role
  const navItems = [
    {
      label: "Dashboard",
      path: "/home",
      icon: LayoutDashboard,
      roles: ["ADMIN", "HR", "EMPLOYEE"],
      badge: "Main",
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: Clock,
      roles: ["ADMIN", "HR", "EMPLOYEE"],
    },
    {
      label: "Users Directory",
      path: "/users",
      icon: Users,
      roles: ["ADMIN", "HR"],
    },
    {
      label: "Pending Requests",
      path: "/pending-request",
      icon: UserCheck2,
      roles: ["ADMIN", "HR"],
    },
    {
      label: "My Leaves",
      path: "/my-leaves",
      icon: Calendar,
      roles: ["ADMIN", "HR", "EMPLOYEE"],
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      roles: ["ADMIN", "HR", "EMPLOYEE"],
    },
    {
      label: "Announcements",
      path: "/announcements",
      icon: Megaphone,
      roles: ["ADMIN", "HR", "EMPLOYEE"],
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: User,
      roles: ["EMPLOYEE", "HR", "ADMIN"],
    },
  ].filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Menu Overlay Toggle Header */}
      <div
        className={`lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between transition-colors border-b ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-slate-900 border-slate-800 text-white"
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
          className={`p-2 rounded-lg ${
            isLight
              ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 backdrop-blur-xl border-r flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isLight
            ? "bg-white/95 border-slate-200/90 shadow-xl shadow-slate-200/40"
            : "bg-slate-900/95 border-slate-800/80"
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-5 space-y-6">
          {/* Brand Logo */}
          <Link
            to="/home"
            className="flex items-center gap-3 group transition-transform duration-200"
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg tracking-tight leading-none transition-colors ${
                  isLight
                    ? "text-slate-900 group-hover:text-indigo-600"
                    : "text-white group-hover:text-indigo-300"
                }`}
              >
                PeopleCore
              </span>
              <span
                className={`text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 mt-1 ${
                  isLight ? "text-indigo-600 font-bold" : "text-slate-400 font-medium"
                }`}
              >
                {userRole === "ADMIN"
                  ? "Admin Portal"
                  : userRole === "HR"
                  ? "HR Portal"
                  : "Employee Portal"}{" "}
                <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
              </span>
            </div>
          </Link>

          {/* Role Badge Container */}
          <div
            className={`rounded-xl p-3 border ${
              isLight
                ? "bg-slate-50 border-slate-200/80"
                : "bg-slate-950/60 border-slate-800/60"
            }`}
          >
            <div
              className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
                isLight ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Access Role
            </div>
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${roleInfo.color}`}
            >
              <RoleIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{roleInfo.label}</span>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <div
              className={`text-[10px] font-semibold uppercase tracking-wider px-3 mb-2 ${
                isLight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Navigation Menu
            </div>
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
                      <ItemIcon
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? "text-indigo-600"
                            : isLight
                            ? "text-slate-400 group-hover:text-slate-700"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {active ? (
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isLight ? "text-indigo-600" : "text-indigo-400"
                        }`}
                      />
                    ) : item.badge ? (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isLight
                            ? "bg-slate-200 text-slate-600"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Clean Sidebar Footer */}
        <div
          className={`p-4 border-t text-xs transition-colors ${
            isLight
              ? "border-slate-200 bg-slate-50/80 text-slate-500"
              : "border-slate-800/80 bg-slate-950/40 text-slate-500"
          }`}
        >
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
