import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useApi = () => {
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "https://ip-backend-five.vercel.app",
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor (auto logout if 401/403)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Token missing or invalid → logout
        localStorage.removeItem("token");
        navigate("/login");
        toast.error("Session expired, please login again!");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApi;
