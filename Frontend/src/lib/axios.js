import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://crm-backend-bhuu.onrender.com/api/v1",
  withCredentials: true,
});
