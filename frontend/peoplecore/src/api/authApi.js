import { API_BASE_URLS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const loginUser = (credentials) => {
  return apiFetch(`${API_BASE_URLS.AUTH}/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (userData) => {
  return apiFetch(`${API_BASE_URLS.AUTH}/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const verifyOtp = (otpData) => {
  return apiFetch(`${API_BASE_URLS.AUTH}/verify-otp`, {
    method: "POST",
    body: JSON.stringify(otpData),
  });
};
