import { FC } from 'react';
import VideoPlayer from '@src/components/VideoPlayer';

interface IGetYouTubeVideoProps {
  videoId: string | null
  videoName?: string | null
}

export const GetYouTubeVideo: FC<IGetYouTubeVideoProps> = ({ videoId, videoName }): JSX.Element => {
  return (
    <VideoPlayer videoURL={`https://youtube.com/watch?v=${videoId}`} videoName={videoName ? videoName : 'YouTube Video'} />
  );
};

export default GetYouTubeVideo;
