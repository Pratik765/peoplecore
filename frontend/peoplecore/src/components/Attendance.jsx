import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  User,
  ShieldCheck,
  Calendar,
  LogIn,
  LogOut as LogOutIcon,
  Loader2,
  Timer,
  Check,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserX,
  AlertTriangle,
} from "lucide-react";

function Attendance() {
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const userRole = user?.user?.role || "EMPLOYEE";
  const isHR = userRole === "ADMIN" || userRole === "HR";
  const token = user?.token || localStorage.getItem("token") || "";

  // View Scope for HR: "my" or "all"
  const [viewScope, setViewScope] = useState("my");

  // Live time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  // Attendance state
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [hrStats, setHrStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination (10 rows per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      // 1. Fetch Today's Attendance for Logged in User
      const todayRes = await fetch("http://localhost:5007/attendance/today", {
        headers: { Authorization: authHeader },
      });
      if (todayRes.ok) {
        const todayData = await todayRes.json();
        setTodayRecord(todayData);
      }

      // 2. Fetch History based on scope
      const historyEndpoint =
        viewScope === "all" && isHR
          ? "http://localhost:5007/attendance/all"
          : "http://localhost:5007/attendance/my";

      const historyRes = await fetch(historyEndpoint, {
        headers: { Authorization: authHeader },
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (Array.isArray(historyData)) {
          setHistory(historyData);
        }
      }

      // 3. Fetch HR Stats if HR/Admin
      if (isHR) {
        const statsRes = await fetch("http://localhost:5007/attendance/stats", {
          headers: { Authorization: authHeader },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setHrStats(statsData);
        }
      }
    } catch (err) {
      console.log("Error loading attendance data:", err.message);
      setErrorMsg("Unable to connect to attendance service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, viewScope]);

  // Handle Check In
  const handleCheckIn = async () => {
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await fetch("http://localhost:5007/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Failed to check in.");
      }

      setSuccessMsg(res.message || "Checked in successfully!");
      setTodayRecord(res.attendance);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Check Out
  const handleCheckOut = async () => {
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await fetch("http://localhost:5007/attendance/checkout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Failed to check out.");
      }

      setSuccessMsg(res.message || "Checked out successfully!");
      setTodayRecord(res.attendance);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Records List
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Filter by Status
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "LATE" ? item.isLate : item.status === statusFilter);

      // Filter by Search Query (Name/Email/Date)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.employeeName?.toLowerCase().includes(query) ||
        item.employeeEmail?.toLowerCase().includes(query) ||
        item.date?.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [history, statusFilter, searchQuery]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, viewScope]);

  // Pagination Math
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredHistory.length);

  // Status Badge Helper
  const getStatusBadge = (record) => {
    if (record.isLate && record.status === "PRESENT") {
      return {
        label: "LATE ENTRY",
        color: isLight
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: AlertTriangle,
      };
    }
    switch (record.status) {
      case "PRESENT":
        return {
          label: "PRESENT",
          color: isLight
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "HALF_DAY":
        return {
          label: "HALF DAY",
          color: isLight
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-blue-500/10 text-blue-400 border-blue-500/30",
          icon: Timer,
        };
      default:
        return {
          label: "ABSENT",
          color: isLight
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-red-500/10 text-red-400 border-red-500/30",
          icon: XCircle,
        };
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

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
              <span>{isHR ? "Workforce Attendance Portal" : "Employee Attendance"}</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Clock className="w-7 h-7 text-indigo-600" />
              <span>{viewScope === "all" ? "Organization Attendance Log" : "My Attendance Dashboard"}</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {viewScope === "all"
                ? "Track real-time check-ins, late arrivals, and attendance history across all departments."
                : "Log your daily work hours, check in/out on arrival, and view your monthly attendance history."}
            </p>
          </div>

          {/* Live Ticker Clock & Scope Switcher */}
          <div className="flex flex-col items-end gap-3">
            <div
              className={`px-4 py-2 rounded-2xl border font-mono text-sm font-semibold flex items-center gap-2 backdrop-blur-md shadow-sm ${
                isLight
                  ? "bg-slate-100/90 border-slate-200 text-slate-800"
                  : "bg-slate-950/80 border-slate-800 text-indigo-300"
              }`}
            >
              <Timer className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>{currentTime.toLocaleTimeString()}</span>
              <span className="text-xs opacity-60 font-sans">
                ({currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})
              </span>
            </div>

            {/* Scope Switcher for HR/Admin */}
            {isHR && (
              <div
                className={`p-1 rounded-2xl border flex items-center gap-1 backdrop-blur-md ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950/80 border-slate-800"
                }`}
              >
                <button
                  onClick={() => setViewScope("my")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "my"
                      ? "bg-indigo-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Attendance</span>
                </button>
                <button
                  onClick={() => setViewScope("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "all"
                      ? "bg-indigo-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>All Employees</span>
                </button>
              </div>
            )}
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

      {/* Today's Check In / Check Out Card Container */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Today's Log:
              </span>
              <span className="text-xs font-mono font-bold text-indigo-500">
                {(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
              </span>
            </div>

            {/* Today's Action Display */}
            {todayRecord ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2
                    className={`text-xl sm:text-2xl font-bold ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Checked In at <span className="text-indigo-500">{todayRecord.checkIn}</span>
                  </h2>

                  {todayRecord.isLate && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Late Arrival
                    </span>
                  )}
                </div>

                {todayRecord.checkOut ? (
                  <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center md:justify-start gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Checked out at {todayRecord.checkOut} ({todayRecord.totalHours} hrs worked)
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Currently active. Don't forget to check out at the end of your shift.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  You haven't checked in today
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Click the button to record your official check-in timestamp for today.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!todayRecord ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 transition-all text-sm disabled:opacity-60"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                <span>Check In Now</span>
              </button>
            ) : !todayRecord.checkOut ? (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-600 hover:to-rose-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2.5 transition-all text-sm disabled:opacity-60"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOutIcon className="w-5 h-5" />
                )}
                <span>Check Out Now</span>
              </button>
            ) : (
              <div
                className={`px-5 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  isLight
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Shift Completed Today</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HR Analytics Cards (Visible when HR viewing all or HR stats available) */}
      {isHR && hrStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div
            className={`border rounded-2xl p-4 backdrop-blur-md shadow-lg flex items-center justify-between transition-colors ${
              isLight
                ? "bg-white/90 border-slate-200 shadow-slate-200/50"
                : "bg-slate-900/70 border-slate-800/80"
            }`}
          >
            <div>
              <div className="text-[11px] font-medium text-slate-400">Total Staff</div>
              <div
                className={`text-xl sm:text-2xl font-bold mt-1 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {hrStats.totalUsers}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-slate-800/40 border-slate-700 text-slate-300">
              <User className="w-4 h-4" />
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
              <div className="text-[11px] font-medium text-slate-400">Present Today</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-500 mt-1">
                {hrStats.present}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
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
              <div className="text-[11px] font-medium text-slate-400">Late Check-ins</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-500 mt-1">
                {hrStats.late}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
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
              <div className="text-[11px] font-medium text-slate-400">Half-Day</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-500 mt-1">
                {hrStats.halfDay}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-400">
              <Timer className="w-4 h-4" />
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
              <div className="text-[11px] font-medium text-slate-400">Absent Today</div>
              <div className="text-xl sm:text-2xl font-bold text-red-500 mt-1">
                {hrStats.absent}
              </div>
            </div>
            <div className="p-2.5 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* History Search & Filter Toolbar */}
      <div
        className={`border rounded-2xl p-4 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {["ALL", "PRESENT", "LATE", "HALF_DAY"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                statusFilter === status
                  ? isLight
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm"
                    : "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {status === "LATE" ? "LATE ONLY" : status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={viewScope === "all" ? "Search employee name, email or date..." : "Search by date..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
              isLight
                ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                : "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
            }`}
          />
        </div>
      </div>

      {/* Attendance History Table */}
      <div
        className={`border rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800/80"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Loading attendance history...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div
              className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-slate-500 ${
                isLight ? "bg-slate-100 border-slate-200" : "bg-slate-800 border-slate-700"
              }`}
            >
              <Clock className="w-6 h-6" />
            </div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              No attendance records found
            </h3>
            <p
              className={`text-xs max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              No records match your selected filter or search criteria.
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
                  <th className="py-4 px-6">Date</th>
                  {viewScope === "all" && <th className="py-4 px-6">Employee</th>}
                  <th className="py-4 px-6">Check In Time</th>
                  <th className="py-4 px-6">Check Out Time</th>
                  <th className="py-4 px-6">Total Hours</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs ${
                  isLight ? "divide-slate-200" : "divide-slate-800/60"
                }`}
              >
                {paginatedHistory.map((item, idx) => {
                  const badge = getStatusBadge(item);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr
                      key={item._id || idx}
                      className={`transition-colors group ${
                        isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Date */}
                      <td className="py-4 px-6 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{item.date}</span>
                        </div>
                      </td>

                      {/* Employee (for HR view) */}
                      {viewScope === "all" && (
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.employeeName || "Employee"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.employeeEmail || ""}
                          </div>
                        </td>
                      )}

                      {/* Check In */}
                      <td className="py-4 px-6 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {item.checkIn}
                      </td>

                      {/* Check Out */}
                      <td className="py-4 px-6 font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        {item.checkOut || <span className="text-slate-500 font-normal">Active Shift</span>}
                      </td>

                      {/* Total Hours */}
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">
                        {item.totalHours ? `${item.totalHours} hrs` : "--"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-4 px-6 text-right text-slate-400 font-medium">
                        {item.remarks || "On Time"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 10-Rows Pagination Footer */}
        {filteredHistory.length > 0 && (
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
                {filteredHistory.length}
              </strong>{" "}
              records
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

export default Attendance;
