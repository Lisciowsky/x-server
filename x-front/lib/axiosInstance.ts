import axios from 'axios';
import { getToken } from './auth';

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/v1",
  baseURL: "http://dev-fastapi-alb-1218099270.eu-central-1.elb.amazonaws.com:8080/v1",
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
