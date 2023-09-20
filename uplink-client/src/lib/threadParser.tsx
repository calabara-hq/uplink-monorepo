import { TwitterSubmission } from "@/providers/ContestInteractionProvider";
import { ImageWrapper, VideoWrapper } from "@/ui/Submission/MediaWrapper";
import Image from "next/image";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaPosterImage,
  MediaLoadingIndicator,
} from "media-chrome/dist/react";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";

export const ParseThread = ({
  thread,
  omitImages = false,
}: {
  thread: TwitterSubmission["data"]["thread"];
  omitImages?: boolean;
}) => {
  if (!thread || thread.length === 0) return null;
  console.log(thread);
  return thread.map((tweet, index) => {
    return (
      <>
        {tweet.text && <p key={index}>{tweet.text}</p>}
        {tweet.previewAsset &&
          !omitImages &&
          (tweet.videoAsset ? (
            // render video
            <div className="w-9/12 m-auto pt-4 pb-4" key={index}>
              <VideoWrapper key={index}>
                <MediaController className="w-full h-fit aspect-video bg-transparent">
                  <video
                    autoPlay={false}
                    playsInline
                    slot="media"
                    src={tweet.videoAsset}
                    preload="auto"
                    crossOrigin=""
                    className="w-full aspect-video object-cover rounded-xl"
                    poster={tweet.previewAsset}
                  />
                  <MediaLoadingIndicator slot="centered-chrome" />

                  <div className="flex flex-col items-end justify-end w-full m-auto bg-gradient-to-t from-black rounded-b-xl">
                    <div className="flex w-full h-8 cursor-pointer">
                      <MediaTimeRange className="bg-transparent w-full"></MediaTimeRange>
                    </div>
                    <div className="flex w-full">
                      <MediaPlayButton className="bg-transparent"></MediaPlayButton>
                      <MediaMuteButton className="bg-transparent">
                        <span slot="high">
                          <HiOutlineVolumeUp className="h-6 w-6 text-t1" />
                        </span>
                        <span slot="off">
                          <HiOutlineVolumeOff className="h-6 w-6 text-t1" />
                        </span>
                      </MediaMuteButton>
                      <MediaTimeDisplay
                        showDuration
                        noToggle
                        className="bg-transparent"
                      />
                      <MediaFullscreenButton className="bg-transparent ml-auto" />
                    </div>
                  </div>
                </MediaController>
              </VideoWrapper>
            </div>
          ) : (
            <div className="w-9/12 m-auto pt-4 pb-4" key={index}>
              <ImageWrapper>
                <Image
                  key={index}
                  src={tweet.previewAsset}
                  alt="content media"
                  fill
                  className="object-contain rounded-xl w-full h-full overflow-hidden"
                  sizes="80vw"
                />
              </ImageWrapper>
            </div>
          ))}
      </>
    );

    if (tweet.text) {
      return <p key={index}>{tweet.text}</p>;
    }
    if (tweet.previewAsset && !omitImages) {
      if (tweet.videoAsset) {
        // render video
      } else {
        // render plain image
        return (
          <div className="w-9/12 m-auto pt-4 pb-4" key={index}>
            <ImageWrapper>
              <Image
                key={index}
                src={tweet.previewAsset}
                alt="content media"
                fill
                className="object-contain rounded-xl w-full h-full overflow-hidden"
                sizes="80vw"
              />
            </ImageWrapper>
          </div>
        );
      }
    }
  });
};
