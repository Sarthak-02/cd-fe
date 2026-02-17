import axios from "axios";
import {useAuth} from "../store/auth.store"

const api = axios.create({
  baseURL: '/onboarding',   // Use proxy path for dev, or full URL for production via env var
  withCredentials: true,              // ⬅️ enables cookies globally
});


api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.status === 401) {
      
      const token = (localStorage.getItem("token") == "true") || false

      const {logout} = useAuth.getState()
      if (token){
        logout()
      }
      
      
    }

    return Promise.reject(error);
  }
);

export default api;
