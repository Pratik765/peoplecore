import { useState, useEffect, useCallback, useMemo } from "react";
import useAuth from "./useAuth";
import usePagination from "./usePagination";
import {
  fetchTodayAttendance,
  fetchMyAttendanceHistory,
  fetchAllAttendanceHistory,
  fetchHrAttendanceStats,
  checkInAttendance,
  checkOutAttendance,
} from "../api/attendanceApi";

export const useAttendanceData = () => {
  const { isHR } = useAuth();
  const [viewScope, setViewScope] = useState("my");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [hrStats, setHrStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Fetch Today Record
      try {
        const todayData = await fetchTodayAttendance();
        setTodayRecord(todayData);
      } catch (e) {}

      // 2. Fetch History
      const historyPromise = viewScope === "all" && isHR ? fetchAllAttendanceHistory() : fetchMyAttendanceHistory();
      const historyData = await historyPromise.catch(() => []);
      if (Array.isArray(historyData)) {
        setHistory(historyData);
      }

      // 3. Fetch HR Stats
      if (isHR && viewScope === "all") {
        const stats = await fetchHrAttendanceStats().catch(() => null);
        setHrStats(stats);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  }, [viewScope, isHR]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      const updated = await checkInAttendance();
      setTodayRecord(updated);
      setSuccessMsg("Checked in successfully!");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to check in.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      const updated = await checkOutAttendance();
      setTodayRecord(updated);
      setSuccessMsg("Checked out successfully!");
      loadData();
    } catch (err) {
      setErrorMsg(err.message || "Failed to check out.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        item.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date?.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [history, statusFilter, searchQuery]);

  const pagination = usePagination(filteredHistory, 10);

  return {
    viewScope,
    setViewScope,
    currentTime,
    todayRecord,
    history: filteredHistory,
    hrStats,
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
  };
};

export default useAttendanceData;
