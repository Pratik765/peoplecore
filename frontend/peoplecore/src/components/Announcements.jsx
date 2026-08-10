import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import {
  Megaphone,
  Sparkles,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  Info,
  CalendarHeart,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

const ADMIN_SERVICE_URL = "http://localhost:5002";

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

function Announcements() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";
  const user = useSelector((store) => store.user);

  const userRole = user?.user?.role || "EMPLOYEE";
  const canManage = userRole === "ADMIN" || userRole === "HR";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals & Form states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "INFO",
    isPinned: false,
  });

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const token = user?.token || localStorage.getItem("token");
  const authToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

  const fetchAnnouncements = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${ADMIN_SERVICE_URL}/announcements`, {
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      } else {
        throw new Error("Failed to fetch announcements");
      }
    } catch (err) {
      setErrorMsg(err.message || "Error loading announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE) || 1;
  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return announcements.slice(start, start + ITEMS_PER_PAGE);
  }, [announcements, currentPage]);

  const handleOpenPostModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setSelectedAnnouncement(item);
      setFormData({
        title: item.title,
        content: item.content,
        priority: item.priority || "INFO",
        isPinned: item.isPinned || false,
      });
    } else {
      setIsEditing(false);
      setSelectedAnnouncement(null);
      setFormData({
        title: "",
        content: "",
        priority: "INFO",
        isPinned: false,
      });
    }
    setShowPostModal(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = isEditing
        ? `${ADMIN_SERVICE_URL}/announcements/${selectedAnnouncement._id}`
        : `${ADMIN_SERVICE_URL}/announcements`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save announcement");

      setSuccessMsg(
        isEditing
          ? "Announcement updated successfully!"
          : "New announcement posted successfully!"
      );
      setShowPostModal(false);
      fetchAnnouncements();
    } catch (err) {
      setErrorMsg(err.message || "Operation failed");
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await fetch(`${ADMIN_SERVICE_URL}/announcements/${id}/pin`, {
        method: "PUT",
        headers: { Authorization: authToken },
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.log("Failed to toggle pin");
    }
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      const res = await fetch(
        `${ADMIN_SERVICE_URL}/announcements/${selectedAnnouncement._id}`,
        {
          method: "DELETE",
          headers: { Authorization: authToken },
        }
      );
      if (res.ok) {
        setSuccessMsg("Announcement deleted successfully!");
        fetchAnnouncements();
      }
    } catch (err) {
      setErrorMsg("Failed to delete announcement");
    } finally {
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const priorityConfig = {
    INFO: {
      label: "Information",
      color: isLight
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-blue-500/10 text-blue-400 border-blue-500/30",
      icon: Info,
    },
    URGENT: {
      label: "Urgent",
      color: isLight
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-red-500/10 text-red-400 border-red-500/30",
      icon: AlertCircle,
    },
    EVENT: {
      label: "Event",
      color: isLight
        ? "bg-violet-50 text-violet-700 border-violet-200"
        : "bg-violet-500/10 text-violet-400 border-violet-500/30",
      icon: CalendarHeart,
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        type="danger"
        title="Delete Announcement"
        message={`Are you sure you want to delete "${selectedAnnouncement?.title}"? This action cannot be undone.`}
        confirmText="Delete Notice"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Post/Edit Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            onClick={() => setShowPostModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          />
          <div
            className={`relative w-full max-w-lg border rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-scaleUp ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-slate-900 border-slate-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-500" />
                <span>
                  {isEditing ? "Edit Announcement" : "Create Announcement"}
                </span>
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1 text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Company Retreat 2026"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight
                      ? "bg-slate-100 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1 text-slate-400">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight
                      ? "bg-slate-100 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                >
                  <option value="INFO">Information</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1 text-slate-400">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write full announcement details here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isLight
                      ? "bg-slate-100 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData({ ...formData, isPinned: e.target.checked })
                  }
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label htmlFor="pinCheck" className="text-xs font-medium cursor-pointer">
                  Pin this announcement to top
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? "Update Notice" : "Post Notice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-violet-500/10 text-violet-400 border-violet-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Notices Board</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Megaphone className="w-7 h-7 text-violet-500" />
              <span>Announcements</span>
            </h1>
            <p
              className={`text-sm max-w-xl ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Company-wide notices, policy updates, and events from HR & Management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManage && (
              <button
                onClick={() => handleOpenPostModal()}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            )}
            <div
              className={`px-5 py-3 rounded-2xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-950/60 border-slate-800/80"
              }`}
            >
              <div className="text-xs font-medium text-slate-400">Total Notices</div>
              <div className="text-violet-500 font-bold text-lg leading-tight">
                {announcements.length} Posted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3.5 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-4 py-3.5 rounded-xl text-sm">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Loading announcements...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 border rounded-2xl border-slate-800">
          <Inbox className="w-8 h-8 text-slate-500" />
          <h3 className="text-base font-semibold text-slate-300">
            No announcements yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Company announcements and notices posted by Management will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedAnnouncements.map((item) => {
            const priority = priorityConfig[item.priority] || priorityConfig.INFO;
            const PriorityIcon = priority.icon;
            return (
              <div
                key={item._id}
                className={`relative border rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  item.isPinned
                    ? isLight
                      ? "bg-indigo-50/40 border-indigo-200"
                      : "bg-indigo-950/20 border-indigo-500/40"
                    : isLight
                    ? "bg-white border-slate-200"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${priority.color}`}
                      >
                        <PriorityIcon className="w-3 h-3" />
                        <span>{priority.label}</span>
                      </span>

                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <Pin className="w-3 h-3 text-indigo-400" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    {/* Admin/HR Actions */}
                    {canManage && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTogglePin(item._id)}
                          title={item.isPinned ? "Unpin notice" : "Pin notice"}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                        >
                          {item.isPinned ? (
                            <PinOff className="w-4 h-4" />
                          ) : (
                            <Pin className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenPostModal(item)}
                          title="Edit notice"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAnnouncement(item);
                            setShowDeleteModal(true);
                          }}
                          title="Delete notice"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3
                      className={`text-lg font-bold tracking-tight ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed whitespace-pre-line ${
                        isLight ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  className={`mt-6 pt-4 border-t text-[11px] flex items-center justify-between ${
                    isLight
                      ? "border-slate-200 text-slate-500"
                      : "border-slate-800 text-slate-500"
                  }`}
                >
                  <span>
                    Posted by{" "}
                    <strong className={isLight ? "text-slate-800" : "text-slate-300"}>
                      {item.postedByName}
                    </strong>{" "}
                    ({item.postedByRole})
                  </span>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {announcements.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-800">
          <span className="text-slate-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-2 border rounded-xl disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 border rounded-xl disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Announcements;
