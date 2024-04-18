import axios from 'axios';
import { handleGlobalLogout } from './auth';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1",
  // baseURL: "https://api.szumi-dev.com/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(response => response, async (error) => {
  const { config, response } = error;
  const originalRequest = config;
  if (response && response.status === 401 && !originalRequest._retry && !originalRequest.url.endsWith('/refresh_token')) {
    originalRequest._retry = true;
    try {
      await axiosInstance.post('/users/refresh_token');
      return axiosInstance(originalRequest);
    } catch (err) {
      await handleGlobalLogout();
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

export default axiosInstance;
