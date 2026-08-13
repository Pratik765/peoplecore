import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchMyNotifications = () => {
  return apiFetch(`${API_BASE_URLS.NOTIFICATION}/notifications/my`);
};

export const markNotificationRead = (notificationId) => {
  return apiFetch(`${API_BASE_URLS.NOTIFICATION}/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const markAllNotificationsRead = () => {
  return apiFetch(`${API_BASE_URLS.NOTIFICATION}/notifications/read-all`, {
    method: "PATCH",
  });
};

export const deleteNotification = (notificationId) => {
  return apiFetch(`${API_BASE_URLS.NOTIFICATION}/notifications/${notificationId}`, {
    method: "DELETE",
  });
};

export const clearAllNotifications = () => {
  return apiFetch(`${API_BASE_URLS.NOTIFICATION}/notifications/clear-all`, {
    method: "DELETE",
  });
};
