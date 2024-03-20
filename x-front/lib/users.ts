import axiosInstance from "./axiosInstance";
import { PaginatedUsersResponse } from "@/models/user";

export const fetchAllUsersInfo = async (page: number, page_size: number): Promise<PaginatedUsersResponse> => {
    try {
      const response = await axiosInstance.get(`/admin/all_users?page=${page}&page_size=${page_size}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  };