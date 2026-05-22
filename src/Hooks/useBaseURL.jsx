// src/Hooks/useAPI.js
import axios from "axios";

const useBaseURL = () => {
  const api = axios.create({
    baseURL: "https://iptv-backend-bcd1.onrender.com",
  });

  return api;
};

export default useBaseURL;
