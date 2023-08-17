"use client";
import { VideoProvider } from "@/providers/VideoProvider";
import VideoPreview from "../VideoPlayer/VideoPlayer";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
import SubmissionVoteButton from "./SubmissionVoteButton";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import Output from "editorjs-react-renderer";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";

import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import SubmissionViewer from "../SubmissionViewer/SubmissionViewer2";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { Submission } from "@/providers/ContestInteractionProvider";

const SubmissionDisplay = ({ contestId }: { contestId: string }) => {
  // init useSWR here

  const { submissions } = useContestInteractionState();
  return (
    <div className="flex flex-col gap-4 w-full">
      <SubmissionViewer />
      <h1 className="text-xl lg:text-3xl text-center font-bold">Submissions</h1>
      <div className="flex w-full justify-evenly items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 justify-items-evenly gap-8 lg:w-full w-full">
          {submissions.map((submission, idx) => {
            return <SubmissionCard submission={submission} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission }: { submission: Submission }) => {
  const pathname = usePathname();
  return (
    <Link
      className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100"
      href={`${pathname}/submission/${submission.id}`}
    >
      {submission.data.type === "video" && (
        <>
          <RenderVideoSubmission submission={submission} />
          <SubmissionBody submission={submission} />
        </>
      )}
      {submission.data.type === "image" && (
        <>
          <RenderImageSubmission submission={submission} />
          <SubmissionBody submission={submission} />
        </>
      )}
      {submission.data.type === "text" && (
        <RenderTextSubmission submission={submission} />
      )}
      <SubmissionFooter submission={submission} />
    </Link>
  );
};

const SubmissionTypeBadge = ({
  type,
}: {
  type: "video" | "image" | "text";
}) => {
  const badgeType = {
    video: "primary",
    image: "secondary",
    text: "warning",
  }[type];

  return (
    <div className={`badge rounded badge-outline badge-${badgeType}`}>
      {type}
    </div>
  );
};

const SubmissionBody = ({ submission }) => {
  return (
    <div className="card-body h-24 rounded-b-xl w-full">
      <h2 className="card-title">{submission.data.title}</h2>
      <h3>{submission.data.author}</h3>
    </div>
  );
};

const SubmissionFooter = ({ submission }) => {
  const { addProposedVote, userVotingState } = useVoteProposalContext();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      [
        ...userVotingState.currentVotes,
        ...userVotingState.proposedUserVotes,
      ].some((vote) => vote.submissionId === submission.id)
    );
  }, [userVotingState, submission.id]);

  const handleSelect = () => {
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="grid grid-cols-3 w-full gap-6">
      <div className="flex items-center justify-center">
        <SubmissionTypeBadge type={submission.data.type} />
      </div>
      <div className="flex items-center justify-center">
        <div className="badge rounded badge-outline badge-warning">
          {submission.votes} votes
        </div>
      </div>

      <div
        className="flex items-center justify-center lg:tooltip"
        data-tip={isSelected ? "item is in your cart" : "add to cart"}
      >
        {isSelected && (
          <button className="btn btn-ghost w-full">
            <HiCheckBadge className="h-6 w-6 text-border" />
          </button>
        )}
        {!isSelected && (
          <button className="btn btn-ghost w-full" onClick={handleSelect}>
            <HiPlus className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const RenderTextSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <div className="card-body h-64 bg-white/90 rounded-xl text-black/80 gap-1 w-full overflow-auto">
      <h2 className="break-all font-bold text-2xl">{submission.data.title}</h2>
      <h3 className="break-all italic">{submission.author}</h3>
      <section className="break-all">
        {submission.type === "twitter" ? (
          <p>{submission.data.thread[0].text}</p>
        ) : (
          <Output data={submission.data.body} />
        )}
      </section>
    </div>
  );
};

const RenderImageSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <figure className="relative h-64 w-full">
      <Image
        src={
          submission.type === "standard"
            ? submission.data.previewAsset
            : submission.data.thread[0].previewAsset
        }
        alt="submission image"
        fill
        className="rounded-t-xl object-cover w-full"
      />
    </figure>
  );
};

const RenderVideoSubmission = ({ submission }: { submission: Submission }) => {
  return (
    <MediaController className="rounded-t-xl">
      <video
        slot="media"
        src={
          submission.type === "twitter"
            ? submission.data.thread[0].videoAsset
            : submission.data.videoAsset
        }
        poster={
          submission.type === "twitter"
            ? submission.data.thread[0].previewAsset
            : submission.data.previewAsset
        }
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

const SubmissionSkeleton = () => {
  return (
    <div className="col-span-4 space-y-4 lg:col-span-1">
      <div className="relative h-[167px] rounded-xl bg-gray-900 shimmer" />

      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-6 w-1/3 rounded-lg bg-gray-900" />
      <div className="h-4 w-full rounded-lg bg-gray-900" />
      <div className="h-4 w-4/6 rounded-lg bg-gray-900" />
    </div>
  );
};

export const SubmissionDisplaySkeleton = () => {
  return (
    <div className="space-y-6 pb-[5px]">
      <div className="space-y-2">
        <div className="h-6 w-1/3 rounded-lg bg-gray-900 shimmer" />
        <div className="h-4 w-1/2 rounded-lg bg-gray-900 shimmer" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <SubmissionSkeleton />
        <SubmissionSkeleton />
        <SubmissionSkeleton />
        <SubmissionSkeleton />
      </div>
    </div>
  );
};

export default SubmissionDisplay;
