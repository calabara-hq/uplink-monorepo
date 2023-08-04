import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";
import Image from "next/image";

import { formatAddress } from "@/utils/formatAddress";
import {
  SubmissionTypeBadge,
  SubmissionVotesBadge,
  UserSubmissionSelectBadge,
} from "../SubmissionBadges/SubmissionBadges";

export const RenderSubmission = ({
  context,
  submissionType,
  title,
  author,
  video,
  thumbnail,
  image,
  text,
}: {
  context: "preview" | "live";
  submissionType: "video" | "image" | "text";
  title: string;
  author?: string;
  video?: string;
  thumbnail?: string;
  image?: string;
  text?: React.ReactNode; // can be editor data or simple <p> tag
}) => {
  if (submissionType === "video") {
    return (
      <div className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100">
        <RenderVideoCard video={video} thumbnail={thumbnail} />
        <SubmissionBody title={title} author={author} />
        <SubmissionFooter {...{ submissionType, context }} />
      </div>
    );
  } else if (submissionType === "image") {
    return (
      <div className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100">
        <RenderImageCard image={image} />
        <SubmissionBody title={title} author={author} />
        <SubmissionFooter {...{ submissionType, context }} />
      </div>
    );
  } else if (submissionType === "text") {
    <RenderTextCard text={text} title={title} author={author} />;
    <SubmissionFooter {...{ submissionType, context }} />;
  }
  return null;
};

const RenderVideoCard = ({
  video,
  thumbnail,
}: {
  video: string;
  thumbnail: string;
}) => {
  return (
    <MediaController className="rounded-t-xl">
      <video
        slot="media"
        src={video}
        poster={thumbnail}
        preload="auto"
        muted
        crossOrigin=""
        className="rounded-t-xl h-64 w-full object-cover"
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
      </MediaControlBar>
    </MediaController>
  );
};

const RenderImageCard = ({ image }: { image: string }) => {
  return (
    <div className="flex flex-col">
      <Image
        src={image}
        alt="submission preview"
        width={640}
        height={360}
        className="rounded-t-xl"
      />
    </div>
  );
};

const RenderTextCard = ({
  text,
  title,
  author,
}: {
  text: React.ReactNode;
  title: string;
  author: string;
}) => {
  return (
    <div className="card-body h-64 bg-white/90 rounded-xl text-black/80 gap-1 w-full overflow-auto">
      <h2 className="break-word font-bold text-2xl">
        {title || "My awesome new submission"}
      </h2>
      <h3 className="break-all italic">
        {author ? formatAddress(author) : "anonymous"}
      </h3>
      <section className="break-all">{text}</section>
    </div>
  );
};

const SubmissionBody = ({
  title,
  author,
}: {
  title: string;
  author?: string;
}) => {
  return (
    <div className="card-body h-28 rounded-b-xl w-full">
      <h2 className={`card-title text-md ${title ? "" : "text-gray-500"}`}>
        {title || "My awesome new submission"}
      </h2>
      <p className="text-sm"> {author ? formatAddress(author) : "anonymous"}</p>
    </div>
  );
};

const SubmissionFooter = ({
  submissionType,
  context,
}: {
  submissionType: "video" | "image" | "text";
  context: "preview" | "live";
}) => {
  return (
    <div className="grid grid-cols-3 w-full gap-6">
      <SubmissionTypeBadge {...{ submissionType }} />
      {context === "live" && (
        <>
          <SubmissionVotesBadge />
          <UserSubmissionSelectBadge
            submission={{
              id: "123",
            }}
          />
        </>
      )}
    </div>
  );
};
