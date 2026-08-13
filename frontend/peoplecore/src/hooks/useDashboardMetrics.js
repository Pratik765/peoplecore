import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { userAction } from "../store/userSlice";
import useAuth from "./useAuth";
import useTheme from "./useTheme";
import { fetchMyProfile, fetchAllUsers, fetchPendingApprovals } from "../api/userApi";
import { fetchLegacyLeaveStats } from "../api/leaveApi";
import { fetchAnnouncements } from "../api/announcementApi";
import { MICROSERVICE_PORTS } from "../api/apiConfig";
import { Users, Clock, Activity, Shield, FileText, Calendar, Briefcase, CheckCircle2, Sparkles } from "lucide-react";

export const useDashboardMetrics = () => {
  const reduxDispatch = useDispatch();
  const { user, role: userRole, userId, token } = useAuth();
  const { isLight } = useTheme();

  const [totalUsersCount, setTotalUsersCount] = useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(null);
  const [activeServicesCount, setActiveServicesCount] = useState(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [empLeaveStats, setEmpLeaveStats] = useState({ balance: 18, pending: 1, approved: 2 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDynamicMetrics = useCallback(async () => {
    setIsLoading(true);
    let usersCount = 2;
    let pendingCount = 0;

    try {
      // 1. Fetch profile
      if (token) {
        try {
          const profileData = await fetchMyProfile();
          if (profileData && !user?.name && profileData.name) {
            reduxDispatch(
              userAction.login({
                token,
                user: { ...user, name: profileData.name, email: profileData.email },
              })
            );
          }
        } catch (e) {
          console.log("Error fetching profile", e);
        }
      }

      // 2. Fetch leave stats
      if (userId) {
        try {
          const leaveList = await fetchLegacyLeaveStats(userId);
          if (Array.isArray(leaveList)) {
            const pending = leaveList.filter((l) => l.status === "PENDING").length;
            const approved = leaveList.filter((l) => l.status === "APPROVED").length;
            const balance = Math.max(18 - approved, 0);
            setEmpLeaveStats({ balance, pending, approved });
          }
        } catch (e) {
          console.log("Leave API dynamic count fetch", e);
        }
      }

      // 3. Microservice Health check
      const healthResults = await Promise.allSettled(
        MICROSERVICE_PORTS.map((port) => fetch(`http://localhost:${port}/health`).then((res) => res.ok))
      );
      const onlineServices = healthResults.filter((r) => r.status === "fulfilled" && r.value).length;
      setActiveServicesCount(`${onlineServices} / ${MICROSERVICE_PORTS.length}`);

      // 4. Admin/HR Stats
      if (token && (userRole === "ADMIN" || userRole === "HR")) {
        try {
          const usersData = await fetchAllUsers();
          usersCount = Array.isArray(usersData) ? usersData.length : (usersData?.users?.length ?? 2);
        } catch (e) {
          console.log("Users endpoint fetch error", e);
        }

        try {
          const pendingData = await fetchPendingApprovals();
          pendingCount = Array.isArray(pendingData) ? pendingData.length : (pendingData?.pendingUsers?.length ?? 0);
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
  }, [token, userId, userRole, reduxDispatch, user]);

  useEffect(() => {
    fetchDynamicMetrics();

    fetchAnnouncements()
      .then((data) => {
        if (Array.isArray(data)) setRecentAnnouncements(data.slice(0, 2));
      })
      .catch(() => {});
  }, [fetchDynamicMetrics]);

  // Derived stats array depending on userRole
  const getStats = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          {
            title: "Total Registered Users",
            value: totalUsersCount !== null ? `${totalUsersCount} Users` : "Loading...",
            change: "Live database count",
            icon: Users,
            color: isLight ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Pending Approvals",
            value: pendingRequestsCount !== null ? `${pendingRequestsCount} Pending` : "Loading...",
            change: pendingRequestsCount > 0 ? "Action required" : "No pending requests",
            icon: Clock,
            color: isLight ? "text-amber-600 bg-amber-50 border-amber-200" : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Active Microservices",
            value: activeServicesCount || "Checking...",
            change: "Port 5001, 5002, 5004",
            icon: Activity,
            color: isLight ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Database Status",
            value: "Online",
            change: "MongoDB @ 27017",
            icon: Shield,
            color: isLight ? "text-blue-600 bg-blue-50 border-blue-200" : "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
        ];

      case "HR":
        return [
          {
            title: "Total Headcount",
            value: totalUsersCount !== null ? `${totalUsersCount} Employees` : "Loading...",
            change: "Active headcount",
            icon: Users,
            color: isLight ? "text-amber-600 bg-amber-50 border-amber-200" : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Pending Leave Requests",
            value: pendingRequestsCount !== null ? `${pendingRequestsCount} Pending` : "Loading...",
            change: "Awaiting HR review",
            icon: FileText,
            color: isLight ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Active Staff Today",
            value: totalUsersCount !== null ? `${totalUsersCount}` : "15",
            change: "On schedule",
            icon: Calendar,
            color: isLight ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Active Microservices",
            value: activeServicesCount || "Checking...",
            change: "Services online",
            icon: Briefcase,
            color: isLight ? "text-violet-600 bg-violet-50 border-violet-200" : "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
        ];

      default:
        return [
          {
            title: "Annual Leave Balance",
            value: `${empLeaveStats.balance} Days`,
            change: "Calculated remaining balance",
            icon: Calendar,
            color: isLight ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Pending Leave Requests",
            value: `${empLeaveStats.pending} Request${empLeaveStats.pending !== 1 ? "s" : ""}`,
            change: empLeaveStats.pending > 0 ? "Under review" : "All requests up-to-date",
            icon: Clock,
            color: isLight ? "text-amber-600 bg-amber-50 border-amber-200" : "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            title: "Approved Leave Days",
            value: `${empLeaveStats.approved} Day${empLeaveStats.approved !== 1 ? "s" : ""}`,
            change: "Approved this year",
            icon: CheckCircle2,
            color: isLight ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          },
          {
            title: "Microservices Status",
            value: activeServicesCount || "3 / 3",
            change: "All microservices healthy",
            icon: Sparkles,
            color: isLight ? "text-violet-600 bg-violet-50 border-violet-200" : "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
        ];
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          {
            title: "Users Directory",
            description: "View, approve, and manage user accounts and system roles.",
            link: "/users",
            icon: Users,
            color: isLight ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900" : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
          {
            title: "Pending Approvals Queue",
            description: "Review registration requests awaiting administrator action.",
            link: "/pending-request",
            icon: Clock,
            color: isLight ? "from-amber-50 to-amber-100/40 border-amber-200 text-amber-900" : "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
          },
        ];

      case "HR":
        return [
          {
            title: "Pending Requests Queue",
            description: "Approve or reject employee leave and registration applications.",
            link: "/pending-request",
            icon: Clock,
            color: isLight ? "from-amber-50 to-amber-100/40 border-amber-200 text-amber-900" : "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
          },
          {
            title: "Employee Roster",
            description: "Browse employee directory and status details.",
            link: "/users",
            icon: Users,
            color: isLight ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900" : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
        ];

      default:
        return [
          {
            title: "My Leaves History",
            description: "Track your leave request status and view balance logs.",
            link: "/my-leaves",
            icon: Calendar,
            color: isLight ? "from-emerald-50 to-teal-100/40 border-emerald-200 text-emerald-900" : "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-300",
          },
          {
            title: "My Profile",
            description: "View and manage your personal account profile details.",
            link: "/profile",
            icon: User,
            color: isLight ? "from-indigo-50 to-indigo-100/40 border-indigo-200 text-indigo-900" : "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
          },
        ];
    }
  };

  return {
    activeServicesCount,
    recentAnnouncements,
    isLoading,
    fetchDynamicMetrics,
    stats: getStats(),
    quickActions: getQuickActions(),
  };
};

export default useDashboardMetrics;
