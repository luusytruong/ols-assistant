import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8080/api/v1",
  validateStatus: (status) => status >= 200 && status < 600,
});

export default api;
