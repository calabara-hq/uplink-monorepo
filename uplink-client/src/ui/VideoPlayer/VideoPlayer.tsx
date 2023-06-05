"use client";
import React, { useState, useEffect } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { useInView } from "react-intersection-observer";
import { useVideoContext } from "@/providers/VideoProvider";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPreviewProps {
  url: string;
  id: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ url, id }) => {
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
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
