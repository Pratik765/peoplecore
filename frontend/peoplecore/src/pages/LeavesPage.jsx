import React from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import ViewScopeToggle from "../components/common/ViewScopeToggle";
import FilterBar from "../components/ui/FilterBar";
import Button from "../components/ui/Button";
import LeaveStatsBar from "../components/leaves/LeaveStatsBar";
import LeaveHistoryTable from "../components/leaves/LeaveHistoryTable";
import LeaveRequestFormModal from "../components/leaves/LeaveRequestFormModal";
import useLeaveData from "../hooks/useLeaveData";
import useAuth from "../hooks/useAuth";
import { Calendar, Plus, Layers } from "lucide-react";

export function LeavesPage() {
  const { isHR } = useAuth();
  const {
    viewScope,
    setViewScope,
    leaves,
    loading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    showApplyModal,
    setShowApplyModal,
    leaveType,
    setLeaveType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    remark,
    setRemark,
    submitting,
    statusFilter,
    setStatusFilter,
    actionLoadingId,
    handleApplyLeave,
    handleDeleteLeave,
    handleApprove,
    handleReject,
    pagination,
  } = useLeaveData();

  return (
    <PageLayout>
      <PageHeader
        badgeText="Leave Management"
        badgeIcon={Calendar}
        title="Personal & Team"
        highlightTitle="Leave Operations"
        description="Apply for time off, view annual quota balances, and manage HR leave approval queues."
        action={
          <div className="flex items-center gap-3">
            <ViewScopeToggle viewScope={viewScope} onChangeScope={setViewScope} />
            {viewScope === "my" && (
              <Button icon={Plus} onClick={() => setShowApplyModal(true)}>
                Apply Leave
              </Button>
            )}
          </div>
        }
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      {/* Leave Quota Balance Summary */}
      {viewScope === "my" && <LeaveStatsBar leaves={leaves} />}

      {/* Leave Applications History */}
      <div className="space-y-4">
        <SectionHeader
          icon={Layers}
          title="Leave Requests History"
          action={
            <FilterBar
              filters={["ALL", "PENDING", "APPROVED", "REJECTED"]}
              activeFilter={statusFilter}
              onSelectFilter={setStatusFilter}
            />
          }
        />

        <LeaveHistoryTable
          leaves={pagination.paginatedItems}
          loading={loading}
          pagination={pagination}
          showEmployeeColumn={isHR && viewScope === "all"}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDeleteLeave}
          actionLoadingId={actionLoadingId}
        />
      </div>

      {/* Apply Leave Modal */}
      <LeaveRequestFormModal
        show={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplyLeave}
        leaveType={leaveType}
        setLeaveType={setLeaveType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        remark={remark}
        setRemark={setRemark}
        submitting={submitting}
      />
    </PageLayout>
  );
}

export default LeavesPage;
