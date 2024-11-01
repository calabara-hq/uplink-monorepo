import type { TwitterSubmission } from "@/types/submission";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import OptimizedImage from "@/lib/OptmizedImage"
const createLinks = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const twitterRegex = /([^\S]|^)@(\w+)/gi;
  return text
    .replace(urlRegex, (url) => {
      const dispUrl = url.replace(/(^\w+:|^)\/\//, ""); // drop protocol from url
      return `<a target="_blank" href="${url}">${dispUrl}</a>`;
    })
    .replace(twitterRegex, (handle) => {
      const linkUrl = `https://twitter.com/${handle.replace(" ", "")}`;
      return `<a target="_blank" href="${linkUrl}">${handle}</a>`;
    });
};

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
            {tweet.text && <p className="text-t1 hyperlinks" key={index} dangerouslySetInnerHTML={{ __html: sanitizeHtml(createLinks(tweet.text)) }}></p>}
            {tweet.previewAsset &&
              !omitImages &&
              (tweet.videoAsset ? (
                // render video
                <RenderStandardVideoWithLoader
                  videoUrl={tweet.videoAsset}
                  posterUrl={tweet.previewAsset}
                />
              ) : (
                <div className="w-full m-auto pt-4 pb-4">
                  <ImageWrapper>
                    <OptimizedImage
                      key={index}
                      src={tweet.previewAsset}
                      alt="content media"
                      fill
                      className="object-contain rounded-xl w-full h-full overflow-hidden"
                      sizes="40vw"
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
