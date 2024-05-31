import { useAlert } from "@/context/alert-context";
import { getUploadUrl, getUserMedia, registerMedia } from '@/api/media-endpoints';
import { Media } from "@/api/models/media";

const useMediaUpload = () => {
    const { showAlert } = useAlert();

    const upload = async (mediaName: string, file: File) => {
        let uploadUrl;
        let response;
        let exists;

        try{
            const userMedia = await getUserMedia(1, 1000)
            exists = userMedia.media.some((media: Media) => media.media_name === mediaName);
        } catch (error) {
            showAlert('Failed to get user media', "", "warning");
            return null;
        }

        if (exists) {
            showAlert(`Media ${mediaName} already exists`, "", "warning");
            return null
        }

        try {
            response = await getUploadUrl(mediaName);
            uploadUrl = response.url;
        } catch (error) {
            showAlert('Failed to get uploadUrl', "", "warning");
            return null;
        }

        try {
            response = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (response.ok) {

                try {
                    await registerMedia(mediaName)
                } catch (error) {
                    showAlert('Failed registering media: ' + mediaName, "", "warning");
                    return null;
                }
                showAlert('Uploaded and registered: ' + mediaName, "", "success");
                return true;

            } else {
                showAlert('Upload failed with HTTP status ' + response.status, "", "warning");
                return null;
            }

        } catch (error) {
            console.error('Upload failed:', error);
            showAlert(`Failed uploading media ${mediaName}`, "", "warning");
            return null;
        }
    };

    return { upload };
};

export default useMediaUpload;
