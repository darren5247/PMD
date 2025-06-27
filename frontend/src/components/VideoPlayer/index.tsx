import { FC } from "react";
import { useCookieConsent } from "@src/context/CookieConsentContext";

import cn from "classnames";

interface IVideoPlayerProps {
  videoURL: string | undefined;
  videoName: string | undefined;
  className?: string | undefined;
}

export const VideoPlayer: FC<IVideoPlayerProps> = ({
  videoURL,
  videoName,
  className,
}): JSX.Element => {
  const { cookieConsent, shouldShowBanner, setShouldShowBanner } =
    useCookieConsent();

  const handleAcceptCookies = () => {
    setShouldShowBanner(true);
  };

  if (!cookieConsent?.marketing) {
    return (
      <div className="flex flex-col justify-center items-center bg-pmdGrayLight p-8 rounded-md w-[100%] md:w-full sm:h-[350px] min-[450px]:h-[300px] md:h-[382px] min-h-[198px]">
        <h3 className="mb-4 text-center">Want to watch videos?</h3>
        <p className="text-justify">
          YouTube videos use cookies to show you personalized ads.
        </p>
        <p className="mb-4 text-justify">
          To watch videos, you must consent to <em>Marketing Cookies</em>.
        </p>
        <a
          title="Change Cookie Preferences"
          aria-label="Change Cookie Preferences"
          aria-haspopup="dialog"
          aria-expanded={shouldShowBanner}
          aria-controls="cookieConsent"
          className="cursor-pointer button"
          onClick={handleAcceptCookies}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleAcceptCookies();
            }
          }}
          tabIndex={0}
        >
          Change Cookie Preferences
        </a>
      </div>
    );
  }

  const getYTVideoID = /([a-z0-9_-]{11})/gim;
  const YTVideoIdArray = videoURL?.match(getYTVideoID);
  const getYTVStartSecond = /[?&](?:t|start)=([^&]+)/;
  const startSecondMatch = videoURL?.match(getYTVStartSecond);
  const startSecond = startSecondMatch ? startSecondMatch[1] : "";

  return (
    <div className={cn("flex flex-col px-3", className)}>
      <iframe
        src={
          `https://youtube.com/embed/` +
          (YTVideoIdArray ? `${YTVideoIdArray[0]}` : "") +
          (startSecond ? `?start=${startSecond}` : "")
        }
        style={{ border: 0 }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={videoName ? videoName : "YouTube Video"}
        className="rounded-md w-[100%] md:w-full sm:h-[350px] min-[450px]:h-[300px] md:h-[382px] min-h-[198px]"
      />
    </div>
  );
};

export default VideoPlayer;
