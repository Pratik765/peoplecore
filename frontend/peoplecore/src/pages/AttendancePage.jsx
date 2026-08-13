import React from "react";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import ViewScopeToggle from "../components/common/ViewScopeToggle";
import SearchBar from "../components/ui/SearchBar";
import FilterBar from "../components/ui/FilterBar";
import TodayStatusCard from "../components/attendance/TodayStatusCard";
import CheckInOutActions from "../components/attendance/CheckInOutActions";
import AttendanceHistoryTable from "../components/attendance/AttendanceHistoryTable";
import useAttendanceData from "../hooks/useAttendanceData";
import useAuth from "../hooks/useAuth";
import { Clock, Layers } from "lucide-react";

export function AttendancePage() {
  const { isHR } = useAuth();
  const {
    viewScope,
    setViewScope,
    currentTime,
    todayRecord,
    loading,
    actionLoading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    handleCheckIn,
    handleCheckOut,
    pagination,
  } = useAttendanceData();

  return (
    <PageLayout>
      <PageHeader
        badgeText="Attendance Management"
        badgeIcon={Clock}
        title="Workforce Attendance &"
        highlightTitle="Shift Logs"
        description="Track real-time check-ins, check-outs, work hours, and organizational attendance logs."
        action={<ViewScopeToggle viewScope={viewScope} onChangeScope={setViewScope} />}
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      {/* Today's Live Attendance Widget */}
      {viewScope === "my" && (
        <div className="space-y-4">
          <SectionHeader
            icon={Clock}
            title="Today's Shift Action"
            action={
              <CheckInOutActions
                todayRecord={todayRecord}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                actionLoading={actionLoading}
              />
            }
          />
          <TodayStatusCard todayRecord={todayRecord} currentTime={currentTime} />
        </div>
      )}

      {/* Attendance History Section */}
      <div className="space-y-4">
        <SectionHeader
          icon={Layers}
          title="Attendance History Records"
          action={
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <FilterBar
                filters={["ALL", "PRESENT", "LATE", "ABSENT"]}
                activeFilter={statusFilter}
                onSelectFilter={setStatusFilter}
              />
              {isHR && viewScope === "all" && (
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search employee..." />
              )}
            </div>
          }
        />

        <AttendanceHistoryTable
          history={pagination.paginatedItems}
          loading={loading}
          pagination={pagination}
          showEmployeeColumn={isHR && viewScope === "all"}
        />
      </div>
    </PageLayout>
  );
}

export default AttendancePage;
