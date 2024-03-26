import axios from 'axios';

// baseURL should point to your server's address
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1",
  // baseURL: "https://api.szumi-dev.com/v1",
  withCredentials: true, // Ensure cookies are sent with each request
});

// Remove interceptors that manually set the Authorization header
// axiosInstance.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default axiosInstance;
