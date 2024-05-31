import { useState } from "react";
import useUserMedia from "../../hooks/use-user-media";
import useEffectOnce from "@/common/hooks/use-effect-once";
import { Media } from "@/api/models/media";
import { Button } from "@/common/components/ui/button";
import { TrashIcon } from "@heroicons/react/outline";
import ReactPlayer from "react-player";
import useVideo from "@/features/feed/hooks/use-video";

const UserMedia = () => {
  const { media, deleteMedia } = useUserMedia();
  const [userMedia, setUserMedia] = useState<Media[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [watchUrl, setWatchUrl] = useState("");
  const { getMediaSignedUrl } = useVideo();

  useEffectOnce(() => {
    const getMedia = async () => {
      const { media: mediaList, total: totalMedia } = await media(page, pageSize);
      setUserMedia(mediaList);
      setTotal(totalMedia);
    };

    getMedia();
  }, [page, pageSize]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const { media: mediaList, total: totalMedia } = await media(nextPage, pageSize);
    setUserMedia(prev => [...prev, ...mediaList]);
    setPage(nextPage);
    setTotal(totalMedia);
  };

  const handleDelete = async (mediaId: string, mediaName: string) => {
    const success = await deleteMedia(mediaId, mediaName);
    if (success !== null) {
      setUserMedia(prevMedia => prevMedia.filter(m => m.id !== mediaId));
    }
  };

  const handleMediaClick = async (media: Media) => {
    if (selectedMediaId === media.id) {
      setSelectedMediaId(null);
      setWatchUrl("");
    } else {
      const signedUrl = await getMediaSignedUrl(media.id);
      setSelectedMediaId(media.id);
      setWatchUrl(signedUrl?.signed_url || "");
    }
  };

  const MediaDisplay = ({ media }) => {
    return (
      <div
        onClick={() => handleMediaClick(media)}
        className="hover:cursor-pointer"
      >
        {media.media_name} | {media.id}
      </div>
    );
  };

  const Player = () => {
    return selectedMediaId && (
        <ReactPlayer
          url={watchUrl}
          playing={true}
          controls={true}
          loop={true}
          width={"30%"}
          height={"100%"}
        />
    );
  };

  return (
    <>
      <div className="w-full">
        <div>
          {userMedia.map((media, index) => (
            <div key={index} className="flex justify-between items-center">
              <MediaDisplay media={media} />
              <TrashIcon className="h-6 hover:cursor-pointer" onClick={() => handleDelete(media.id, media.media_name)} />
            </div>
          ))}
        </div>
        {userMedia.length < total && (
          <div className="justify-center flex">
            <Button onClick={loadMore}>Load More</Button>
          </div>
        )}
        {userMedia.length === 0 && <p>No media found.</p>}
        <div className="flex justify-center mt-10">

          <Player />
        </div>
      </div>
    </>
  );
};

export default UserMedia;