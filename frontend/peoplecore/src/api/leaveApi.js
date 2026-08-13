import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchMyLeaves = () => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/my`);
};

export const fetchAllLeaves = () => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/all`);
};

export const applyForLeave = (leaveData) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/apply`, {
    method: "POST",
    body: JSON.stringify(leaveData),
  });
};

export const deleteLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/${leaveId}`, {
    method: "DELETE",
  });
};

export const approveLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/approve/${leaveId}`, {
    method: "POST",
  });
};

export const rejectLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/reject/${leaveId}`, {
    method: "POST",
  });
};

export const fetchLegacyLeaveStats = (userId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE_LEGACY}/leaverequest/getById?mongoid=${userId}`);
};
