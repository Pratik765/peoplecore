import React, { useState, useEffect, useCallback, useMemo } from "react";
import useTheme from "../hooks/useTheme";
import usePagination from "../hooks/usePagination";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import Pagination from "../components/ui/Pagination";
import Card from "../components/ui/Card";
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../api/notificationApi";
import { timeAgo } from "../utils/formatters";
import { Bell, Check, Trash2, CheckCircle2, XCircle, Layers } from "lucide-react";

export function NotificationsPage() {
  const { isLight } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchMyNotifications();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadData();
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setSuccessMsg("All notifications marked as read.");
      loadData();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      loadData();
    } catch (err) {}
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setSuccessMsg("All notifications cleared.");
      loadData();
    } catch (err) {}
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (statusFilter === "UNREAD") return !n.isRead;
      if (statusFilter === "READ") return n.isRead;
      return true;
    });
  }, [notifications, statusFilter]);

  const pagination = usePagination(filteredNotifications, 8);

  return (
    <PageLayout>
      <PageHeader
        badgeText="Notifications & Activity"
        badgeIcon={Bell}
        title="Personal Alerts &"
        highlightTitle="System Notifications"
        description="View account approval updates, leave status changes, and administrative alerts."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Check} onClick={handleMarkAllRead}>
              Mark All Read
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        }
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      <div className="space-y-4">
        <SectionHeader
          icon={Layers}
          title="Notification Stream"
          action={
            <FilterBar
              filters={["ALL", "UNREAD", "READ"]}
              activeFilter={statusFilter}
              onSelectFilter={setStatusFilter}
            />
          }
        />

        {notifications.length === 0 && !loading ? (
          <EmptyState title="No notifications" description="You're all caught up! No notifications to display." />
        ) : (
          <div className="space-y-3">
            {pagination.paginatedItems.map((item) => {
              const isUnread = !item.isRead;

              return (
                <Card
                  key={item._id}
                  className={`p-4 flex items-start justify-between gap-4 transition-all ${
                    isUnread
                      ? isLight
                        ? "bg-indigo-50/40 border-indigo-200"
                        : "bg-indigo-950/20 border-indigo-500/30"
                      : isLight
                      ? "bg-white border-slate-200"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                      {item.type?.includes("APPROVED") ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : item.type?.includes("REJECTED") ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Bell className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${isLight ? "text-slate-900" : "text-white"}`}>
                          {item.title || "System Alert"}
                        </span>
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        {item.message || item.content}
                      </p>
                      <span className="text-[10px] text-slate-500 block pt-0.5">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(item._id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            : "text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
                        }`}
                        title="Mark Read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLight
                          ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                          : "text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onNext={pagination.goToNext}
              onPrev={pagination.goToPrev}
              totalItems={pagination.totalItems}
              itemsPerPage={8}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default NotificationsPage;
