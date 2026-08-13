import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const fetchAnnouncements = () => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/announcements`);
};

export const createAnnouncement = (announcementData) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/announcements`, {
    method: "POST",
    body: JSON.stringify(announcementData),
  });
};

export const updateAnnouncement = (id, announcementData) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/announcements/${id}`, {
    method: "PUT",
    body: JSON.stringify(announcementData),
  });
};

export const deleteAnnouncement = (id) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/announcements/${id}`, {
    method: "DELETE",
  });
};

export const togglePinAnnouncement = (id) => {
  return apiFetch(`${API_BASE_URLS.ADMIN}/announcements/${id}/pin`, {
    method: "PATCH",
  });
};
