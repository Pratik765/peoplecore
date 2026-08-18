// Universal API fetch wrapper with token injection, error handling, and cold-start retry

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch with automatic retry for Render free tier cold starts.
 * When the server returns an empty/null body on a 2xx, we retry
 * with exponential backoff up to maxRetries times.
 */
export const apiFetch = async (url, options = {}, maxRetries = 4) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };

  const config = { ...options, headers };

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, config);

      // Handle no-content response
      if (response.status === 204) return null;

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      // Server returned empty body — likely a cold start, retry
      if (data === null) {
        const waitMs = Math.min(1000 * 2 ** attempt, 15000); // 1s, 2s, 4s, 8s, 15s
        console.warn(`[API] Empty response on attempt ${attempt + 1}. Retrying in ${waitMs / 1000}s...`);
        if (attempt < maxRetries) {
          await sleep(waitMs);
          continue;
        }
        throw new Error("Server is waking up. Please try again in a moment.");
      }

      return data;
    } catch (error) {
      // Don't retry on real HTTP errors (4xx, 5xx with body)
      if (error.message !== "Server is waking up. Please try again in a moment." &&
          !error.message.includes("waking up") &&
          !error.message.includes("Failed to fetch") &&
          !error.message.includes("NetworkError")) {
        console.error(`[API Error] ${url}:`, error.message);
        throw error;
      }
      lastError = error;
      if (attempt < maxRetries) {
        const waitMs = Math.min(1000 * 2 ** attempt, 15000);
        console.warn(`[API] Network error on attempt ${attempt + 1}. Retrying in ${waitMs / 1000}s...`);
        await sleep(waitMs);
      }
    }
  }

  console.error(`[API Error] ${url}:`, lastError?.message);
  throw lastError || new Error("Request failed after multiple retries.");
};
