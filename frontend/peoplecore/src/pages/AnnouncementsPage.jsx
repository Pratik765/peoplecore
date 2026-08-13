import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import usePagination from "../hooks/usePagination";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import AnnouncementCard from "../components/common/AnnouncementCard";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
} from "../api/announcementApi";
import { Megaphone, Plus, Sparkles, Layers } from "lucide-react";

export function AnnouncementsPage() {
  const { isLight } = useTheme();
  const { isHR, userName, role: userRole } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("INFO");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchAnnouncements();
      if (Array.isArray(data)) setAnnouncements(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setPriority("INFO");
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setPriority(item.priority || "INFO");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setErrorMsg("Please enter both title and content.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload = { title, content, priority, postedByName: userName, postedByRole: userRole };
      if (editingId) {
        await updateAnnouncement(editingId, payload);
        setSuccessMsg("Announcement updated!");
      } else {
        await createAnnouncement(payload);
        setSuccessMsg("Announcement published!");
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setErrorMsg("");
    try {
      await deleteAnnouncement(id);
      setSuccessMsg("Announcement deleted.");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete announcement.");
    }
  };

  const handlePin = async (id) => {
    setErrorMsg("");
    try {
      await togglePinAnnouncement(id);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to pin announcement.");
    }
  };

  const pagination = usePagination(announcements, 6);

  return (
    <PageLayout>
      <PageHeader
        badgeText="Company Broadcasts"
        badgeIcon={Megaphone}
        title="Organization Notices &"
        highlightTitle="Announcements"
        description="Stay informed on important company broadcasts, policy updates, and executive memos."
        action={
          isHR && (
            <Button icon={Plus} onClick={handleOpenCreate}>
              New Announcement
            </Button>
          )
        }
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      <div className="space-y-4">
        <SectionHeader icon={Layers} title="All Published Notices" />

        {announcements.length === 0 && !loading ? (
          <EmptyState title="No announcements" description="No notices published on the board yet." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagination.paginatedItems.map((item) => (
                <AnnouncementCard
                  key={item._id}
                  announcement={item}
                  canManage={isHR}
                  onPin={handlePin}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onNext={pagination.goToNext}
              onPrev={pagination.goToPrev}
              totalItems={pagination.totalItems}
              itemsPerPage={6}
            />
          </>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        show={showModal}
        title={editingId ? "Edit Announcement" : "Create New Announcement"}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmText={submitting ? "Saving..." : editingId ? "Update Notice" : "Publish Notice"}
      >
        <div className="space-y-4 text-xs pt-2">
          <Input label="Notice Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Select label="Priority Level" options={["INFO", "URGENT", "EVENT"]} value={priority} onChange={(e) => setPriority(e.target.value)} />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Notice Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-xl text-xs bg-slate-950/60 border border-slate-800 text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}

export default AnnouncementsPage;
