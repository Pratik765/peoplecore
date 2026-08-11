import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notificationAction } from "../store/notificationSlice";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Shield,
  Megaphone,
  Zap,
  Sparkles,
  Trash2,
  Check,
  Inbox,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";

const NOTIFICATION_API = "http://localhost:5005";

// Map notification type to icon & color
const getTypeConfig = (type, isLight) => {
  switch (type) {
    case "ACCOUNT_APPROVED":
      return {
        icon: CheckCircle2,
        label: "Account Approved",
        color: isLight
          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
          : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      };
    case "ACCOUNT_REJECTED":
      return {
        icon: XCircle,
        label: "Account Rejected",
        color: isLight
          ? "text-red-600 bg-red-50 border-red-200"
          : "text-red-400 bg-red-500/10 border-red-500/20",
      };
    case "LEAVE_APPROVED":
      return {
        icon: CheckCircle2,
        label: "Leave Approved",
        color: isLight
          ? "text-indigo-600 bg-indigo-50 border-indigo-200"
          : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      };
    case "LEAVE_REJECTED":
      return {
        icon: XCircle,
        label: "Leave Rejected",
        color: isLight
          ? "text-amber-600 bg-amber-50 border-amber-200"
          : "text-amber-400 bg-amber-500/10 border-amber-500/20",
      };
    case "LEAVE_APPLIED":
      return {
        icon: CalendarPlus,
        label: "Leave Applied",
        color: isLight
          ? "text-teal-600 bg-teal-50 border-teal-200"
          : "text-teal-400 bg-teal-500/10 border-teal-500/20",
      };
    case "ANNOUNCEMENT":
      return {
        icon: Megaphone,
        label: "Announcement",
        color: isLight
          ? "text-violet-600 bg-violet-50 border-violet-200"
          : "text-violet-400 bg-violet-500/10 border-violet-500/20",
      };
    default:
      return {
        icon: Zap,
        label: "System",
        color: isLight
          ? "text-blue-600 bg-blue-50 border-blue-200"
          : "text-blue-400 bg-blue-500/10 border-blue-500/20",
      };
  }
};

