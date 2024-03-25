import axios from 'axios';

import { getToken } from './auth';

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/v1",
  baseURL: "https://api.szumi-dev.com/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
