import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchMyProfile = () => {
  return apiFetch(`${API_BASE_URLS.USER}/user/me`);
};

export const updateMyProfile = (profileData) => {
  return apiFetch(`${API_BASE_URLS.USER}/user/me`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const fetchAllUsers = () => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/users`);
};

export const fetchPendingApprovals = () => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/account-approval`);
};

export const approveUserAccount = (userId) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/account-approval/approve/${userId}`, {
    method: "POST",
  });
};

export const rejectUserAccount = (userId) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/account-approval/reject/${userId}`, {
    method: "POST",
  });
};
