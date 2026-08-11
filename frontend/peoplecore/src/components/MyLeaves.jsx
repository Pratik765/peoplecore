import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
  FileText,
  Trash2,
  AlertCircle,
  Loader2,
  Check,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Filter,
} from "lucide-react";

function MyLeaves() {
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const userRole = user?.user?.role || "EMPLOYEE";
  const isHR = userRole === "ADMIN" || userRole === "HR";
  const token = user?.token || localStorage.getItem("token") || "";

  // View mode for HR/Admin: "my" or "all"
  const [viewScope, setViewScope] = useState("my");

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal & Form States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  // New Leave Form State
  const [leaveType, setLeaveType] = useState("Paid Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Action loading state for Approve/Reject
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination state (10 rows per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const endpoint =
        viewScope === "all" && isHR
          ? "http://localhost:5006/leaves/all"
          : "http://localhost:5006/leaves/my";

      const response = await fetch(endpoint, {
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        if (Array.isArray(res)) {
          setLeaves(res);
        }
      } else {
        const errData = await response.json();
        setErrorMsg(errData.message || "Failed to load leave records.");
      }
    } catch (err) {
      console.log("Error loading leaves:", err.message);
      setErrorMsg("Unable to connect to leave service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, viewScope]);

  // Calculate Leave Days duration helper
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays || 1;
  };

  // Submit New Leave Application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!startDate || !endDate || !remark) {
      setErrorMsg("Please fill in start date, end date, and reason.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5006/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveType,
          start_date: startDate,
          end_date: endDate,
          remark,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to submit leave application.");
      }

      setSuccessMsg("Leave application submitted successfully for review!");
      setShowApplyModal(false);
      setStartDate("");
      setEndDate("");
      setRemark("");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Error submitting leave application.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete / Cancel Leave Application
  const handleDelete = async (id) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await fetch(`http://localhost:5006/leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLeaves((prev) => prev.filter((l) => l._id !== id && l.lrid !== id));
        setSuccessMsg("Leave application canceled successfully.");
      } else {
        const res = await response.json();
        setErrorMsg(res.message || "Failed to cancel leave application.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with leave service.");
    }
  };

  // HR/Admin Approve Action
  const handleApprove = async (id) => {
    setActionLoadingId(id);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await fetch(`http://localhost:5006/leaves/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        setLeaves((prev) =>
          prev.map((l) => (l._id === id ? res.leave || { ...l, status: "APPROVED" } : l))
        );
        setSuccessMsg("Leave application approved successfully!");
      } else {
        const res = await response.json();
        setErrorMsg(res.message || "Failed to approve leave application.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with leave service.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // HR/Admin Reject Action
  const handleReject = async (id) => {
    setActionLoadingId(id);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await fetch(`http://localhost:5006/leaves/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        setLeaves((prev) =>
          prev.map((l) => (l._id === id ? res.leave || { ...l, status: "REJECTED" } : l))
        );
        setSuccessMsg("Leave application rejected.");
      } else {
        const res = await response.json();
        setErrorMsg(res.message || "Failed to reject leave application.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with leave service.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Dynamic Metrics
  const metrics = useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter((l) => l.status === "PENDING").length;
    const approved = leaves.filter((l) => l.status === "APPROVED").length;
    const balance = 18 - approved;
    return { total, pending, approved, balance: Math.max(balance, 0) };
  }, [leaves]);

  // Filtered list
  const filteredLeaves = useMemo(() => {
    if (statusFilter === "ALL") return leaves;
    return leaves.filter((l) => l.status === statusFilter);
  }, [leaves, statusFilter]);

  // Reset to page 1 whenever filters or scope changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, viewScope]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE) || 1;

  const paginatedLeaves = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeaves.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeaves, currentPage]);

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredLeaves.length);

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "APPROVED",
          color: isLight
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "REJECTED":
        return {
          label: "REJECTED",
          color: isLight
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-red-500/10 text-red-400 border-red-500/30",
          icon: XCircle,
        };
      default:
        return {
          label: "PENDING",
          color: isLight
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Clock,
        };
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        type="danger"
        title="Cancel Leave Application"
        message="Are you sure you want to cancel this leave application? This action cannot be undone."
        confirmText="Cancel Application"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (selectedLeaveId) {
            handleDelete(selectedLeaveId);
          }
          setShowDeleteModal(false);
        }}
      />

      {/* Top Banner & Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHR ? "Leave Management Portal" : "Employee Portal"}</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Calendar className="w-7 h-7 text-emerald-600" />
              <span>{viewScope === "all" ? "All Employee Leave Requests" : "My Leaves Management"}</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {viewScope === "all"
                ? "Review, approve, or decline leave applications submitted across your organization."
                : "Track your leave balances, review submitted leave applications, and request time off."}
            </p>
          </div>

          {/* Scope Switcher for HR/Admin + Apply Leave CTA */}
          <div className="flex flex-wrap items-center gap-3">
            {isHR && (
              <div
                className={`p-1 rounded-2xl border flex items-center gap-1 backdrop-blur-md ${
                  isLight
                    ? "bg-slate-100 border-slate-200"
                    : "bg-slate-950/80 border-slate-800"
                }`}
              >
                <button
                  onClick={() => setViewScope("my")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "my"
                      ? "bg-emerald-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Leaves</span>
                </button>
                <button
                  onClick={() => setViewScope("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "all"
                      ? "bg-emerald-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>All Requests</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowApplyModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leave Balance Metrics Bar */}
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
              {viewScope === "all" ? "Approved Total" : "Leave Balance"}
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {viewScope === "all" ? `${metrics.approved} Apps` : `${metrics.balance} Days`}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <Calendar className="w-5 h-5" />
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
              Pending Requests
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {metrics.pending}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            <Clock className="w-5 h-5" />
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
              Approved Leaves
            </div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {metrics.approved}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
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
              Total Applications
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
                ? "bg-slate-100 border-slate-200 text-slate-700"
                : "bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        className={`border rounded-2xl p-3 backdrop-blur-xl shadow-lg flex items-center justify-between gap-4 transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2">
          {["ALL", "APPROVED", "PENDING", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? isLight
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                    : "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Applications Table Container */}
      <div
        className={`border rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800/80"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-sm font-medium">Loading leave records from database...</span>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div
              className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-slate-500 ${
                isLight
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Calendar className="w-6 h-6" />
            </div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              No leave applications found
            </h3>
            <p
              className={`text-xs max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              No leave applications match the selected criteria.
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
                  <th className="py-4 px-6">Leave Category</th>
                  {viewScope === "all" && <th className="py-4 px-6">Applicant</th>}
                  <th className="py-4 px-6">Date Duration</th>
                  <th className="py-4 px-6">Reason / Remark</th>
                  <th className="py-4 px-6">Applied On</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isLight ? "divide-slate-200" : "divide-slate-800/60"
                }`}
              >
                {paginatedLeaves.map((l, i) => {
                  const statusBadge = getStatusBadge(l.status || "PENDING");
                  const StatusIcon = statusBadge.icon;
                  const totalDays = l.totalDays || calculateDays(l.start_date, l.end_date);
                  const isActioning = actionLoadingId === l._id;

                  return (
                    <tr
                      key={l._id || l.lrid || i}
                      className={`transition-colors group ${
                        isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Leave Category */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl border font-bold flex items-center justify-center text-xs shrink-0 transition-transform group-hover:scale-105 ${
                              isLight
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div
                              className={`font-semibold transition-colors ${
                                isLight
                                  ? "text-slate-900 group-hover:text-emerald-700"
                                  : "text-slate-100 group-hover:text-emerald-300"
                              }`}
                            >
                              {l.leaveType || l.leaveType?.type || "Leave Application"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              ID: {l.lrid || `LR-${i + 1}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Applicant (in ALL requests mode) */}
                      {viewScope === "all" && (
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {l.employeeName || "Employee"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {l.employeeEmail || ""}
                          </div>
                        </td>
                      )}

                      {/* Date Duration */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div
                            className={`font-mono text-xs flex items-center gap-1.5 ${
                              isLight ? "text-slate-800" : "text-slate-200"
                            }`}
                          >
                            <span>{l.start_date}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span>{l.end_date}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {totalDays} Day{totalDays > 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>

                      {/* Remark */}
                      <td className="py-4 px-6 max-w-xs">
                        <span
                          className={`truncate block ${
                            isLight ? "text-slate-700" : "text-slate-300"
                          }`}
                        >
                          {l.remark || "No remarks provided"}
                        </span>
                      </td>

                      {/* Applied On */}
                      <td className="py-4 px-6 text-slate-400 font-mono">
                        {l.applied_at || "N/A"}
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

                      {/* Operations */}
                      <td className="py-4 px-6 text-right">
                        {viewScope === "all" && isHR && l.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isActioning}
                              onClick={() => handleApprove(l._id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                            >
                              {isActioning ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              disabled={isActioning}
                              onClick={() => handleReject(l._id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                            >
                              {isActioning ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <X className="w-3.5 h-3.5" />
                              )}
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLeaveId(l._id || l.lrid);
                              setShowDeleteModal(true);
                            }}
                            className={`px-3 py-1.5 border font-medium rounded-xl text-xs flex items-center gap-1.5 transition-all inline-flex ml-auto active:scale-95 ${
                              isLight
                                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                : "bg-slate-950 text-red-400 border-slate-800 hover:bg-red-500/10 hover:border-red-500/30"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 10-Rows Pagination Footer */}
        {filteredLeaves.length > 0 && (
          <div
            className={`p-4 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight
                ? "border-slate-200 bg-slate-50/80 text-slate-600"
                : "border-slate-800/80 bg-slate-950/40 text-slate-400"
            }`}
          >
            <span>
              Showing{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                {startRecord}
              </strong>{" "}
              to{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                {endRecord}
              </strong>{" "}
              of{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>
                {filteredLeaves.length}
              </strong>{" "}
              applications
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

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white shadow-sm"
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

      {/* Apply Leave Form Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            onClick={() => setShowApplyModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          <div
            className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto border rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-slate-900 border-slate-800 text-white"
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <div
              className={`flex items-center justify-between border-b pb-4 ${
                isLight ? "border-slate-200" : "border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isLight
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold tracking-tight ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Apply for Time Off
                  </h3>
                  <p
                    className={`text-xs ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Submit your leave details for manager review.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className={`p-1 rounded-lg ${
                  isLight ? "text-slate-400 hover:text-slate-800" : "text-slate-400 hover:text-white"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              {/* Leave Type Select */}
              <div className="space-y-1.5">
                <label
                  className={`block text-xs font-medium ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Leave Category
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                >
                  <option value="Paid Annual Leave">Paid Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className={`block text-xs font-medium ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-900"
                        : "bg-slate-950 border-slate-800 text-slate-100"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`block text-xs font-medium ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-900"
                        : "bg-slate-950 border-slate-800 text-slate-100"
                    }`}
                  />
                </div>
              </div>

              {/* Reason / Remark */}
              <div className="space-y-1.5">
                <label
                  className={`block text-xs font-medium ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Reason for Time Off
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a brief explanation..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-end gap-3 ${
                  isLight ? "border-slate-200" : "border-slate-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium ${
                    isLight
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyLeaves;
