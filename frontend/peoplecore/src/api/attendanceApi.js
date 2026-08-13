import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchTodayAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/today`);
};

export const fetchMyAttendanceHistory = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/my-history`);
};

export const fetchAllAttendanceHistory = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/all-history`);
};

export const fetchHrAttendanceStats = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/hr-stats`);
};

export const checkInAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/check-in`, {
    method: "POST",
  });
};

export const checkOutAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/check-out`, {
    method: "POST",
  });
};
