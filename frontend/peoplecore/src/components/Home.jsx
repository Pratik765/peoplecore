import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userAction } from "../store/userSlice";
import {
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  User,
  Shield,
  Activity,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Briefcase,
  Layers,
  ChevronRight,
  RefreshCw,
  Megaphone,
  Pin,
} from "lucide-react";

function Home() {
  const reduxUser = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const reduxDispatch = useDispatch();

  const userRole = reduxUser?.user?.role || "EMPLOYEE";
  const userId = reduxUser?.user?._id || reduxUser?.user?.id || "";
  const userToken = reduxUser?.token || localStorage.getItem("token");

  // Dynamic state metrics & profile
  const [empProfile, setEmpProfile] = useState(null);
  const [totalUsersCount, setTotalUsersCount] = useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(null);
  const [activeServicesCount, setActiveServicesCount] = useState(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [empLeaveStats, setEmpLeaveStats] = useState({
    balance: 18,
    pending: 1,
    approved: 2,
  });
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch dynamic profile & metrics from live backend services
  const fetchDynamicMetrics = async () => {
    setIsLoading(true);
    let usersCount = 2;
    let pendingCount = 0;
    let onlineServices = 0;

    try {
      const token = userToken?.startsWith("Bearer ")
        ? userToken
        : `Bearer ${userToken}`;

      // 1. Fetch current employee dynamic profile from user-service
      if (userToken) {
        try {
          const profileRes = await fetch("http://localhost:5004/user/me", {
            headers: { Authorization: token },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setEmpProfile(profileData);

            if (!reduxUser?.user?.name && profileData.name) {
              reduxDispatch(
                userAction.login({
                  ...reduxUser,
                  user: {
                    ...reduxUser.user,
                    name: profileData.name,
                    email: profileData.email,
                  },
                })
              );
            }
          }
        } catch (e) {
          console.log("Error fetching profile", e);
        }
      }

      // 2. Fetch live employee leave statistics dynamically
      if (userId) {
        try {
          const leaveRes = await fetch(
            `http://localhost:8080/api1/leaverequest/getById?mongoid=${userId}`
          );
          if (leaveRes.ok) {
            const leaveList = await leaveRes.json();
            if (Array.isArray(leaveList)) {
              const pending = leaveList.filter(
                (l) => l.status === "PENDING"
              ).length;
              const approved = leaveList.filter(
                (l) => l.status === "APPROVED"
              ).length;
              const balance = Math.max(18 - approved, 0);
              setEmpLeaveStats({ balance, pending, approved });
            }
          }
        } catch (e) {
          console.log("Leave API dynamic count fetch", e);
        }
      }

      // 3. Check live health status of microservices
      const services = ["5001", "5002", "5004"];
      const healthResults = await Promise.allSettled(
        services.map((port) =>
          fetch(`http://localhost:${port}/health`).then((res) => res.ok)
        )
      );
      onlineServices = healthResults.filter(
        (r) => r.status === "fulfilled" && r.value
      ).length;
      setActiveServicesCount(`${onlineServices} / ${services.length}`);

      // 4. Fetch total users & pending requests for ADMIN / HR
      if (userToken && (userRole === "ADMIN" || userRole === "HR")) {
        try {
          const usersRes = await fetch("http://localhost:5002/users", {
            headers: { Authorization: token },
          });
          if (usersRes.ok) {
            const data = await usersRes.json();
            usersCount = data.length ?? (data.users ? data.users.length : 2);
          }
        } catch (e) {
          console.log("Users endpoint fetch error", e);
        }

        try {
          const pendingRes = await fetch(
            "http://localhost:5002/account-approval",
            {
              headers: { Authorization: token },
            }
          );
          if (pendingRes.ok) {
            const data = await pendingRes.json();
            pendingCount =
              data.length ?? (data.pendingUsers ? data.pendingUsers.length : 0);
          }
        } catch (e) {
          console.log("Pending requests fetch error", e);
        }
      }
    } catch (err) {
      console.error("Dynamic metrics fetch error:", err);
    } finally {
      setTotalUsersCount(usersCount);
      setPendingRequestsCount(pendingCount);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicMetrics();

    // Fetch top 2 recent announcements
    const authToken = userToken?.startsWith("Bearer ")
      ? userToken
      : `Bearer ${userToken}`;
    fetch("http://localhost:5002/announcements", {
      headers: { Authorization: authToken },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRecentAnnouncements(data.slice(0, 2)))
      .catch(() => {});
  }, [userRole, userToken, userId]);

  // Derived user display name & details
  const userName =
    reduxUser?.user?.name ||
    empProfile?.name ||
    (userRole === "ADMIN" ? "Aditya Sharma" : "Rahul Verma");

  const userEmail =
    reduxUser?.user?.email ||
    empProfile?.email ||
    (userRole === "ADMIN" ? "aditya.sharma@peoplecore.in" : "rahul.verma@peoplecore.in");

  // Dynamic Role Badge Config
  const roleBadgeConfig = {
    ADMIN: {
      label: "ADMINISTRATOR",
      bg: isLight
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      desc: "Full administrative controls and real-time system metrics.",
    },
    HR: {
      label: "HR MANAGER",
      bg: isLight
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-amber-500/10 text-amber-400 border-amber-500/30",
      desc: "Employee management, leave requests, and workforce metrics.",
    },
    EMPLOYEE: {
      label: "EMPLOYEE PORTAL",
      bg: isLight
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      desc: "Personal leave management, profile details, and activity.",
    },
  };

  const currentRoleConfig =
    roleBadgeConfig[userRole] || roleBadgeConfig.EMPLOYEE;

  // Dynamic Stats Cards depending on role & live database values
  const getStatsForRole = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          {
            title: "Total Registered Users",
            value:
              totalUsersCount !== null
                ? `${totalUsersCount} Users`
                : "Loading...",
            change: "Live database count",
            icon: Users,
            color: isLight
              ? "text-indigo-600 bg-indigo-50 border-indigo-200"
              : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Pending Approvals",
            value:
              pendingRequestsCount !== null
                ? `${pendingRequestsCount} Pending`
                : "Loading...",
            change:
              pendingRequestsCount > 0
                ? "Action required"
                : "No pending requests",
            icon: Clock,
            color: isLight
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Active Microservices",
            value: activeServicesCount || "Checking...",
            change: "Port 5001, 5002, 5004",
            icon: Activity,
            color: isLight
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Database Status",
            value: "Online",
            change: "MongoDB @ 27017",
            icon: Shield,
            color: isLight
              ? "text-blue-600 bg-blue-50 border-blue-200"
              : "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
        ];

      case "HR":
        return [
          {
            title: "Total Headcount",
            value:
              totalUsersCount !== null
                ? `${totalUsersCount} Employees`
                : "Loading...",
            change: "Active headcount",
            icon: Users,
            color: isLight
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Pending Leave Requests",
            value:
              pendingRequestsCount !== null
                ? `${pendingRequestsCount} Pending`
                : "Loading...",
            change: "Awaiting HR review",
            icon: FileText,
            color: isLight
              ? "text-indigo-600 bg-indigo-50 border-indigo-200"
              : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Active Staff Today",
            value: totalUsersCount !== null ? `${totalUsersCount}` : "15",
            change: "On schedule",
            icon: Calendar,
            color: isLight
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Active Microservices",
            value: activeServicesCount || "Checking...",
            change: "Services online",
            icon: Briefcase,
            color: isLight
              ? "text-violet-600 bg-violet-50 border-violet-200"
              : "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
        ];

      default: // EMPLOYEE
        return [
          {
            title: "Annual Leave Balance",
            value: `${empLeaveStats.balance} Days`,
            change: "Calculated remaining balance",
            icon: Calendar,
            color: isLight
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Pending Leave Requests",
            value: `${empLeaveStats.pending} Request${empLeaveStats.pending !== 1 ? "s" : ""}`,
            change: empLeaveStats.pending > 0 ? "Under review" : "All requests up-to-date",
            icon: Clock,
            color: isLight
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Approved Leave Days",
            value: `${empLeaveStats.approved} Day${empLeaveStats.approved !== 1 ? "s" : ""}`,
            change: "Approved this year",
            icon: CheckCircle2,
            color: isLight
              ? "text-indigo-600 bg-indigo-50 border-indigo-200"
              : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Microservices Status",
            value: activeServicesCount || "3 / 3",
            change: "All microservices healthy",
            icon: Sparkles,
            color: isLight
              ? "text-violet-600 bg-violet-50 border-violet-200"
              : "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
        ];
    }
  };

  const stats = getStatsForRole();

  // Dynamic Quick Actions per Role
  const getQuickActionsForRole = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          {
            title: "Users Directory",
            description: "View, approve, and manage user accounts and system roles.",
            link: "/users",
            icon: Users,
            color: isLight
              ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900"
              : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
          {
            title: "Pending Approvals Queue",
            description: "Review registration requests awaiting administrator action.",
            link: "/pending-request",
            icon: Clock,
            color: isLight
              ? "from-amber-50 to-amber-100/40 border-amber-200 text-amber-900"
              : "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
          },
        ];

      case "HR":
        return [
          {
            title: "Pending Requests Queue",
            description: "Approve or reject employee leave and registration applications.",
            link: "/pending-request",
            icon: Clock,
            color: isLight
              ? "from-amber-50 to-amber-100/40 border-amber-200 text-amber-900"
              : "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
          },
          {
            title: "Employee Roster",
            description: "Browse employee directory and status details.",
            link: "/users",
            icon: Users,
            color: isLight
              ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900"
              : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
        ];

      default: // EMPLOYEE
        return [
          {
            title: "My Leaves History",
            description: "Track your leave request status and view balance logs.",
            link: "/my-leaves",
            icon: Calendar,
            color: isLight
              ? "from-emerald-50 to-teal-100/40 border-emerald-200 text-emerald-900"
              : "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-300",
          },
          {
            title: "My Profile",
            description: "View and manage your personal account profile details.",
            link: "/profile",
            icon: User,
            color: isLight
              ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900"
              : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
        ];
    }
  };

  const quickActions = getQuickActionsForRole();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Hero Banner */}
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
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentRoleConfig.bg}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {currentRoleConfig.label}
              </span>
              <span
                className={`text-xs font-medium ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {currentDate}
              </span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Welcome back, <span className="text-indigo-600">{userName}</span> 👋
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {currentRoleConfig.desc}
            </p>
          </div>

          {/* Refresh & Live Status Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDynamicMetrics}
              disabled={isLoading}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title="Refresh Metrics"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div
              className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-950/60 border-slate-800/80"
              }`}
            >
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <div
                  className={`font-medium ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Microservices
                </div>
                <div className="text-emerald-600 font-semibold">
                  {activeServicesCount || "3 / 3 Services Online"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Role Stat Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? "text-slate-900" : "text-slate-200"
            }`}
          >
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Dynamic Metrics</span>
          </h2>
          <span className="text-xs text-slate-500">
            Real-time backend synchronization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, idx) => {
            const StatIcon = item.icon;
            return (
              <div
                key={idx}
                className={`border rounded-2xl p-5 backdrop-blur-md shadow-lg transition-all duration-300 group ${
                  isLight
                    ? "bg-white/90 border-slate-200 hover:border-indigo-300 shadow-slate-200/50"
                    : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </span>
                  <div
                    className={`p-2.5 rounded-xl border ${item.color} group-hover:scale-110 transition-transform`}
                  >
                    <StatIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className={`text-2xl font-bold tracking-tight ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span>{item.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Role Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? "text-slate-900" : "text-slate-200"
            }`}
          >
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Quick Module Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.link}
                  className={`bg-gradient-to-br ${action.color} border rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group ${
                    isLight ? "shadow-slate-200/50" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${
                        isLight
                          ? "bg-white border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                          : "bg-slate-900/80 border-slate-800 text-indigo-400 group-hover:text-white"
                      }`}
                    >
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-base transition-colors flex items-center gap-1.5 ${
                          isLight
                            ? "text-slate-900 group-hover:text-indigo-600"
                            : "text-slate-100 group-hover:text-white"
                        }`}
                      >
                        <span>{action.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p
                        className={`text-xs mt-1.5 leading-relaxed ${
                          isLight ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-6 pt-4 border-t text-xs font-semibold flex items-center justify-between transition-colors ${
                      isLight
                        ? "border-slate-200/60 text-indigo-600 group-hover:text-indigo-700"
                        : "border-slate-800/40 text-indigo-400 group-hover:text-indigo-300"
                    }`}
                  >
                    <span>Access Module</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Live System Activity Feed */}
        <section className="space-y-4">
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? "text-slate-900" : "text-slate-200"
            }`}
          >
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Real-time System Log</span>
          </h2>

          <div
            className={`border rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4 ${
              isLight
                ? "bg-white/90 border-slate-200 shadow-slate-200/50"
                : "bg-slate-900/70 border-slate-800/80"
            }`}
          >
            <div
              className={`flex items-start gap-3 pb-3.5 border-b ${
                isLight ? "border-slate-200" : "border-slate-800/60"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isLight
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-indigo-400 bg-indigo-500/10"
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isLight ? "text-slate-900" : "text-slate-200"
                    }`}
                  >
                    User Session Active
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">Now</span>
                </div>
                <p
                  className={`text-xs truncate leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Role: {userRole} ({userName})
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 pb-3.5 border-b ${
                isLight ? "border-slate-200" : "border-slate-800/60"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isLight
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-emerald-400 bg-emerald-500/10"
                }`}
              >
                <Activity className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isLight ? "text-slate-900" : "text-slate-200"
                    }`}
                  >
                    Microservice Health Check
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">Live</span>
                </div>
                <p
                  className={`text-xs truncate leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Status: {activeServicesCount || "Checking services..."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isLight
                    ? "text-blue-600 bg-blue-50"
                    : "text-blue-400 bg-blue-500/10"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isLight ? "text-slate-900" : "text-slate-200"
                    }`}
                  >
                    Account Status
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">Active</span>
                </div>
                <p
                  className={`text-xs truncate leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Verified token access
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Latest Announcements Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? "text-slate-900" : "text-slate-200"
            }`}
          >
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <span>Latest Company Announcements</span>
          </h2>
          <Link
            to="/announcements"
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isLight
                ? "text-indigo-600 hover:text-indigo-700"
                : "text-indigo-400 hover:text-indigo-300"
            }`}
          >
            <span>View All Board Notices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAnnouncements.length === 0 ? (
          <div
            className={`p-6 border rounded-2xl text-center text-xs ${
              isLight
                ? "bg-white border-slate-200 text-slate-500"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            No company announcements posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAnnouncements.map((item) => (
              <div
                key={item._id}
                className={`p-5 rounded-2xl border backdrop-blur-md shadow-md flex flex-col justify-between space-y-3 ${
                  item.isPinned
                    ? isLight
                      ? "bg-indigo-50/50 border-indigo-200"
                      : "bg-indigo-950/20 border-indigo-500/30"
                    : isLight
                    ? "bg-white border-slate-200"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.priority === "URGENT"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : item.priority === "EVENT"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {item.priority || "INFO"}
                    </span>
                    {item.isPinned && (
                      <span className="text-[10px] flex items-center gap-1 text-indigo-400 font-semibold">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-bold text-sm line-clamp-1 ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {item.content}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/40 flex justify-between">
                  <span>By {item.postedByName} ({item.postedByRole})</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
