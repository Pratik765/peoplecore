import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userAction } from "../store/userSlice";
import {
  Users,
  LayoutDashboard,
  UserCheck,
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
} from "lucide-react";

function Navbar() {
  const user = useSelector((store) => store.user);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    reduxDispatch(userAction.logout());
    navigate("/");
  };

  const userRole = user?.user?.role || "EMPLOYEE";
  const userName = user?.user?.name || "User";

  // Role Badge Styling
  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMIN",
          color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          icon: Shield,
        };
      case "HR":
        return {
          label: "HR MANAGER",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Briefcase,
        };
      default:
        return {
          label: "EMPLOYEE",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
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
      icon: Clock,
      roles: ["ADMIN", "HR"],
    },
    {
      label: "My Leaves",
      path: "/my-leaves",
      icon: Calendar,
      roles: ["EMPLOYEE"],
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: User,
      roles: ["EMPLOYEE", "HR", "ADMIN"],
    },
  ].filter((item) => item.roles.includes(userRole));

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-indigo-300 transition-colors">
                  PeopleCore
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1 mt-0.5">
                  HR Portal <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <ItemIcon
                    className={`w-4 h-4 ${
                      active ? "text-indigo-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${roleInfo.color}`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleInfo.label}</span>
            </div>

            {/* User Greeting & Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {userName}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all ml-1 group"
              title="Log out"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {/* User info in mobile */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-200">
                {userName}
              </span>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${roleInfo.color}`}
            >
              <RoleIcon className="w-3 h-3" />
              <span>{roleInfo.label}</span>
            </div>
          </div>

          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <ItemIcon className="w-4 h-4 text-indigo-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
