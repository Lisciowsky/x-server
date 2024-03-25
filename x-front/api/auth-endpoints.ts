import axiosInstance from "../lib/axiosInstance";

import { UpdateUserResponse } from "@/models/user";

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
