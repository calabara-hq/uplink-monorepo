"use client";
import React, { createContext, useContext, useState } from "react";

interface VideoContextProps {
  playingId: string | null;
  setPlayingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ playingId, setPlayingId }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
