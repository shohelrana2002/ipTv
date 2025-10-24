import axios from "axios";

const API = axios.create({
  baseURL:
    "https://ip-backend-bzakicfac-md-shohel-ranas-projects-06915b1a.vercel.app",
});

// Add JWT token to request headers if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
