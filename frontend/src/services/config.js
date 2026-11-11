import axios from "axios";

export const BACKEND_URL = "https://quick-switch-backend.onrender.com";

const api_client = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api_client;
