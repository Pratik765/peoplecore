import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAction } from "../../store/userSlice";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import RoleBadge from "../common/RoleBadge";
import ThemeToggle from "../common/ThemeToggle";
import UserAvatar from "../common/UserAvatar";
import NotificationBell from "../NotificationBell";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { isLight } = useTheme();
  const { role: userRole, userName } = useAuth();
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    reduxDispatch(userAction.logout());
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 h-16 border-b backdrop-blur-xl transition-colors ${
        isLight ? "bg-white/90 border-slate-200 shadow-sm" : "bg-slate-900/90 border-slate-800/80 shadow-md"
      }`}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        <div className="flex items-center gap-3">
          {/* Access Role Badge */}
          <div className="hidden sm:block">
            <RoleBadge role={userRole} />
          </div>

          {/* Notification Bell Dropdown */}
          <NotificationBell position="top-right" />

          {/* Theme Switcher Button */}
          <ThemeToggle />

          {/* User Profile Badge */}
          <div className={`flex items-center gap-2.5 pl-2 border-l ${isLight ? "border-slate-200" : "border-slate-800"}`}>
            <UserAvatar name={userName} size="md" />
            <div className="hidden lg:flex flex-col min-w-0">
              <span className={`text-xs font-semibold truncate ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                {userName}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
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
                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
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
