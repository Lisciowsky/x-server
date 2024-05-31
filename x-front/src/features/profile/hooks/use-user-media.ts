import { useAlert } from "@/context/alert-context"
import { getUserMedia, deleteMediaById } from "@/api/media-endpoints"
import { Media } from "@/api/models/media";

const useUserMedia = () => {
    const { showAlert } = useAlert();
    const media = async (page = 1, page_size = 10): Promise<{ media: Media[], total: number }> => {
        try {
            const response = await getUserMedia(page, page_size);
            return { media: response.media, total: response.total_media };
        } catch (error) {
            showAlert(error.toString(), "", "warning");
            return { media: [], total: 0 };
        }
    }
    const deleteMedia = async (mediaId: string, mediaName: string) => {
        try {
            await deleteMediaById(mediaId, mediaName);
            showAlert("Media deleted successfully", "", "success");
        } catch (error) {
            showAlert(error.toString(), "", "warning");
            return null
        }
    }

    return { media, deleteMedia };
}

export default useUserMedia