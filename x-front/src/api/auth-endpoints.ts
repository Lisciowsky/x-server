import axiosInstance from "../lib/axiosInstance";

import { UpdateUserResponse, PaginatedUsersResponse } from "@/api/models/admin-responses";
import { User } from "@/api/models/user";

export interface UpdateUserRequest {
  role: string
}

export const updateUserRole = async (username: string, updateRequest: UpdateUserRequest): Promise<UpdateUserResponse> => {
  try {
    const response = await axiosInstance.put(`/admin/update_role/${username}`, updateRequest);
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to update user role due to a network or server error.";
    throw new Error(errorMessage);
  }
};


export const fetchAllUsersInfo = async (page: number, page_size: number): Promise<PaginatedUsersResponse> => {
  try {
    const response = await axiosInstance.get(`/admin/all_users?page=${page}&page_size=${page_size}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch users due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export interface UserSearchRequest {
  searchField: string;
}

export const searchUser = async (searchRequest: UserSearchRequest): Promise<User[]> => {
  try {
    const response = await axiosInstance.post(`/admin/search_user`, searchRequest);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to search users due to a network or server error.";
    throw new Error(errorMessage);
  }
};
