import React from "react";
import useTheme from "../../hooks/useTheme";
import DataTable from "../ui/DataTable";
import Pagination from "../ui/Pagination";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/formatters";

export function AttendanceHistoryTable({
  history = [],
  loading = false,
  pagination,
  showEmployeeColumn = false,
}) {
  const { isLight } = useTheme();

  const headers = showEmployeeColumn
    ? ["Date", "Employee", "Check In", "Check Out", "Work Hours", "Status"]
    : ["Date", "Check In", "Check Out", "Work Hours", "Status"];

  return (
    <div className="space-y-3">
      <DataTable headers={headers} loading={loading} empty={history.length === 0} emptyMessage="No attendance records logged.">
        {pagination.paginatedItems.map((row, idx) => (
          <tr
            key={row._id || idx}
            className={`transition-colors duration-150 ${
              isLight ? "hover:bg-slate-50/80" : "hover:bg-slate-800/40"
            }`}
          >
            <td className="py-3 px-4 font-mono font-medium">{formatDate(row.date)}</td>
            {showEmployeeColumn && (
              <td className="py-3 px-4 font-semibold">{row.userName || row.userId || "Employee"}</td>
            )}
            <td className="py-3 px-4 font-mono">{row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</td>
            <td className="py-3 px-4 font-mono">{row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</td>
            <td className="py-3 px-4 font-mono font-bold text-indigo-400">{row.workHours ? `${row.workHours} hrs` : "--"}</td>
            <td className="py-3 px-4">
              <Badge variant={row.status === "PRESENT" ? "emerald" : row.status === "LATE" ? "amber" : "red"}>
                {row.status || "PRESENT"}
              </Badge>
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
  );
}

export default AttendanceHistoryTable;
