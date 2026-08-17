import React from "react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import DataTable from "../ui/DataTable";
import Pagination from "../ui/Pagination";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatDate } from "../../utils/formatters";
import { Check, X, Trash2 } from "lucide-react";

export function LeaveHistoryTable({
  leaves = [],
  loading = false,
  pagination,
  showEmployeeColumn = false,
  onApprove,
  onReject,
  onDelete,
  actionLoadingId,
}) {
  const { isLight } = useTheme();

  const headers = showEmployeeColumn
    ? ["Applicant", "Leave Type", "Duration", "Reason", "Status", "Actions"]
    : ["Leave Type", "Start Date", "End Date", "Reason", "Status", "Actions"];

  return (
    <div className="space-y-3">
      <DataTable headers={headers} loading={loading} empty={leaves.length === 0} emptyMessage="No leave records logged.">
        {pagination.paginatedItems.map((leave, idx) => {
          const isPending = leave.status === "PENDING";
          const isLoadingThis = actionLoadingId === leave._id;

          return (
            <tr
              key={leave._id || idx}
              className={`transition-colors duration-150 ${
                isLight
                  ? "hover:bg-indigo-50/50"
                  : "hover:bg-slate-800/50"
              }`}
            >
              {showEmployeeColumn && (
                <td className="py-3.5 px-5 font-semibold align-middle whitespace-nowrap">
                  {leave.userName || leave.userId || "Employee"}
                </td>
              )}
              <td className="py-3.5 px-5 font-medium align-middle whitespace-nowrap">
                {leave.leaveType || leave.type || "Paid Annual Leave"}
              </td>
              <td className="py-3.5 px-5 font-mono text-xs align-middle whitespace-nowrap">
                {formatDate(leave.startDate)} {leave.endDate ? `- ${formatDate(leave.endDate)}` : ""}
              </td>
              <td className="py-3.5 px-5 max-w-xs truncate text-slate-500 dark:text-slate-400 align-middle">
                {leave.remark || leave.reason || "N/A"}
              </td>
              <td className="py-3.5 px-5 align-middle whitespace-nowrap">
                <Badge variant={leave.status === "APPROVED" ? "emerald" : isPending ? "amber" : "red"}>
                  {leave.status || "PENDING"}
                </Badge>
              </td>
              <td className="py-3.5 px-5 align-middle whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {showEmployeeColumn && isPending && onApprove && onReject && (
                    <>
                      <Button
                        size="sm"
                        variant="emerald"
                        loading={isLoadingThis}
                        onClick={() => onApprove(leave._id)}
                        icon={Check}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={isLoadingThis}
                        onClick={() => onReject(leave._id)}
                        icon={X}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {!showEmployeeColumn && isPending && onDelete && (
                    <button
                      onClick={() => onDelete(leave._id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Cancel Leave Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onNext={pagination.goToNext}
        onPrev={pagination.goToPrev}
        totalItems={pagination.totalItems}
      />
    </div>
  );
}

export default LeaveHistoryTable;
