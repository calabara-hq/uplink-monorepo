// Render the submission in a large format. This is used for modals and the submission page.
import type { Submission } from "@/types/submission";
import UplinkImage from "@/lib/UplinkImage"
const ParseBlocks = dynamic(() => import("@/lib/blockParser"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-2 w-full">
      <div className="shimmer h-4 w-64 bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
      <div className="shimmer h-4 w-full bg-base-200 rounded-lg" />
    </div>
  )
});
import { ParseThread } from "@/lib/threadParser";
import { ImageWrapper } from "./MediaWrapper";
import { UsernameDisplay, UserAvatar } from "../AddressDisplay/AddressDisplay";
import dynamic from "next/dynamic";
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";

// nextjs 13.5.2 complains about the video component in ssr

const RenderSubmissionBody = ({ submission }: { submission: Submission }) => {
  return (
    <div>
      <section className="break-words">
        {submission.type === "twitter" ? (
          <ParseThread thread={submission.data.thread} />
        ) : (
          <ParseBlocks data={submission.data.body} />
        )}
      </section>
    </div>
  );
};

const RenderImageSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <ImageWrapper>
      <UplinkImage
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        alt="submission image"
        fill
        sizes="40vw"
        className="object-contain rounded-xl w-full h-full overflow-hidden"
      />
    </ImageWrapper>
  );
};

const RenderVideoSubmission = ({ submission }: { submission: Submission }) => {
  const videoUrl =
    submission.type === "twitter"
      ? submission.data.thread[0].videoAsset
      : submission.data.videoAsset;
  const posterUrl =
    submission.type === "twitter"
      ? submission.data.thread[0].previewAsset
      : submission.data.previewAsset;

  return <RenderStandardVideoWithLoader {...{ videoUrl, posterUrl }} />;
};

/**
 *
 * std submission
 * - render the image or video if present, then render the body
 * twitter submission
 * - render the whole thread
 * this should be optimized in the future. we have to do this now because threads have many items whereas standard submissions are partitioned by block
 */

const SubmissionRenderer = ({ submission }: { submission: Submission }) => {
  if (submission.type === "standard") {
    return (
      <div className="space-y-4">
        <div className="w-full m-auto">
          {submission.data.type === "image" && (
            <div>
              <RenderImageSubmission submission={submission} />
            </div>
          )}
          {submission.data.type === "video" && (
            <div>
              <RenderVideoSubmission submission={submission} />
            </div>
          )}
        </div>
        <RenderSubmissionBody submission={submission} />
      </div>
    );
  } else if (submission.type === "twitter") {
    return (
      <div>
        <RenderSubmissionBody submission={submission} />
      </div>
    );
  }
  return null;
};

const ExpandedSubmission = ({
  submission,
  headerChildren,
}: {
  submission: Submission;
  headerChildren?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-t1 font-[500]">{submission.data.title}</h2>
        <div className="flex flex-row items-center h-8">
          <div className="flex gap-2 items-center">
            <UserAvatar user={submission.author} size={28} />
            <h3 className="break-all italic text-sm text-t2 font-semibold">
              <UsernameDisplay user={submission.author} />
            </h3>
          </div>
          {headerChildren}
        </div>
      </div>
      <div className="w-full h-0.5 bg-base-200" />
      <SubmissionRenderer submission={submission} />
    </div>
  );
};

export default ExpandedSubmission;
