import axios from "axios";

// Build backend base URL robustly. If REACT_APP_BACKEND is set, use it
// (trim trailing slash). Otherwise fall back to relative '/api' so local
// development still works.
const rawBackend = process.env.REACT_APP_BACKEND || "";
let backendHost = rawBackend ? rawBackend.replace(/\/+$/, "") : "";
if (!backendHost) {
  // eslint-disable-next-line no-console
  console.warn(
    'REACT_APP_BACKEND is not set. Frontend will call relative /api paths.\n' +
      'For a deployed frontend, set REACT_APP_BACKEND to your Render backend URL (for example https://your-service.onrender.com) and redeploy.'
  );
}

const api = axios.create({
  baseURL: backendHost ? `${backendHost}/api` : '/api',
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, let the browser set the Content-Type header
    // (including the multipart boundary). The instance default is
    // application/json, which would break multipart uploads.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
