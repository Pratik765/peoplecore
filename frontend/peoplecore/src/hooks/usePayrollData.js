import { useState, useEffect, useCallback, useMemo } from "react";
import useAuth from "./useAuth";
import usePagination from "./usePagination";
import {
  fetchMySalaryStructure,
  fetchMyPayslips,
  fetchAllPayslips,
  configureEmployeeCtc,
  generateBatchPayslips,
} from "../api/payrollApi";

export const usePayrollData = () => {
  const { isHR } = useAuth();
  const [viewScope, setViewScope] = useState("my");

  const [salaryStructure, setSalaryStructure] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showCtcModal, setShowCtcModal] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [targetCtc, setTargetCtc] = useState(1200000);

  const [monthFilter, setMonthFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Fetch My Structure
      try {
        const struct = await fetchMySalaryStructure();
        setSalaryStructure(struct);
      } catch (e) {}

      // 2. Fetch Payslips
      const fetchPayslipsFunc = viewScope === "all" && isHR ? fetchAllPayslips : fetchMyPayslips;
      const payslipsData = await fetchPayslipsFunc().catch(() => []);
      if (Array.isArray(payslipsData)) {
        setPayslips(payslipsData);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to load payroll details.");
    } finally {
      setLoading(false);
    }
  }, [viewScope, isHR]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConfigureCtc = async () => {
    if (!targetEmployeeId || !targetCtc) {
      setErrorMsg("Please enter both employee ID and CTC amount.");
      return;
    }

    setActionLoading(true);
    setErrorMsg("");
    try {
      await configureEmployeeCtc(targetEmployeeId, Number(targetCtc));
      setSuccessMsg("Employee CTC structure updated successfully!");
      setShowCtcModal(false);
      setTargetEmployeeId("");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to configure CTC.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateBatch = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      const now = new Date();
      const monthStr = now.toLocaleString("en-US", { month: "long" });
      await generateBatchPayslips(monthStr, now.getFullYear());
      setSuccessMsg(`Batch payslips generated for ${monthStr} ${now.getFullYear()}!`);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate batch payslips.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayslips = useMemo(() => {
    return payslips.filter((slip) => {
      const matchesMonth = monthFilter === "ALL" || slip.month === monthFilter;
      const matchesSearch =
        !searchQuery ||
        slip.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slip.month?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMonth && matchesSearch;
    });
  }, [payslips, monthFilter, searchQuery]);

  const pagination = usePagination(filteredPayslips, 10);

  return {
    viewScope,
    setViewScope,
    salaryStructure,
    payslips: filteredPayslips,
    loading,
    actionLoading,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    showCtcModal,
    setShowCtcModal,
    targetEmployeeId,
    setTargetEmployeeId,
    targetCtc,
    setTargetCtc,
    monthFilter,
    setMonthFilter,
    searchQuery,
    setSearchQuery,
    handleConfigureCtc,
    handleGenerateBatch,
    pagination,
  };
};

export default usePayrollData;
