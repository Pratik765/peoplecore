import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { notificationAction } from "../store/notificationSlice";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Shield,
  Megaphone,
  Zap,
  Check,
  ChevronRight,
  X,
} from "lucide-react";

const NOTIFICATION_API = "http://localhost:5005";

// Map notification type to icon & color
const getTypeConfig = (type, isLight) => {
  switch (type) {
    case "ACCOUNT_APPROVED":
      return {
        icon: CheckCircle2,
        color: isLight
          ? "text-emerald-600 bg-emerald-50"
          : "text-emerald-400 bg-emerald-500/10",
      };
    case "ACCOUNT_REJECTED":
      return {
        icon: XCircle,
        color: isLight
          ? "text-red-600 bg-red-50"
          : "text-red-400 bg-red-500/10",
      };
    case "LEAVE_APPROVED":
      return {
        icon: CheckCircle2,
        color: isLight
          ? "text-indigo-600 bg-indigo-50"
          : "text-indigo-400 bg-indigo-500/10",
      };
    case "LEAVE_REJECTED":
      return {
        icon: XCircle,
        color: isLight
          ? "text-amber-600 bg-amber-50"
          : "text-amber-400 bg-amber-500/10",
      };
    case "ANNOUNCEMENT":
      return {
        icon: Megaphone,
        color: isLight
          ? "text-violet-600 bg-violet-50"
          : "text-violet-400 bg-violet-500/10",
      };
    default:
      return {
        icon: Zap,
        color: isLight
          ? "text-blue-600 bg-blue-50"
          : "text-blue-400 bg-blue-500/10",
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function NotificationBell({ position = "sidebar" }) {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";
  const user = useSelector((store) => store.user);
  const { notifications, unreadCount } = useSelector(
    (store) => store.notification
  );
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = user?.token || localStorage.getItem("token");

  // Fetch unread count on mount & poll every 30 seconds
  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const authToken = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
        const res = await fetch(`${NOTIFICATION_API}/notifications/unread-count`, {
          headers: { Authorization: authToken },
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(notificationAction.setUnreadCount(data.count));
        }
      } catch (err) {
        // Silently fail — notification service might be down
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [token, dispatch]);

  // Fetch recent notifications when dropdown opens
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const authToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      const res = await fetch(`${NOTIFICATION_API}/notifications`, {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(notificationAction.setNotifications(data));
      }
    } catch (err) {
      console.log("Failed to fetch notifications");
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      const authToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      await fetch(`${NOTIFICATION_API}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: authToken },
      });
      dispatch(notificationAction.markAllRead());
    } catch (err) {
      console.log("Failed to mark all read");
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  const isTopRight = position === "top-right";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      {isTopRight ? (
        <button
          type="button"
          onClick={handleToggle}
          className={`relative p-2 rounded-xl border transition-all ${
            isOpen
              ? isLight
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
              : isLight
              ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={handleToggle}
          className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all group ${
            isOpen
              ? isLight
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
              : isLight
              ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-sm"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isLight
                  ? "bg-red-100 text-red-700"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {unreadCount} new
            </span>
          )}
        </button>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute ${
            isTopRight ? "top-full right-0 mt-2" : "bottom-full left-0 mb-2"
          } w-80 rounded-2xl border shadow-2xl overflow-hidden z-[60] animate-scaleUp ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-300/50"
              : "bg-slate-900 border-slate-800 shadow-slate-950/70"
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              isLight ? "border-slate-200" : "border-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell
                className={`w-4 h-4 ${
                  isLight ? "text-indigo-600" : "text-indigo-400"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isLight
                      ? "bg-red-100 text-red-700"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className={`text-[10px] font-medium px-2 py-1 rounded-lg transition-colors ${
                    isLight
                      ? "text-indigo-600 hover:bg-indigo-50"
                      : "text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isLight
                    ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    : "text-slate-500 hover:text-white hover:bg-slate-800"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Bell
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isLight ? "text-slate-300" : "text-slate-600"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  No notifications yet
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    isLight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  We'll notify you when something happens
                </p>
              </div>
            ) : (
              recentNotifications.map((notif) => {
                const config = getTypeConfig(notif.type, isLight);
                const TypeIcon = config.icon;
                return (
                  <div
                    key={notif._id}
                    className={`px-4 py-3 flex items-start gap-3 border-b transition-colors cursor-default ${
                      !notif.isRead
                        ? isLight
                          ? "bg-indigo-50/50 border-slate-100"
                          : "bg-indigo-500/5 border-slate-800/60"
                        : isLight
                        ? "border-slate-100 hover:bg-slate-50"
                        : "border-slate-800/60 hover:bg-slate-800/30"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${config.color}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isLight ? "text-slate-900" : "text-slate-200"
                          }`}
                        >
                          {notif.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!notif.isRead && (
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}
                          <span className="text-[9px] text-slate-500">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 line-clamp-2 leading-relaxed ${
                          isLight ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className={`px-4 py-2.5 border-t ${
              isLight ? "border-slate-200" : "border-slate-800"
            }`}
          >
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-xl transition-all ${
                isLight
                  ? "text-indigo-600 hover:bg-indigo-50"
                  : "text-indigo-400 hover:bg-indigo-500/10"
              }`}
            >
              <span>View all notifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
