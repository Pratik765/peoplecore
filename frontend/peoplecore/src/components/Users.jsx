import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import {
  Users as UsersIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Briefcase,
  UserCheck2,
  Sparkles,
  AlertCircle,
  Loader2,
  Mail,
  User,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Users() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const { state, error, loading } = useFetch("http://localhost:5002/users");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination state (10 rows per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const usersList = useMemo(() => {
    if (!state || !state.users) return [];
    return state.users;
  }, [state]);

  // Dynamic Metrics Calculation
  const metrics = useMemo(() => {
    const total = usersList.length;
    const active = usersList.filter((u) => u.isActive).length;
    const admins = usersList.filter((u) => u.role === "ADMIN").length;
    const pending = usersList.filter((u) => u.status === "PENDING").length;
    return { total, active, admins, pending };
  }, [usersList]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive) ||
        user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchTerm, roleFilter, statusFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);

  // Role Badge Helper
  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMIN",
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

  // Account Status Badge Helper
  const getStatusBadge = (status, isActive) => {
    if (!isActive) {
      return {
        label: "INACTIVE",
        color: isLight
          ? "bg-slate-100 text-slate-600 border-slate-300"
          : "bg-slate-500/10 text-slate-400 border-slate-500/30",
        icon: XCircle,
      };
    }
    switch (status) {
      case "ACCEPTED":
        return {
          label: "ACTIVE",
          color: isLight
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "PENDING":
        return {
          label: "PENDING",
          color: isLight
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "REJECTED",
          color: isLight
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-red-500/10 text-red-400 border-red-500/30",
          icon: XCircle,
        };
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
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
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <UsersIcon className="w-7 h-7 text-indigo-600" />
              <span>Users Directory</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Browse, filter, and manage all registered user accounts and system permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`border rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/70 border-slate-800/80"
          }`}
        >
          <div>
            <div
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Total Accounts
            </div>
            <div
              className={`text-2xl font-bold mt-1 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {metrics.total}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
            }`}
          >
            <UsersIcon className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`border rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/70 border-slate-800/80"
          }`}
        >
          <div>
            <div
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Active Users
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {metrics.active}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`border rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/70 border-slate-800/80"
          }`}
        >
          <div>
            <div
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Administrators
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {metrics.admins}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`border rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/70 border-slate-800/80"
          }`}
        >
          <div>
            <div
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Pending Review
            </div>
            <div className="text-2xl font-bold text-violet-600 mt-1">
              {metrics.pending}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-violet-50 border-violet-200 text-violet-600"
                : "bg-violet-500/10 border-violet-500/20 text-violet-400"
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div
        className={`border rounded-2xl p-4 backdrop-blur-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
              isLight
                ? "bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500"
                : "bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500"
            }`}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span
              className={`text-xs font-medium ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Filters:
            </span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              isLight
                ? "bg-slate-100 border-slate-200 text-slate-800"
                : "bg-slate-950 border-slate-800 text-slate-200"
            }`}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="HR">HR MANAGER</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              isLight
                ? "bg-slate-100 border-slate-200 text-slate-800"
                : "bg-slate-950 border-slate-800 text-slate-200"
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`border rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800/80"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-sm font-medium">Fetching directory users...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 px-4 text-red-500 gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div
              className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-slate-500 ${
                isLight
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <User className="w-6 h-6" />
            </div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              No matching users found
            </h3>
            <p
              className={`text-xs max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Try adjusting your search query or filter selection to view user records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                    isLight
                      ? "border-slate-200 bg-slate-100/60 text-slate-600"
                      : "border-slate-800/80 bg-slate-950/40 text-slate-400"
                  }`}
                >
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Account State</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isLight ? "divide-slate-200" : "divide-slate-800/60"
                }`}
              >
                {paginatedUsers.map((user, idx) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status, user.isActive);
                  const RoleIcon = roleBadge.icon;
                  const StatusIcon = statusBadge.icon;

                  return (
                    <tr
                      key={user._id || idx}
                      className={`transition-colors group ${
                        isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl border font-bold flex items-center justify-center text-xs shrink-0 transition-transform group-hover:scale-105 ${
                              isLight
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                : "bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-300"
                            }`}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div
                              className={`font-semibold transition-colors ${
                                isLight
                                  ? "text-slate-900 group-hover:text-indigo-600"
                                  : "text-slate-100 group-hover:text-indigo-300"
                              }`}
                            >
                              {user.name || "Unnamed User"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              ID: {user._id ? user._id.slice(-6) : `USR-${idx}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span
                            className={
                              isLight ? "text-slate-700" : "text-slate-300"
                            }
                          >
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleBadge.color}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{roleBadge.label}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusBadge.label}</span>
                        </div>
                      </td>

                      {/* State */}
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                          title={user.isActive ? "Online / Active" : "Offline / Disabled"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 10-Rows Pagination Footer */}
        {filteredUsers.length > 0 && (
          <div
            className={`p-4 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight
                ? "border-slate-200 bg-slate-50/80 text-slate-600"
                : "border-slate-800/80 bg-slate-950/40 text-slate-400"
            }`}
          >
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-200">{startRecord}</strong> to{" "}
              <strong className="text-slate-900 dark:text-slate-200">{endRecord}</strong> of{" "}
              <strong className="text-slate-900 dark:text-slate-200">{filteredUsers.length}</strong> entries
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isLight
                    ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === pageNum
                        ? isLight
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-indigo-600 text-white shadow-sm"
                        : isLight
                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isLight
                    ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Users;
