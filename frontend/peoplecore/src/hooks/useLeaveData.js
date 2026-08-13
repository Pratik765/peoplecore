import { useState, useEffect, useCallback, useMemo } from "react";
import useAuth from "./useAuth";
import usePagination from "./usePagination";
import {
  fetchMyLeaves,
  fetchAllLeaves,
  applyForLeave,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../api/leaveApi";

export const useLeaveData = () => {
  const { isHR } = useAuth();
  const [viewScope, setViewScope] = useState("my");

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Paid Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const fetchFunc = viewScope === "all" && isHR ? fetchAllLeaves : fetchMyLeaves;
      const res = await fetchFunc();
      if (Array.isArray(res)) {
        setLeaves(res);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to load leave history.");
    } finally {
      setLoading(false);
    }
  }, [viewScope, isHR]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyLeave = async () => {
    if (!startDate || !endDate) {
      setErrorMsg("Please select both start date and end date.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await applyForLeave({ leaveType, startDate, endDate, remark });
      setSuccessMsg("Leave application submitted successfully!");
      setShowApplyModal(false);
      setStartDate("");
      setEndDate("");
      setRemark("");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit leave application.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    setErrorMsg("");
    try {
      await deleteLeaveRequest(leaveId);
      setSuccessMsg("Leave request cancelled.");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to cancel leave request.");
    }
  };

  const handleApprove = async (leaveId) => {
    setActionLoadingId(leaveId);
    setErrorMsg("");
    try {
      await approveLeaveRequest(leaveId);
      setSuccessMsg("Leave request approved.");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to approve leave request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (leaveId) => {
    setActionLoadingId(leaveId);
    setErrorMsg("");
    try {
      await rejectLeaveRequest(leaveId);
      setSuccessMsg("Leave request rejected.");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to reject leave request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => statusFilter === "ALL" || l.status === statusFilter);
  }, [leaves, statusFilter]);

  const pagination = usePagination(filteredLeaves, 10);

  return {
    viewScope,
    setViewScope,
    leaves: filteredLeaves,
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
  };
};

export default useLeaveData;
