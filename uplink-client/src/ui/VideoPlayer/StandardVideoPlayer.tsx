"use client";
import {
  MediaController,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaLoadingIndicator,
} from "media-chrome/dist/react";
import { HiOutlineVolumeOff, HiOutlineVolumeUp } from "react-icons/hi";
import { VideoWrapper } from "../Submission/MediaWrapper";

const StandardVideoPlayer = ({ videoUrl, posterUrl }) => {
  return (
      <MediaController className="w-full h-fit aspect-video bg-transparent animate-fadeIn">
        <video
          autoPlay={false}
          playsInline
          slot="media"
          src={videoUrl}
          preload="auto"
          crossOrigin=""
          className="w-full aspect-video object-cover rounded-2xl"
          poster={posterUrl}
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
  );
};

export default StandardVideoPlayer;
