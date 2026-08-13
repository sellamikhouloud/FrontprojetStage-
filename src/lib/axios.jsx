import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000",

  // Allows browser cookies to be sent/received.
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// GET CSRF TOKEN FROM COOKIE
function getCSRFToken() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");

    if (name === "csrftoken") {
      return decodeURIComponent(value);
    }
  }

  return null;
}

// GET CSRF COOKIE FROM BACKEND
export async function fetchCSRFToken() {
  await api.get("/api/auth/csrf/");
}

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // FormData
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      delete config.headers["Content-Type"];
    }

    const url = config.url || "";

    const isLoginRequest =
      url.includes("/api/auth/login/");

    const isLogoutRequest =
      url.includes("/api/auth/logout/");

    const isRefreshRequest =
      url.includes("/api/auth/refresh/");

    if (
      isLoginRequest ||
      isLogoutRequest ||
      isRefreshRequest
    ) {
      const csrfToken = getCSRFToken();

      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// REFRESH TOKEN STATE
let isRefreshing = false;
let queue = [];

// PROCESS QUEUED REQUESTS
const processQueue = (error = null) => {
  queue.forEach(({ resolve, reject, original }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(original));
    }
  });

  queue = [];
};

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const original = error.config;

    // No response from server
    if (!error.response) {
      return Promise.reject(error);
    }

    // We only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // No original request
    if (!original) {
      return Promise.reject(error);
    }

    // Never retry the same request twice
    if (original._retry) {
      return Promise.reject(error);
    }

    // AUTH ENDPOINTS
    const requestUrl = original.url || "";

    const isLoginRequest =
      requestUrl.includes("/api/auth/login/");

    const isLogoutRequest =
      requestUrl.includes("/api/auth/logout/");

    const isRefreshRequest =
      requestUrl.includes("/api/auth/refresh/");

    const isMeRequest =
      requestUrl.includes("/api/auth/me/");

    const isCSRFRequest =
      requestUrl.includes("/api/auth/csrf/");

    // NEVER REFRESH THESE REQUESTS
    if (
      isLoginRequest ||
      isLogoutRequest ||
      isRefreshRequest ||
      isMeRequest ||
      isCSRFRequest
    ) {
      return Promise.reject(error);
    }

    // NORMAL AUTHENTICATED REQUEST
    original._retry = true;

    // Another request is already refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve,
          reject,
          original,
        });
      });
    }

    // Start refresh
    isRefreshing = true;

    try {
      await fetchCSRFToken();

      await api.post("/api/auth/refresh/");

      // Refresh succeeded.
      processQueue();

      // Retry original request.
      return api(original);
    } catch (refreshError) {
      // Refresh failed.
      processQueue(refreshError);

      // Session is no longer valid.
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;