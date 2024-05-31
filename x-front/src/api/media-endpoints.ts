import axiosInstance from "@/lib/axiosInstance";
import { PaginatedMediaResponse, GetMediaAccessResponse, GetPresignedUploadResponse, RegisterMediaResponse, GetUserMediaResponse } from "./models/media-responses";


export const getAllMedia = async (page = 1, page_size = 1): Promise<PaginatedMediaResponse> => {
  try {
    const response = await axiosInstance.get(`/media/all_media/`, {
      params: { page, page_size }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch media info due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const getSignedUrl = async (media_id: string): Promise<GetMediaAccessResponse> => {
  try {
    const response = await axiosInstance.get(`/media/access/${media_id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch video url due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const getUploadUrl = async (media_name: string): Promise<GetPresignedUploadResponse> => {
  try {
    const response = await axiosInstance.get(`/media/upload-url/${media_name}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to fetch video url due to a network or server error.";
    throw new Error(errorMessage);
  }
};

export const registerMedia = async (media_name: string): Promise<RegisterMediaResponse> => {
  try {
    const response = await axiosInstance.get(`/media/register_media/${media_name}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed registering media";
    throw new Error(errorMessage);
  }
};

export const getUserMedia = async (page = 1, page_size = 10): Promise<GetUserMediaResponse> => {
  try {
    const response = await axiosInstance.get("/media/user_media", {
      params: { page, page_size }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to get the user media";
    throw new Error(errorMessage);
  }
};

export const deleteMediaById = async (media_id: string, media_name: string) => {
  try {
    const response = await axiosInstance.delete(`/media/${media_id}/${media_name}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || "Failed to delete media";
    throw new Error(errorMessage);
  }
};

