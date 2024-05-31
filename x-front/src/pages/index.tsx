import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { getAllMedia, getSignedUrl } from "@/api/media-endpoints";
import { Button } from '@/common/components/ui/button';
import { Media } from '@/api/models/media';
import { useAuth } from '@/context/auth-context';
import { formatDate } from '@/common/helpers/convert-date';


export default function Home() {
  const { isLoggedIn } = useAuth()
  const [mediaUrl, setMediaUrl] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState<Media>()
  const [totalMedia, setTotalMedia] = useState(999999)

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      try {
        const mediaData = await getAllMedia(page);
        setTotalMedia(mediaData.total_media)
        if (mediaData?.media.length > 0) {
          const firstMedia = mediaData.media[0];
          setMedia(firstMedia)
          const signedUrl = await getSignedUrl(firstMedia.id);
          setMediaUrl(signedUrl.signed_url)
        }
      } catch (error) {
        console.error('Failed to load media:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [page]);

  if (!isLoggedIn) {
    return <></>
  }

  const handleRightArrow = () => {
    setPage(prevPage => prevPage + 1);
  }

  const handleLeftArrow = () => {
    setPage(prevPage => prevPage - 1);
  };

  const Player = () => {

    return <>{!loading ?

      <ReactPlayer
        url={mediaUrl}
        playing={true}
        controls={true}
        loop={true}
        width={"100%"}
        height={"100%"}
      />
      : <p className='justify-center'></p>
    }
    </>
  }

  const Item = () => {
    return <>
      <div className='text-rich-black container flex justify-center font-extralight mb-1 md:text-xl'>
        <h1>{media?.media_owner} @ {media?.created_at ? formatDate(media.created_at) : 'Loading...'}</h1>
      </div>
      <div className='rounded-2xl overflow-auto md:max-w-[450px]'>
        <Player />
      </div>
    </>

  }

  if (totalMedia === 0) {
    return <p className='flex justify-center'>No media to display</p>
  }


  return (
    <>
      <div className='flex justify-center text-rich-black items-center md:mt-20 md:mb-20'>
        <div className='flex flex-row flex-wrap max-h-full justify-between m-2 md:flex-col md:justify-center'>
          <Item />
          <div className='grid grid-flow-col w-full'>
            <Button className={`hover:bg-sunset-orange rounded-2xl bg-cultured ${page === 1 ? "hidden" : ""}`} onClick={handleLeftArrow}>Prev</Button>
            <Button className={`hover:bg-sunset-orange rounded-2xl bg-cultured ${page === totalMedia ? "hidden" : ""}`} onClick={handleRightArrow}>Next</Button>
          </div>
        </div>
      </div>
    </>
  );
}


