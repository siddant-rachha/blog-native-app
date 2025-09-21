import { secureTokenManager } from "@/utils/secure-token-manager/secureTokenManager";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = secureTokenManager.getTokenFromMemory();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.EXPO_PUBLIC_ENABLE_AXIOS_LOGS === "true") {
      console.log(
        "➡️ Request:",
        config.method,
        config.url,
        config.data,
        config.headers.Authorization ? "✅" : "❌"
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.EXPO_PUBLIC_ENABLE_AXIOS_LOGS === "true") {
      console.log(
        "⬅️ Response:",
        response.status,
        response.config.url,
        response.data
      );
      console.log("--------------------------------------------------");
    }
    return response;
  },
  (error) => {
    // handle errors globally
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
