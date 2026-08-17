import React from "react";
import { Pin, Pencil, Trash2 } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { formatDate } from "../../utils/formatters";

export function AnnouncementCard({
  announcement,
  canManage = false,
  onPin,
  onEdit,
  onDelete,
  className = "",
}) {
  const { isLight } = useTheme();

  if (!announcement) return null;

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md shadow-md flex flex-col justify-between space-y-3 transition-all ${
        announcement.isPinned
          ? isLight
            ? "bg-indigo-50/50 border-indigo-200"
            : "bg-indigo-950/20 border-indigo-500/30"
          : isLight
          ? "bg-white border-slate-200"
          : "bg-slate-900 border-slate-800"
      } ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              announcement.priority === "URGENT"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : announcement.priority === "EVENT"
                ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            }`}
          >
            {announcement.priority || "INFO"}
          </span>

          <div className="flex items-center gap-1.5">
            {announcement.isPinned && (
              <span className="text-[10px] flex items-center gap-1 text-indigo-400 font-semibold">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}

            {canManage && (
              <div className="flex items-center gap-1">
                {onPin && (
                  <button
                    onClick={() => onPin(announcement._id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isLight
                        ? "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    title={announcement.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(announcement)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isLight
                        ? "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(announcement._id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isLight
                        ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                        : "text-slate-400 hover:text-red-400 hover:bg-red-500/20"
                    }`}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <h3 className={`font-bold text-sm line-clamp-1 ${isLight ? "text-slate-900" : "text-white"}`}>
          {announcement.title}
        </h3>

        <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {announcement.content}
        </p>
      </div>

      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/40 flex justify-between">
        <span>
          By {announcement.postedByName || "Admin"} ({announcement.postedByRole || "ADMIN"})
        </span>
        <span>{formatDate(announcement.createdAt)}</span>
      </div>
    </div>
  );
}

export default AnnouncementCard;
