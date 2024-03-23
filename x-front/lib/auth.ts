import axiosInstance from "./axiosInstance";

import { UpdateUserResponse } from "@/models/user";

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
};

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

export const updateUserRole = async (username: string, role: string): Promise<UpdateUserResponse> => {
  try {
    const data = { role: role };
    const response = await axiosInstance.put(`/admin/update_role/${username}`, data);

    if (response.status === 200) {
      return response.data;
    } else {
      const error = new Error("Failed to update user role due to unexpected server response");
      error.response = response;
      throw error;
    }
  } catch (error) {
    console.error('Failed to update user role:', error);

    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("Please check your network connection and try again");
    }
  }
};
