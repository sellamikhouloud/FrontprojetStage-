import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
(res) => res,
  
async (error) => {
const original = error.config;
if (error.response?.status !== 401 || original._retry) {
return Promise.reject(error);
}
  
if (original.url?.includes("/api/auth/refresh/")) {
return Promise.reject(error);
}
  
original._retry = true;
if (isRefreshing) {
return new Promise((resolve, reject) => {
queue.push({ resolve, reject, original });
});
}

  isRefreshing = true;
try {
await api.post("/api/auth/refresh/");
queue.forEach(({ resolve, original: o }) => resolve(api(o)));
queue = [];
return api(original);
} catch (refreshError) {
queue.forEach(({ reject }) => reject(refreshError));
queue = [];
window.location.href = "/";
return Promise.reject(refreshError);
} finally {
isRefreshing = false;
}
}
);

export default api;
