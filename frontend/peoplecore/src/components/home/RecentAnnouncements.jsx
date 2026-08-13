import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import SectionHeader from "../ui/SectionHeader";
import EmptyState from "../ui/EmptyState";
import AnnouncementCard from "../common/AnnouncementCard";
import { Megaphone, ChevronRight } from "lucide-react";

export function RecentAnnouncements({ announcements = [] }) {
  const { isLight } = useTheme();

  return (
    <section className="space-y-4 pt-4">
      <SectionHeader
        icon={Megaphone}
        title="Latest Company Announcements"
        action={
          <Link
            to="/announcements"
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isLight ? "text-indigo-600 hover:text-indigo-700" : "text-indigo-400 hover:text-indigo-300"
            }`}
          >
            <span>View All Board Notices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {announcements.length === 0 ? (
        <EmptyState title="No announcements" description="No company announcements posted yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((item) => (
            <AnnouncementCard key={item._id} announcement={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentAnnouncements;
