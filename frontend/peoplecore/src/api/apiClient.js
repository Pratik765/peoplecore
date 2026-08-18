// Universal API fetch wrapper with token injection and error handling

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

export const apiFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle no-content response
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    // Guard against null/empty successful responses (e.g. Render free tier cold start)
    if (data === null) {
      throw new Error("Server returned an empty response. The server may be waking up — please try again in a few seconds.");
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${url}:`, error.message);
    throw error;
  }
};
