import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchMyLeaves = () => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/my`);
};

export const fetchAllLeaves = () => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/all`);
};

export const applyForLeave = (leaveData) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves`, {
    method: "POST",
    body: JSON.stringify({
      leaveType: leaveData.leaveType,
      start_date: leaveData.startDate || leaveData.start_date,
      end_date: leaveData.endDate || leaveData.end_date,
      remark: leaveData.remark,
    }),
  });
};

export const deleteLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/${leaveId}`, {
    method: "DELETE",
  });
};

export const approveLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/${leaveId}/approve`, {
    method: "PUT",
  });
};

export const rejectLeaveRequest = (leaveId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/leaves/${leaveId}/reject`, {
    method: "PUT",
  });
};

export const fetchLegacyLeaveStats = (userId) => {
  return apiFetch(`${API_BASE_URLS.LEAVE}/api1/leaverequest/getById?mongoid=${userId}`);
};

