import React, { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import usePagination from "../hooks/usePagination";
import useTheme from "../hooks/useTheme";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatCard from "../components/ui/StatCard";
import SearchBar from "../components/ui/SearchBar";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import Pagination from "../components/ui/Pagination";
import Badge from "../components/ui/Badge";
import RoleBadge from "../components/common/RoleBadge";
import UserAvatar from "../components/common/UserAvatar";
import { API_BASE_URLS } from "../api/apiConfig";
import { Users as UsersIcon, Shield, Clock, CheckCircle2, Mail, Layers } from "lucide-react";

export function UsersPage() {
  const { isLight } = useTheme();
  const { state, loading } = useFetch(`${API_BASE_URLS.ADMIN}/users`);


  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const usersList = useMemo(() => {
    return state?.users || (Array.isArray(state) ? state : []);
  }, [state]);

  const metrics = useMemo(() => {
    const total = usersList.length;
    const active = usersList.filter((u) => u.isActive || u.status === "APPROVED").length;
    const admins = usersList.filter((u) => u.role === "ADMIN").length;
    const pending = usersList.filter((u) => u.status === "PENDING").length;
    return { total, active, admins, pending };
  }, [usersList]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && (user.isActive || user.status === "APPROVED")) ||
        (statusFilter === "PENDING" && user.status === "PENDING");

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchTerm, roleFilter, statusFilter]);

  const pagination = usePagination(filteredUsers, 10);

  return (
    <PageLayout>
      <PageHeader
        badgeText="User Management Directory"
        badgeIcon={UsersIcon}
        title="Organization Users &"
        highlightTitle="Access Roles"
        description="Browse company employee directory, view assigned access roles, and monitor account status."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Accounts" value={`${metrics.total} Users`} icon={UsersIcon} color="text-indigo-400 bg-indigo-500/10 border-indigo-500/20" />
        <StatCard title="Active Employees" value={`${metrics.active} Active`} icon={CheckCircle2} color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20" />
        <StatCard title="Administrators" value={`${metrics.admins} Admins`} icon={Shield} color="text-violet-400 bg-violet-500/10 border-violet-500/20" />
        <StatCard title="Pending Approvals" value={`${metrics.pending} Pending`} icon={Clock} color="text-amber-400 bg-amber-500/10 border-amber-500/20" />
      </div>

      {/* Directory Table Section */}
      <div className="space-y-4">
        <SectionHeader
          icon={Layers}
          title="Employee Directory"
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <FilterBar filters={["ALL", "ADMIN", "HR", "EMPLOYEE"]} activeFilter={roleFilter} onSelectFilter={setRoleFilter} />
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search user..." />
            </div>
          }
        />

        <DataTable headers={["User Profile", "Email Address", "Access Role", "Account Status"]} loading={loading} empty={filteredUsers.length === 0} emptyMessage="No users found matching search filters.">
          {pagination.paginatedItems.map((u, idx) => (
            <tr key={u._id || idx} className={`hover:bg-slate-800/30 transition-colors ${isLight ? "border-slate-200" : "border-slate-800/50"}`}>
              <td className="py-3.5 px-4 font-semibold flex items-center gap-3">
                <UserAvatar name={u.name || "User"} size="sm" />
                <span>{u.name || "N/A"}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{u.email}</span>
              </td>
              <td className="py-3.5 px-4">
                <RoleBadge role={u.role || "EMPLOYEE"} />
              </td>
              <td className="py-3.5 px-4">
                <Badge variant={u.status === "PENDING" ? "amber" : u.isActive || u.status === "APPROVED" ? "emerald" : "red"}>
                  {u.status || (u.isActive ? "ACTIVE" : "INACTIVE")}
                </Badge>
              </td>
            </tr>
          ))}
        </DataTable>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onNext={pagination.goToNext}
          onPrev={pagination.goToPrev}
          totalItems={pagination.totalItems}
        />
      </div>
    </PageLayout>
  );
}

export default UsersPage;
