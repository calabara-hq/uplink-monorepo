import { TwitterSubmission } from "@/providers/ContestInteractionProvider";
import { ImageWrapper, VideoWrapper } from "@/ui/Submission/MediaWrapper";
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";
import Image from "next/image";

export const ParseThread = ({
  thread,
  omitImages = false,
}: {
  thread: TwitterSubmission["data"]["thread"];
  omitImages?: boolean;
}) => {
  if (!thread || thread.length === 0) return null;
  return (
    <>
      {thread.map((tweet, index) => {
        return (
          <div key={index}>
            {tweet.text && <p key={index}>{tweet.text}</p>}
            {tweet.previewAsset &&
              !omitImages &&
              (tweet.videoAsset ? (
                // render video
                <RenderStandardVideoWithLoader
                  videoUrl={tweet.videoAsset}
                  posterUrl={tweet.previewAsset}
                />
              ) : (
                <div className="w-9/12 m-auto pt-4 pb-4">
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
          </div>
        );
      })}
    </>
  );
};
