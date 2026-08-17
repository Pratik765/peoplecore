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
          <tr
            key={slip._id || idx}
            className={`transition-colors duration-150 ${
              isLight
                ? "hover:bg-indigo-50/50"
                : "hover:bg-slate-800/50"
            }`}
          >
            <td className="py-3.5 px-5 font-bold align-middle whitespace-nowrap">{slip.month || slip.payMonth || "Month"} {slip.year || slip.payYear || "2026"}</td>
            {showEmployeeColumn && (
              <td className="py-3.5 px-5 font-semibold align-middle whitespace-nowrap">{slip.userName || slip.employeeName || slip.employeeId || "Employee"}</td>
            )}
            <td className="py-3.5 px-5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 align-middle whitespace-nowrap">{formatCurrency(slip.netSalary || slip.amount || 95000)}</td>
            <td className="py-3.5 px-5 align-middle whitespace-nowrap">
              <Badge variant={slip.status === "PAID" ? "emerald" : "amber"}>
                {slip.status || "DISBURSED"}
              </Badge>
            </td>
            <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 font-mono text-xs align-middle whitespace-nowrap">{formatDate(slip.createdAt || slip.issuedDate || slip.paidOn)}</td>
            <td className="py-3.5 px-5 align-middle whitespace-nowrap">
              <button
                onClick={() => alert(`Downloading payslip for ${slip.month || slip.payMonth} ${slip.year || slip.payYear}...`)}
                className={`p-2 rounded-xl transition-all ${
                  isLight
                    ? "text-indigo-600 hover:bg-indigo-50 border border-indigo-100"
                    : "text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/20"
                }`}
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
