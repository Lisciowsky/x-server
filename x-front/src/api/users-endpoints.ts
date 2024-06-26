import axiosInstance from "../lib/axiosInstance";

import { GetUserResponse, UpdateUserRequest, CreateUserResponse } from "@/api/models/user-responses";
import { UserInfo } from "@/api/models/user";

export const fetchUserInfo = async (username: string): Promise<GetUserResponse> => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const updateUserInfo = async (username: string, updateUserRequest: UpdateUserRequest): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.put(`/users/${username}`, updateUserRequest);
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to update user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export interface CreateUserRequest {
  username: string
  password: string
  fullname: string
  email: string
}

export const createUser = async (createUserRequest: CreateUserRequest): Promise<CreateUserResponse> => {
  try {
    const response = await axiosInstance.post("/users/", createUserRequest);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to sing up user due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export interface LoginUserRequest {
  username: string
  password: string
}


export const loginUser = async (loginRequest: LoginUserRequest): Promise<void> => {
  try {
    await axiosInstance.post("/users/login", loginRequest);
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to log in user due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/users/logout");
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to log out due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const checkSession = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get("/users/session/check");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to check session due to a network or server error.";
    throw new Error(errorMessage);
  }
};
