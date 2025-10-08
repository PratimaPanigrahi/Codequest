// src/api/axios.js
import axios from "axios";
import { getToken, removeToken } from "../utils/tokenHelper.js";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      // Optional: redirect manually in your login page or ProtectedRoute
    }
    return Promise.reject(error);
  }
);

export default api;
