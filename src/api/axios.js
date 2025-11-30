import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",   // MUST match backend host
  withCredentials: true,              // ⬅️ enables cookies globally
});

export default api;
