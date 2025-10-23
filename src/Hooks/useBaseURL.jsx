// src/Hooks/useAPI.js
import axios from "axios";

const useBaseURL = () => {
  const api = axios.create({
    baseURL: "http://localhost:4000",
  });

  return api;
};

export default useBaseURL;
