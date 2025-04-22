import { store } from "@/store/persist_store";
import { clearUser } from "@/store/userslice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post('/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = '/';
        store.dispatch(clearUser())
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
