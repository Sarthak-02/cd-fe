import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // MUST match backend host
  withCredentials: true,              // ⬅️ enables cookies globally
});

export default api;
