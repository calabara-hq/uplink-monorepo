"use client";
import React, { useState, useEffect } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { useInView } from "react-intersection-observer";
import { useVideoContext } from "@/providers/VideoProvider";
import dynamic from "next/dynamic";
import Image from "next/image";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPreviewProps {
  url: string;
  id: string;
  thubmnailUrl?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  url,
  id,
  thubmnailUrl,
}) => {
  const [mute, setMute] = useState<boolean>(true);
  const size = useWindowSize();
  const { playingId, setPlayingId } = useVideoContext();
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (size.width && size.width <= 768 && inView) {
      setPlayingId(id);
    }
  }, [inView, setPlayingId, id, size]);

  const handleMouseEnter = (): void => {
    if (size.width && size.width > 768) {
      setPlayingId(id);
    }
  };

  const handleMouseLeave = (): void => {
    if (size.width && size.width > 768) {
      setPlayingId(null);
    }
  };

  const handleMute = (): void => {
    setMute(!mute);
  };

  return (
    <div
      ref={ref}
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {thubmnailUrl && playingId !== id && (
        <div className="absolute inset-0">
          <Image
            src={thubmnailUrl}
            alt="nonsense"
            fill
            className="rounded-t-xl object-fit w-full"
          />
        </div>
      )}
      <ReactPlayer
        url={url}
        muted={mute}
        playing={playingId === id}
        width="100%"
        height="100%"
        className="rounded-lg"
      />
      {playingId === id && (
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-50 rounded-full p-2"
          onClick={handleMute}
        >
          {mute ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  );
};

export default VideoPreview;
