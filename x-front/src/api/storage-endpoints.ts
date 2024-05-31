import { GetUserStorageResponse } from "@/api/models/storage-responses";
import { GetPresignedUrlResponse } from "@/api/models/storage-responses";
import axiosInstance from "@/lib/axiosInstance";

export const fetchUserStorage = async (username: string): Promise<GetUserStorageResponse> => {
    try {
      const response = await axiosInstance.get(`/storage/${username}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch user info due to a network or server error.";
      throw new Error(errorMessage);
    }
  };

export const getUploadUrl = async (username: string, file_path: string): Promise<GetPresignedUrlResponse> => {
  try {
    const response = await axiosInstance.get(`/storage/upload-url/${username}/${file_path}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const getDownloadUrl = async (username: string, file_path: string): Promise<GetPresignedUrlResponse> => {
  try {
    const response = await axiosInstance.get(`/storage/download-url/${username}/${file_path}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const deleteStorage = async (username: string, file_path: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/storage/delete/${username}/${file_path}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch user info due to a network or server error.";
    throw new Error(errorMessage);
  }
};
