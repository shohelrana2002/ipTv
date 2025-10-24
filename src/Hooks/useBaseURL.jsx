// src/Hooks/useAPI.js
import axios from "axios";

const useBaseURL = () => {
  const api = axios.create({
    baseURL: "https://ip-backend-five.vercel.app",
  });

  return api;
};

export default useBaseURL;
