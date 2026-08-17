import React, { useState, useEffect, useCallback, useMemo } from "react";
import useTheme from "../hooks/useTheme";
import usePagination from "../hooks/usePagination";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import EmptyState from "../components/ui/EmptyState";
import DataTable from "../components/ui/DataTable";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import UserAvatar from "../components/common/UserAvatar";
import RoleBadge from "../components/common/RoleBadge";
import Modal from "../components/ui/Modal";
import { fetchPendingApprovals, approveUserAccount, rejectUserAccount } from "../api/userApi";
import { formatDate } from "../utils/formatters";
import { Clock, Check, X, Mail, Layers } from "lucide-react";

export function PendingRequestPage() {
  const { isLight } = useTheme();

  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchPendingApprovals();
      const list = Array.isArray(data) ? data : data?.pendingUsers || [];
      setPendingList(list);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConfirmApprove = async () => {
    if (!selectedUser) return;
    setActionLoadingId(selectedUser._id);
    setErrorMsg("");
    try {
      await approveUserAccount(selectedUser._id);
      setSuccessMsg(`Account for ${selectedUser.name || selectedUser.email} approved!`);
      setShowApproveModal(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to approve account.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedUser) return;
    setActionLoadingId(selectedUser._id);
    setErrorMsg("");
    try {
      await rejectUserAccount(selectedUser._id);
      setSuccessMsg(`Account request for ${selectedUser.name || selectedUser.email} rejected.`);
      setShowRejectModal(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to reject account.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pagination = usePagination(pendingList, 10);

  return (
    <PageLayout>
      <PageHeader
        badgeText="Account Approval Queue"
        badgeIcon={Clock}
        title="Registration Approvals &"
        highlightTitle="Pending Queue"
        description="Review new registration requests awaiting administrator account verification."
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      <div className="space-y-4">
        <SectionHeader icon={Layers} title="Awaiting Administrator Action" />

        <DataTable
          headers={["Applicant Name", "Email Address", "Requested Role", "Requested On", "Decision Actions"]}
          loading={loading}
          empty={pendingList.length === 0}
          emptyMessage="No registration applications pending approval."
        >
          {pagination.paginatedItems.map((u, idx) => (
            <tr
              key={u._id || idx}
              className={`transition-colors duration-150 ${
                isLight ? "hover:bg-slate-50/80" : "hover:bg-slate-800/40"
              }`}
            >
              <td className="py-3.5 px-4 font-semibold flex items-center gap-3">
                <UserAvatar name={u.name || "User"} size="sm" />
                <span>{u.name || "N/A"}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-400 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{u.email}</span>
              </td>
              <td className="py-3.5 px-4">
                <RoleBadge role={u.role || "EMPLOYEE"} />
              </td>
              <td className="py-3.5 px-4 text-slate-400">{formatDate(u.createdAt)}</td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="emerald"
                    icon={Check}
                    loading={actionLoadingId === u._id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowApproveModal(true);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={X}
                    loading={actionLoadingId === u._id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowRejectModal(true);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onNext={pagination.goToNext}
          onPrev={pagination.goToPrev}
          totalItems={pagination.totalItems}
        />
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        show={showApproveModal}
        title="Approve Account Access?"
        message={`Are you sure you want to approve access for ${selectedUser?.name || selectedUser?.email}?`}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleConfirmApprove}
        confirmText="Approve User"
      />

      {/* Reject Confirmation Modal */}
      <Modal
        show={showRejectModal}
        title="Reject Account Access?"
        message={`Are you sure you want to reject registration request for ${selectedUser?.name || selectedUser?.email}?`}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        confirmText="Reject Application"
        type="danger"
      />
    </PageLayout>
  );
}

export default PendingRequestPage;
