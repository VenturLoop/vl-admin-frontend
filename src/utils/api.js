import axios from "axios";

const API_URL = "https://vl-admin.onrender.com/api/auth/";

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
});

// Login API request
export const login = (email, password) => {
  return api.post("login", { email, password });
};

export default api;
