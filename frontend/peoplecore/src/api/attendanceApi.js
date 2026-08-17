import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchTodayAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/today`);
};

export const fetchMyAttendanceHistory = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/my`);
};

export const fetchAllAttendanceHistory = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/all`);
};

export const fetchHrAttendanceStats = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/stats`);
};

export const checkInAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/checkin`, {
    method: "POST",
  });
};

export const checkOutAttendance = () => {
  return apiFetch(`${API_BASE_URLS.ATTENDANCE}/attendance/checkout`, {
    method: "PUT",
  });
};

