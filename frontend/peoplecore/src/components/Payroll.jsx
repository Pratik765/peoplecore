import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Receipt,
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Lock,
} from "lucide-react";

function Payroll() {
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const userRole = user?.user?.role || "EMPLOYEE";
  const isHR = userRole === "ADMIN" || userRole === "HR";
  const token = user?.token || localStorage.getItem("token") || "";

  // View Scope for HR: "my" or "all"
  const [viewScope, setViewScope] = useState("my");

  // Payroll Data States
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [allStructures, setAllStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Payslip Modal State
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Configure CTC Modal State
  const [showCtcModal, setShowCtcModal] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [targetCtc, setTargetCtc] = useState(1200000);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("ALL");

  // Pagination (10 rows per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      // 1. Fetch My Salary Structure
      const structRes = await fetch("http://localhost:5008/payroll/my-structure", {
        headers: { Authorization: authHeader },
      });
      if (structRes.ok) {
        const structData = await structRes.json();
        setSalaryStructure(structData);
      }

      // 2. Fetch Payslips History
      const payslipsEndpoint =
        viewScope === "all" && isHR
          ? "http://localhost:5008/payroll/all-payslips"
          : "http://localhost:5008/payroll/my-payslips";

      const payslipsRes = await fetch(payslipsEndpoint, {
        headers: { Authorization: authHeader },
      });
      if (payslipsRes.ok) {
        const payslipsData = await payslipsRes.json();
        if (Array.isArray(payslipsData)) {
          setPayslips(payslipsData);
        }
      }

      // 3. Fetch All Structures if HR
      if (isHR && viewScope === "all") {
        const allStructRes = await fetch("http://localhost:5008/payroll/all-structures", {
          headers: { Authorization: authHeader },
        });
        if (allStructRes.ok) {
          const allStructData = await allStructRes.json();
          setAllStructures(allStructData);
        }
      }
    } catch (err) {
      console.log("Error loading payroll data:", err.message);
      setErrorMsg("Unable to connect to payroll service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, viewScope]);

  // Batch Generate Payslips
  const handleBatchGenerate = async () => {
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    // Compute current month label dynamically
    const now = new Date();
    const currentPayMonth = now.toLocaleString("en-US", { month: "long" }) + " " + now.getFullYear();
    const currentPayYear = now.getFullYear();

    try {
      const response = await fetch("http://localhost:5008/payroll/generate-payslips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          payMonth: currentPayMonth,
          payYear: currentPayYear,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Failed to generate payslips.");
      }

      setSuccessMsg(res.message || "Monthly payslips generated successfully!");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Payslip generation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Configure Salary Structure Submit
  const handleConfigureCtc = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    try {
      const response = await fetch("http://localhost:5008/payroll/salary-structure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          employeeId: targetEmployeeId,
          annualCtc: Number(targetCtc),
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || "Failed to update salary structure.");
      }

      setSuccessMsg("Salary structure configured successfully!");
      setShowCtcModal(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Configuration failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Payslip Document Modal
  const openPayslip = (slip) => {
    setSelectedPayslip(slip);
    setShowPayslipModal(true);
  };

  // Print Payslip
  const handlePrintPayslip = () => {
    window.print();
  };

  // Filtered List
  const filteredPayslips = useMemo(() => {
    return payslips.filter((item) => {
      const matchesMonth = monthFilter === "ALL" || item.payMonth === monthFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.employeeName?.toLowerCase().includes(query) ||
        item.payslipId?.toLowerCase().includes(query) ||
        item.payMonth?.toLowerCase().includes(query);

      return matchesMonth && matchesSearch;
    });
  }, [payslips, monthFilter, searchQuery]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, searchQuery, viewScope]);

  // Pagination Math
  const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE) || 1;
  const paginatedPayslips = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayslips.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayslips, currentPage]);

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredPayslips.length);

  // Format Currency (₹ INR)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHR ? "Enterprise Payroll Portal" : "My Compensation & Payslips"}</span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <Receipt className="w-7 h-7 text-indigo-600" />
              <span>{viewScope === "all" ? "Company Payroll Management" : "My Earnings & Payslips"}</span>
            </h1>
            <p className={`text-sm max-w-xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {viewScope === "all"
                ? "Configure salary CTC structures, generate monthly payslips, and review company payroll metrics."
                : "View your monthly take-home salary, salary structure breakdown, and download official PDF payslips."}
            </p>
          </div>

          {/* HR Scope Switcher & Quick Actions */}
          <div className="flex flex-col items-end gap-3">
            {isHR && (
              <div
                className={`p-1 rounded-2xl border flex items-center gap-1 backdrop-blur-md ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950/80 border-slate-800"
                }`}
              >
                <button
                  onClick={() => setViewScope("my")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "my"
                      ? "bg-indigo-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Payslips</span>
                </button>
                <button
                  onClick={() => setViewScope("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    viewScope === "all"
                      ? "bg-indigo-600 text-white shadow-md"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Payroll Management</span>
                </button>
              </div>
            )}

            {isHR && viewScope === "all" && (
              <button
                onClick={handleBatchGenerate}
                disabled={actionLoading}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all disabled:opacity-60"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate August 2026 Payslips</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Salary Structure Overview Cards (Logged In Employee View) */}
      {salaryStructure && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Monthly Net Take Home */}
          <div
            className={`border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden transition-colors ${
              isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Net Take-Home</span>
              <CreditCard className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
              {formatCurrency(salaryStructure.netSalary)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Monthly credited to bank account</div>
          </div>

          {/* Annual CTC */}
          <div
            className={`border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden transition-colors ${
              isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Annual CTC</span>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-500 font-mono">
              {formatCurrency(salaryStructure.annualCtc)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Cost to Company (Annual)</div>
          </div>

          {/* Gross Salary */}
          <div
            className={`border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden transition-colors ${
              isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Monthly Gross</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">
              {formatCurrency(salaryStructure.grossSalary)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Basic + HRA + Special Allowance</div>
          </div>

          {/* Monthly Deductions */}
          <div
            className={`border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-2 relative overflow-hidden transition-colors ${
              isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Deductions</span>
              <Receipt className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 font-mono">
              {formatCurrency(salaryStructure.pfDeduction + salaryStructure.taxDeduction)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">PF ({formatCurrency(salaryStructure.pfDeduction)}) + TDS ({formatCurrency(salaryStructure.taxDeduction)})</div>
          </div>
        </div>
      )}

      {/* Toolbar & Search */}
      <div
        className={`border rounded-2xl p-4 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
          isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter Month:</span>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isLight ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-200"
            }`}
          >
            <option value="ALL">All Pay Periods</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={viewScope === "all" ? "Search employee name or payslip ID..." : "Search by payslip ID or month..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
              isLight ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400" : "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
            }`}
          />
        </div>
      </div>

      {/* Payslips Table */}
      <div
        className={`border rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden transition-colors ${
          isLight ? "bg-white/90 border-slate-200 shadow-slate-200/50" : "bg-slate-900/80 border-slate-800/80"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Loading payslip records...</span>
          </div>
        ) : filteredPayslips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
            <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-slate-500 ${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-800 border-slate-700"}`}>
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>No payslip records found</h3>
            <p className={`text-xs max-w-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              No monthly payslips match your query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${isLight ? "border-slate-200 bg-slate-100/60 text-slate-600" : "border-slate-800/80 bg-slate-950/40 text-slate-400"}`}>
                  <th className="py-4 px-6">Payslip ID</th>
                  <th className="py-4 px-6">Pay Period</th>
                  {viewScope === "all" && <th className="py-4 px-6">Employee</th>}
                  <th className="py-4 px-6">Gross Salary</th>
                  <th className="py-4 px-6">Net Take-Home</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${isLight ? "divide-slate-200" : "divide-slate-800/60"}`}>
                {paginatedPayslips.map((item) => (
                  <tr key={item._id} className={`transition-colors ${isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"}`}>
                    <td className="py-4 px-6 font-mono font-bold text-indigo-500">{item.payslipId}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">{item.payMonth}</td>
                    {viewScope === "all" && (
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{item.employeeName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.employeeEmail}</div>
                      </td>
                    )}
                    <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(item.grossSalary)}</td>
                    <td className="py-4 px-6 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(item.netSalary)}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openPayslip(item)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 10-Rows Pagination Footer */}
        {filteredPayslips.length > 0 && (
          <div className={`p-4 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "border-slate-200 bg-slate-50/80 text-slate-600" : "border-slate-800/80 bg-slate-950/40 text-slate-400"}`}>
            <span>
              Showing{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{startRecord}</strong> to{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{endRecord}</strong> of{" "}
              <strong className={`font-bold ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{filteredPayslips.length}</strong> payslips
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isLight ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-700" : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-semibold transition-all ${currentPage === pageNum ? "bg-indigo-600 text-white shadow-sm" : isLight ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isLight ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-700" : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Printable Payslip Modal */}
      {showPayslipModal && selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative border border-slate-200">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Receipt className="w-5 h-5" />
                <span>Official Employee Payslip</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPayslip}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPayslipModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Document Content */}
            <div className="space-y-6 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-indigo-900 tracking-tight">PeopleCore HR Solutions</h2>
                  <p className="text-xs text-slate-500">Corporate Headquarters • Pune, Maharashtra</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Salary Slip</span>
                  <span className="text-sm font-bold text-indigo-600">{selectedPayslip.payMonth}</span>
                </div>
              </div>

              {/* Employee Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Employee Name</span>
                  <strong className="text-slate-900 text-sm font-bold">{selectedPayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Payslip Ref ID</span>
                  <strong className="font-mono text-indigo-600 font-bold">{selectedPayslip.payslipId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Department</span>
                  <strong className="text-slate-800">{selectedPayslip.department || "Engineering"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Designation</span>
                  <strong className="text-slate-800">{selectedPayslip.designation || "Software Engineer"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Bank Account</span>
                  <strong className="font-mono text-slate-800">{selectedPayslip.accountNumber || "50100492817264"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Date</span>
                  <strong className="text-slate-800">{selectedPayslip.paidOn}</strong>
                </div>
              </div>

              {/* Earnings & Deductions Tables Side-by-Side */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Earnings */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-emerald-50 text-emerald-900 px-4 py-2 font-bold border-b border-slate-200">
                    Earnings
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-mono font-semibold">{formatCurrency(selectedPayslip.basic)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-semibold">{formatCurrency(selectedPayslip.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-mono font-semibold">{formatCurrency(selectedPayslip.specialAllowance)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-slate-900">
                      <span>Gross Earnings</span>
                      <span className="font-mono text-emerald-600">{formatCurrency(selectedPayslip.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-rose-50 text-rose-900 px-4 py-2 font-bold border-b border-slate-200">
                    Deductions
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provident Fund (PF)</span>
                      <span className="font-mono font-semibold">{formatCurrency(selectedPayslip.pfDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Income Tax (TDS)</span>
                      <span className="font-mono font-semibold">{formatCurrency(selectedPayslip.taxDeduction)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-slate-900 mt-6">
                      <span>Total Deductions</span>
                      <span className="font-mono text-rose-600">{formatCurrency(selectedPayslip.pfDeduction + selectedPayslip.taxDeduction)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary Payable Box */}
              <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 border-2 border-indigo-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">Net Take-Home Salary</span>
                  <span className="text-xs text-slate-600">Credited to Bank Account ({selectedPayslip.paymentMethod})</span>
                </div>
                <div className="text-2xl font-extrabold text-indigo-700 font-mono">
                  {formatCurrency(selectedPayslip.netSalary)}
                </div>
              </div>

              {/* Document Stamp Footer */}
              <div className="text-[11px] text-slate-400 text-center border-t pt-3 flex items-center justify-between">
                <span>System Generated Computerized Payslip • No Signature Required</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Payroll;
