"use client";
import { useEffect, useState } from "react";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import CardSubmission from "./CardSubmission";
import { HiCheckBadge } from "react-icons/hi2";
import { useContestState } from "@/providers/ContestStateProvider";
import { Decimal } from "decimal.js";
import { FaShare } from "react-icons/fa6";
import { BiLayerPlus } from "react-icons/bi";
import formatDecimal from "@/lib/formatDecimal";
import useLiveSubmissions from "@/hooks/useLiveSubmissions";

export const AddToCartButton = ({ submission, voteActions }) => {
  const { addProposedVote, currentVotes, proposedVotes } = voteActions;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(
      [...currentVotes, ...proposedVotes].some(
        (vote) => vote.submissionId === submission.id
      )
    );
  }, [currentVotes, proposedVotes, submission.id]);

  const handleSelect = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <span
        className="ml-auto tooltip tooltip-top pr-2.5"
        data-tip={"Selected"}
      >
        <HiCheckBadge className="h-7 w-7 text-warning" />
      </span>
    );
  } else
    return (
      <span className="ml-auto tooltip tooltip-top " data-tip={"Add to cart"}>
        <button
          className="btn btn-ghost btn-sm text-t2 w-fit hover:bg-warning hover:bg-opacity-30 hover:text-warning"
          onClick={handleSelect}
        >
          <BiLayerPlus className="h-6 w-6 " />
        </button>
      </span>
    );
};

const SubmissionFooter = ({ submission, sharePath }) => {
  const totalVotes = new Decimal(submission.totalVotes ?? "0");
  const voteActions = useVoteActionContext();
  const { contestState } = useContestState();
  const [shareText, setShareText] = useState("Share");
  const handleShare = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setShareText("Copied Link");
    navigator.clipboard.writeText(sharePath);
    setTimeout(() => {
      setShareText("Share");
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-2 w-full" />
      <div className="grid grid-cols-3 w-full items-center">
        <span className="tooltip tooltip-top mr-auto" data-tip={shareText}>
          <button
            className="btn btn-ghost btn-sm text-t2 w-fit hover:bg-primary hover:bg-opacity-30 hover:text-primary"
            onClick={(e) => handleShare(e)}
          >
            <FaShare className="h-6 w-6 " />
          </button>
        </span>
        {totalVotes.greaterThan(0) ? (
          <span className="text-center text-t2 text-sm font-medium">
            {formatDecimal(totalVotes.toString()).short} votes
          </span>
        ) : (
          <span />
        )}
        {contestState === "voting" && (
          <AddToCartButton submission={submission} voteActions={voteActions} />
        )}
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

const SubmissionDisplay = ({
  contestId,
  spaceName,
}: {
  contestId: string;
  spaceName: string;
}) => {
  const { liveSubmissions: submissions } = useLiveSubmissions(contestId);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <div className="w-8/12 m-auto sm:w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  sm:auto-rows-fr">
          {submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                basePath={`/${spaceName}/contest/${contestId}`}
                submission={submission}
                footerChildren={
                  <SubmissionFooter
                    sharePath={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/contest/${contestId}/submission/${submission.id}`} // TODO: change this to window.host
                    submission={submission}
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDisplay;