// Time ago helper
const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function Notifications() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";
  const user = useSelector((store) => store.user);
  const { notifications, unreadCount } = useSelector(
    (store) => store.notification
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "unread" | "read"
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const token = user?.token || localStorage.getItem("token");
  const authToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${NOTIFICATION_API}/notifications`, {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(notificationAction.setNotifications(data));
        const unread = data.filter((n) => !n.isRead).length;
        dispatch(notificationAction.setUnreadCount(unread));
      }
    } catch (err) {
      console.log("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread")
      return notifications.filter((n) => !n.isRead);
    if (activeFilter === "read") return notifications.filter((n) => n.isRead);
    return notifications;
  }, [notifications, activeFilter]);

  // Pagination
  const totalPages =
    Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);
  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredNotifications.length
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Mark single as read
  const handleMarkRead = async (id) => {
    try {
      await fetch(`${NOTIFICATION_API}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: authToken },
      });
      dispatch(notificationAction.markAsRead(id));
    } catch (err) {
      console.log("Failed to mark as read");
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await fetch(`${NOTIFICATION_API}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: authToken },
      });
      dispatch(notificationAction.markAllRead());
    } catch (err) {
      console.log("Failed to mark all read");
    }
  };

  // Delete single
  const handleDelete = async (id) => {
    try {
      await fetch(`${NOTIFICATION_API}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: authToken },
      });
      dispatch(notificationAction.removeNotification(id));
    } catch (err) {
      console.log("Failed to delete notification");
    }
  };

  // Clear all
  const handleClearAll = async () => {
    try {
      await fetch(`${NOTIFICATION_API}/notifications/clear-all`, {
        method: "DELETE",
        headers: { Authorization: authToken },
      });
      dispatch(notificationAction.clearAll());
    } catch (err) {
      console.log("Failed to clear all notifications");
    }
  };

  // Simulate / Trigger Test Notification
  const handleSimulateNotification = async () => {
    const userId = user?.user?._id || user?.user?.id;
    if (!userId) return;

    const sampleNotifications = [
      {
        type: "LEAVE_APPROVED",
        title: "Leave Request Approved 🌴",
        message: "Your leave application for Aug 24 - Aug 26 has been reviewed and approved by HR.",
      },
      {
        type: "ACCOUNT_APPROVED",
        title: "System Access Updated 🎉",
        message: "Your account permissions have been synchronized with system roles.",
      },
      {
        type: "ANNOUNCEMENT",
        title: "📢 Quarterly All-Hands Meeting",
        message: "Join the team this Friday at 4 PM for the Q3 town hall and milestone updates.",
      },
      {
        type: "SYSTEM",
        title: "🛡️ Security Check Passed",
        message: "Your session token was successfully verified from localhost.",
      },
    ];

    const chosen = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];

    try {
      const res = await fetch(`${NOTIFICATION_API}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          userId,
          type: chosen.type,
          title: chosen.title,
          message: chosen.message,
          metadata: { simulatedAt: new Date() },
        }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.log("Failed to simulate notification:", err);
    }
  };

  const filterTabs = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      key: "read",
      label: "Read",
      count: notifications.filter((n) => n.isRead).length,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
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
              <span>Activity Feed</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Bell className="w-7 h-7 text-indigo-500" />
              <span>Notifications</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Stay updated on account approvals, leave request responses, and
              system announcements.
            </p>
          </div>

          {/* Unread Badge */}
          <div
            className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-950/60 border-slate-800/80"
            }`}
          >
            <div
              className={`h-3 w-3 rounded-full ${
                unreadCount > 0
                  ? "bg-indigo-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <div>
              <div
                className={`text-xs font-medium ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {unreadCount > 0 ? "Unread Notifications" : "All Caught Up"}
              </div>
              <div className="text-indigo-600 font-bold text-lg leading-tight">
                {unreadCount > 0
                  ? `${unreadCount} Unread`
                  : "No new notifications"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
          }`}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === tab.key
                  ? isLight
                    ? "bg-white text-indigo-700 shadow-sm border border-indigo-200"
                    : "bg-slate-800 text-indigo-300 border border-indigo-500/30"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeFilter === tab.key
                    ? isLight
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-indigo-500/20 text-indigo-300"
                    : isLight
                    ? "bg-slate-200 text-slate-500"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions & Simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNotification}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 active:scale-95 ${
              isLight
                ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-sm"
                : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Simulate Notification</span>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                isLight
                  ? "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                  : "bg-slate-900 text-indigo-400 border-slate-800 hover:bg-indigo-500/10"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                isLight
                  ? "bg-white text-red-600 border-red-200 hover:bg-red-50"
                  : "bg-slate-900 text-red-400 border-slate-800 hover:bg-red-500/10"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
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
            <span className="text-sm font-medium">
              Loading notifications...
            </span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div
              className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${
                isLight
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <Inbox
                className={`w-6 h-6 ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              />
            </div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              {activeFilter === "unread"
                ? "No unread notifications"
                : activeFilter === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </h3>
            <p
              className={`text-xs max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {activeFilter === "all"
                ? "When you receive notifications about account status, leave requests, or announcements, they will appear here."
                : "Try switching to a different filter tab."}
            </p>
          </div>
        ) : (
          <div>
            {paginatedList.map((notif) => {
              const config = getTypeConfig(notif.type, isLight);
              const TypeIcon = config.icon;
              return (
                <div
                  key={notif._id}
                  className={`flex items-start gap-4 px-6 py-4 border-b transition-all group ${
                    !notif.isRead
                      ? isLight
                        ? "bg-indigo-50/40 border-slate-100"
                        : "bg-indigo-500/5 border-slate-800/60"
                      : isLight
                      ? "border-slate-100 hover:bg-slate-50"
                      : "border-slate-800/60 hover:bg-slate-800/20"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${config.color}`}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold truncate ${
                              isLight ? "text-slate-900" : "text-white"
                            }`}
                          >
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isLight ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${config.color}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkRead(notif._id)}
                            title="Mark as read"
                            className={`p-1.5 rounded-lg transition-colors ${
                              isLight
                                ? "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                : "text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif._id)}
                          title="Delete notification"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                              : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {filteredNotifications.length > 0 && (
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
                {filteredNotifications.length}
              </strong>{" "}
              notifications
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
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
                  )
                )}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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

export default Notifications;
