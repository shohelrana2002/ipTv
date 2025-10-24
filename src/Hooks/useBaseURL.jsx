// src/Hooks/useAPI.js
import axios from "axios";

const useBaseURL = () => {
  const api = axios.create({
    baseURL:
      "https://ip-backend-bzakicfac-md-shohel-ranas-projects-06915b1a.vercel.app",
  });

  return api;
};

export default useBaseURL;
