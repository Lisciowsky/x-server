import { getSignedUrl } from "@/api/media-endpoints"
import { useAlert } from "@/context/alert-context"

const useVideo = () => {

    const { showAlert } = useAlert()

    const getMediaSignedUrl = async (media_id: string) => {
        try {
            return await getSignedUrl(media_id)
        } catch (error) {
            showAlert("failed to get SignedUrl", "", "warning")
        }
    }


    return { getMediaSignedUrl }
}

export default useVideo