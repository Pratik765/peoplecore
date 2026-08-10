import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userAction } from "../store/userSlice";
import { themeAction } from "../store/themeSlice";
import NotificationBell from "./NotificationBell";
import {
  Users,
  LogOut,
  Sparkles,
  Shield,
  Briefcase,
  UserCheck2,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Megaphone,
} from "lucide-react";

function Navbar() {
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header
      className={`sticky top-0 z-40 h-16 border-b backdrop-blur-xl transition-colors ${
        isLight
          ? "bg-white/90 border-slate-200 shadow-sm"
          : "bg-slate-900/90 border-slate-800/80 shadow-md"
      }`}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Access Role Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleInfo.label}</span>
          </div>

          {/* Notification Bell Dropdown */}
          <NotificationBell position="top-right" />

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
              isLight
                ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
            title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
          >
            {isLight ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
            <span className="hidden md:inline">
              {isLight ? "Light" : "Dark"}
            </span>
          </button>

          {/* User Profile Badge */}
          <div
            className={`flex items-center gap-2.5 pl-2 border-l ${
              isLight ? "border-slate-200" : "border-slate-800"
            }`}
          >
            <div
              className={`h-9 w-9 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${
                isLight
                  ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                  : "bg-slate-800 border-slate-700 text-indigo-300"
              }`}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col min-w-0">
              <span
                className={`text-xs font-semibold truncate ${
                  isLight ? "text-slate-900" : "text-slate-200"
                }`}
              >
                {userName}
              </span>
              <span
                className={`text-[10px] truncate ${
                  isLight ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Active Session
              </span>
            </div>
          </div>

          {/* Prominent Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 group ${
              isLight
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm"
                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
