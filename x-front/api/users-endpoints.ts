import axiosInstance from "../lib/axiosInstance";
import { PaginatedUsersResponse } from "@/models/user";
import { UserInfo, CreateUserResponse } from "@/models/user";

export const fetchUserInfo = async (username: string): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);

    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("Failed to fetch user info due to a network or server error.");
    }
  }
};

export const fetchAllUsersInfo = async (page: number, page_size: number): Promise<PaginatedUsersResponse> => {
  try {
    const response = await axiosInstance.get(`/admin/all_users?page=${page}&page_size=${page_size}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const updateUserInfo = async (username: string, fullname: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/users/${username}`, { fullname });
    if (response.status !== 200) {
      throw new Error("Unexpected server response");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to update user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const updateUserPassword = async (username: string, password: string, current_password: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/users/${username}`, { current_password: current_password, password:password });
    if (response.status !== 200) {
      throw new Error("Unexpected server response");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to change password due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export interface UserSearchRequest {
  searchField: string;
}

export const searchUser = async (searchRequest: UserSearchRequest): Promise<CreateUserResponse[]> => {
  try {
    const response = await axiosInstance.post(`/users/search_user`, searchRequest);
    return response.data;
  } catch (error) {
    console.error('Failed to search users:', error);
    const errorMessage = error.response?.data?.detail || "Failed to search users due to a network or server error.";
    throw new Error(errorMessage);
  }
};