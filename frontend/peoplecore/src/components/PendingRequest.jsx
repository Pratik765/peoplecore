import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Briefcase,
  UserCheck2,
  Mail,
  User,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  X,
  Inbox,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function PendingRequest() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination state (10 rows per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:5002/account-approval", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending registration requests.");
      }

      const res = await response.json();
      setPendingList(res);
    } catch (err) {
      setErrorMsg(err.message || "Error fetching pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPages = Math.ceil(pendingList.length / ITEMS_PER_PAGE) || 1;

  const paginatedPendingList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return pendingList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [pendingList, currentPage]);

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, pendingList.length);

  const handleRoleChange = (id, role) => {
    setPendingList((prev) =>
      prev.map((user) => (user._id === id ? { ...user, role } : user))
    );
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(
        `http://localhost:5002/approve-user/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ role: selectedUser.role || "EMPLOYEE" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve user.");
      }

      setSuccessMsg(`User ${selectedUser.name} has been approved successfully!`);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Approval failed.");
    } finally {
      setShowApproveModal(false);
      setSelectedUser(null);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(
        `http://localhost:5002/reject-user/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject user.");
      }

      setSuccessMsg(`Registration request for ${selectedUser.name} rejected.`);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Rejection failed.");
    } finally {
      setShowRejectModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Confirmation Modals */}
      <Modal
        show={showApproveModal}
        type="approve"
        title="Approve User Account"
        message={`Are you sure you want to approve registration for ${selectedUser?.name}? They will be granted system access as ${selectedUser?.role || "EMPLOYEE"}.`}
        confirmText="Approve Account"
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />

      <Modal
        show={showRejectModal}
        type="danger"
        title="Reject User Account"
        message={`Are you sure you want to reject registration request for ${selectedUser?.name}? They will not be able to log in.`}
        confirmText="Reject Application"
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />

      {/* Top Banner & Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Approvals Queue</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Clock className="w-7 h-7 text-amber-500" />
              <span>Pending Requests</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Review new registration applications, assign system access roles, and approve or decline account requests.
            </p>
          </div>

          <div
            className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-950/60 border-slate-800/80"
            }`}
          >
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-ping" />
            <div>
              <div
                className={`text-xs font-medium ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Awaiting Approval
              </div>
              <div className="text-amber-600 font-bold text-lg leading-tight">
                {pendingList.length} Requests
              </div>
            </div>
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

      {/* Pending Requests Table Container */}
      <div
        className={`border rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800/80"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-sm font-medium">Loading approval queue...</span>
          </div>
        ) : pendingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div
              className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-slate-500 ${
                isLight
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Inbox className="w-6 h-6 text-emerald-500" />
            </div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              Approval queue is empty
            </h3>
            <p
              className={`text-xs max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              There are no pending user registration applications awaiting approval.
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
                  <th className="py-4 px-6">Applicant Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Assign System Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isLight ? "divide-slate-200" : "divide-slate-800/60"
                }`}
              >
                {paginatedPendingList.map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    className={`transition-colors group ${
                      isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Applicant Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl border font-bold flex items-center justify-center text-xs shrink-0 transition-transform group-hover:scale-105 ${
                            isLight
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border-amber-500/30 text-amber-300"
                          }`}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div
                            className={`font-semibold transition-colors ${
                              isLight
                                ? "text-slate-900 group-hover:text-amber-700"
                                : "text-slate-100 group-hover:text-amber-300"
                            }`}
                          >
                            {user.name || "Registration Candidate"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Requested Role: {user.role || "EMPLOYEE"}
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

                    {/* Role Selection Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={user.role || "EMPLOYEE"}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className={`px-3 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                          isLight
                            ? "bg-slate-100 border-slate-200 text-slate-900"
                            : "bg-slate-950 border-slate-800 text-slate-100"
                        }`}
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="HR">HR MANAGER</option>
                        <option value="ADMIN">ADMINISTRATOR</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowApproveModal(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRejectModal(true);
                          }}
                          className={`px-3 py-1.5 border font-medium rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all ${
                            isLight
                              ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              : "bg-slate-950 text-red-400 border-slate-800 hover:bg-red-500/10 hover:border-red-500/30"
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 10-Rows Pagination Footer */}
        {pendingList.length > 0 && (
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
              <strong className="text-slate-900 dark:text-slate-200">{pendingList.length}</strong> requests
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
    </main>
  );
}

export default PendingRequest;
