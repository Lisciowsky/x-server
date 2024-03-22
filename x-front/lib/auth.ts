// utils/auth.js
import axiosInstance from "./axiosInstance";
import { UserInfo } from "@/models/user";

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('access_token');
  const storedUsername = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const refresh_token = localStorage.getItem('refresh_token');
  
  if (token && storedUsername && role && refresh_token) {
    return true
  }
  return false
}

export const fetchUserInfo = async (username: string): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const updateUserRole = async (username: string, role: string): Promise<UserInfo> => {
  try {
    const data = {role: role}
    const response = await axiosInstance.put(`/admin/update_role/${username}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};