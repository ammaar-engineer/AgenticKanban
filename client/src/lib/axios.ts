import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        `→ ${error.response.status}`,
        error.response.data?.message ?? error.message,
      );
    } else if (error.request) {
      console.error(`[API Error] No response from ${error.config?.url}`, error.message);
    } else {
      console.error("[API Error]", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
