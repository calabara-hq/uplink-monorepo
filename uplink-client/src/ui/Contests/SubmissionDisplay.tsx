"use client";
import { getContestById } from "@/lib/fetch/contest";
import { VideoProvider } from "@/providers/VideoProvider";
import VideoPreview from "../VideoPlayer/VideoPlayer";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
import SubmissionVoteButton from "./SubmissionVoteButton";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import {
  CheckBadgeIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

/*
const VideoPreview = dynamic(() => import("../VideoPlayer/VideoPlayer"), {
  loading: () => <SubmissionSkeleton />,
});
*/
/*
const fetchSubmission = async (url: string) => {
  console.log("fetching submission from", url);
  return fetch(url, { cache: "no-store" }).then((res) => res.json());
};
*/

const SubmissionDisplay = ({ contestId }: { contestId: number }) => {
  // init useSWR here

  const { liveSubmissions, isLoading, error } = useTrackSubmissions(contestId);
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl lg:text-3xl text-center font-bold">Submissions</h1>
      <div className="flex w-full justify-evenly items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 justify-items-evenly gap-8 lg:w-full w-full">
          {liveSubmissions.map((submission, idx) => {
            return <SubmissionCard submission={submission} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission }: { submission: any }) => {
  return (
    <div className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100">
      {submission.data.type === "video" && (
        <RenderVideoSubmission submission={submission} />
      )}
      {submission.data.type === "image" && (
        <RenderImageSubmission submission={submission} />
      )}
      {submission.data.type === "text" && (
        <RenderTextSubmission submission={submission} />
      )}
      <SubmissionFooter submission={submission} />
    </div>
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
    <div className="card-body h-36 rounded-b-xl w-full">
      <h2 className="card-title">{submission.data.title}</h2>
      <h3>author</h3>
      <div className="absolute bottom-0 left-0 grid grid-cols-3 w-full gap-6">
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
              <CheckBadgeIcon className="h-6 w-6 text-border" />
            </button>
          )}
          {!isSelected && (
            <button className="btn btn-ghost w-full" onClick={handleSelect}>
              <PlusIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RenderTextSubmission = ({ submission }) => {
  return (
    <div className="card-body h-32 bg-base-100 rounded-xl">
      <h2 className="card-title">{submission.data.title}</h2>
      <p>is simply dummy text of the printing and typesetting industry.</p>
    </div>
  );
};

const RenderImageSubmission = ({ submission }) => {
  return (
    <figure className="relative h-64 w-full">
      <Image
        src={submission.data.previewAsset}
        alt="submission image"
        fill
        className="rounded-t-xl object-cover w-full"
      />
    </figure>
  );
};

const RenderVideoSubmission = ({ submission }) => {
  return (
    <VideoProvider>
      <figure className="relative bg-base-100 h-64 w-full">
        <VideoPreview
          url={submission.data.videoAsset}
          thubmnailUrl={submission.data.previewAsset}
          id={submission.data.id}
        />
      </figure>
    </VideoProvider>
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
