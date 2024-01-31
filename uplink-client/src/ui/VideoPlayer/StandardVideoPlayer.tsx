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
import {transformVideoAsset} from './index'
import {useRef, useEffect} from 'react';

const StandardVideoPlayer = ({ videoUrl, posterUrl }: { videoUrl: string, posterUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoBase64 = !videoUrl.startsWith('http')
  const isPosterBase64 = !posterUrl.startsWith('http')


    useEffect(() => {
      videoRef.current.addEventListener("error", () => {
        console.log('error loading video, switching to unoptimized url')
        videoRef.current.src = videoUrl
      })
    },[])

  return (
    <MediaController className="w-full h-fit animate-fadeIn rounded-2xl">
      <video
        ref={videoRef}
        autoPlay={false}
        playsInline
        slot="media"
        src={videoUrl ? isVideoBase64 ? videoUrl : transformVideoAsset(videoUrl, 'video', 600) : null}
        preload="auto"
        crossOrigin=""
        className="rounded-2xl aspect-video"
        poster={posterUrl ? isPosterBase64 ? posterUrl : transformVideoAsset(posterUrl, 'image', 600) : null}
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
