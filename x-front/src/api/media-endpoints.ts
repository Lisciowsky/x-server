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