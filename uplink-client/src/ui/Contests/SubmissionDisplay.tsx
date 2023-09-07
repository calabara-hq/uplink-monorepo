"use client";
import { VideoProvider } from "@/providers/VideoProvider";
import VideoPreview from "../VideoPlayer/VideoPlayer";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import SubmissionVoteButton from "./SubmissionVoteButton";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import { Decimal } from "decimal.js";
import Output from "editorjs-react-renderer";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";
import CardSubmission from "../Submission/CardSubmission";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import SubmissionViewer from "../SubmissionViewer/SubmissionViewer2";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { Submission } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { BiBadge } from "react-icons/bi";
import { FaBurst } from "react-icons/fa6";

const AddToCartButton = ({ submission, voteActions }) => {
  const { addProposedVote, currentVotes, proposedVotes } = voteActions;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      [...currentVotes, ...proposedVotes].some(
        (vote) => vote.submissionId === submission.id
      )
    );
  }, [currentVotes, proposedVotes, submission.id]);

  const handleSelect = () => {
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <button className=" btn btn-ghost btn-sm cursor-default no-animation ml-auto">
        <HiCheckBadge className="h-6 w-6 text-black" />
      </button>
    );
  } else
    return (
      <button className=" btn btn-ghost btn-sm ml-auto" onClick={handleSelect}>
        <HiPlus className="h-6 w-6 text-black" />
      </button>
    );
};

const SubmissionFooter = ({ submission }) => {
  const { contestState } = useContestState();
  const voteActions = useVoteActionContext();
  if (voteActions && contestState === "voting")
    return (
      <div className="animate-springUp flex absolute bottom-0 left-0 items-end w-full h-8 rounded-b-lg bg-secondary">
        <AddToCartButton submission={submission} voteActions={voteActions} />
      </div>
    );
  return null;
};

const SubmissionDisplay = ({
  contestId,
  spaceName,
}: {
  contestId: string;
  spaceName: string;
}) => {
  const { submissions } = useContestInteractionState();
  const voteActions = useVoteActionContext();

  return (
    <div className="flex flex-col gap-4 w-full">
      <SubmissionViewer />
      <h1 className="text-xl lg:text-3xl text-center font-bold text-t1">
        Submissions
      </h1>
      <div className="flex w-full justify-evenly items-center">
        <div className="w-8/12 m-auto sm:w-full grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 sm:auto-rows-fr">
          {submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                basePath={`${spaceName}/contests/${contestId}`}
                submission={submission}
                voteActions={voteActions}
                footerChildren={<SubmissionFooter submission={submission} />}
              />
            );
          })}
        </div>
      </div>
    </div>
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
