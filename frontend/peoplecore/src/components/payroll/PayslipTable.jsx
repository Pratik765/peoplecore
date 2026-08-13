import React from "react";
import useTheme from "../../hooks/useTheme";
import DataTable from "../ui/DataTable";
import Pagination from "../ui/Pagination";
import Badge from "../ui/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Download } from "lucide-react";

export function PayslipTable({ payslips = [], loading = false, pagination, showEmployeeColumn = false }) {
  const { isLight } = useTheme();

  const headers = showEmployeeColumn
    ? ["Month/Year", "Employee", "Net Salary", "Disbursal Status", "Issued Date", "Download"]
    : ["Month/Year", "Net Salary", "Disbursal Status", "Issued Date", "Download"];

  return (
    <div className="space-y-3">
      <DataTable headers={headers} loading={loading} empty={payslips.length === 0} emptyMessage="No payslips generated.">
        {pagination.paginatedItems.map((slip, idx) => (
          <tr key={slip._id || idx} className={`hover:bg-slate-800/30 transition-colors ${isLight ? "border-slate-200" : "border-slate-800/50"}`}>
            <td className="py-3 px-4 font-bold">{slip.month || "Month"} {slip.year || "2026"}</td>
            {showEmployeeColumn && (
              <td className="py-3 px-4 font-semibold">{slip.userName || slip.employeeName || slip.employeeId || "Employee"}</td>
            )}
            <td className="py-3 px-4 font-mono font-bold text-emerald-400">{formatCurrency(slip.netSalary || slip.amount || 95000)}</td>
            <td className="py-3 px-4">
              <Badge variant={slip.status === "PAID" ? "emerald" : "amber"}>
                {slip.status || "DISBURSED"}
              </Badge>
            </td>
            <td className="py-3 px-4 text-slate-400">{formatDate(slip.createdAt || slip.issuedDate)}</td>
            <td className="py-3 px-4">
              <button
                onClick={() => alert(`Downloading payslip for ${slip.month} ${slip.year}...`)}
                className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                title="Download Payslip PDF"
              >
                <Download className="w-4 h-4" />
              </button>
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

export default PayslipTable;
