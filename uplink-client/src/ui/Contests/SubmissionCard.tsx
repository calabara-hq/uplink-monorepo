"use client";
import { VideoProvider } from "@/providers/VideoProvider";
import VideoPreview from "../VideoPlayer/VideoPlayer";

export const VideoSubmissionCard = ({ data }: { data: any }) => {
  return (
    <VideoProvider>
      <VideoPreview url={data.videoAsset} id={data.id} />
    </VideoProvider>
  );
};
