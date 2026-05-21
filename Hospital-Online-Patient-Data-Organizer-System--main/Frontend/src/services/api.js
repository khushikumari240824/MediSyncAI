import axios from "axios";

// Build backend base URL robustly. If REACT_APP_BACKEND is set, use it
// (trim trailing slash). Otherwise fall back to relative '/api' so local
// development still works. In deployed builds make sure to set
// REACT_APP_BACKEND to the backend host (e.g. https://my-backend.azurewebsites.net).
const rawBackend = process.env.REACT_APP_BACKEND || "";
let backendHost = rawBackend ? rawBackend.replace(/\/+$/, "") : "";
// Temporary fallback: if REACT_APP_BACKEND is not set in the hosting environment
// (common on Vercel if you didn't add env vars), use the deployed Azure backend
// URL you provided. This is a pragmatic fallback so the deployed frontend can
// reach the API immediately. Recommended: set REACT_APP_BACKEND in your host.
const FALLBACK_BACKEND = "https://hospitalmanage-csgrbmfweggcg7ak.centralindia-01.azurewebsites.net";
if (!backendHost) {
  // eslint-disable-next-line no-console
  console.warn(
    'REACT_APP_BACKEND is not set. Using temporary fallback backend:',
    FALLBACK_BACKEND,
    '\nPlease set REACT_APP_BACKEND in your hosting environment and redeploy to remove this fallback.'
  );
  backendHost = FALLBACK_BACKEND;
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
