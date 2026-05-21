import axios from "axios";

// Get backend URL from .env
const backendHost =
  process.env.REACT_APP_BACKEND?.replace(/\/+$/, "") || "";

if (!backendHost) {
  console.warn(
    "REACT_APP_BACKEND is not set. Falling back to local /api"
  );
}

const api = axios.create({
  // Do NOT add /api again
  baseURL: backendHost || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Fix file upload issue
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;