"use client";
import { useEffect, useState } from "react";
import { useVoteActionContext } from "@/providers/VoteActionProvider";

import CardSubmission from "../Submission/CardSubmission";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";


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

  const handleSelect = (event) => {
    event.stopPropagation()
    event.preventDefault()
    if (!isSelected) {
      addProposedVote({ ...submission, submissionId: submission.id });
    }
    setIsSelected(!isSelected);
  };

  if (isSelected) {
    return (
      <div className="animate-springUp flex absolute bottom-0 left-0 items-center w-full h-8 rounded-b-lg bg-warning px-1 bg-opacity-80 cursor-default no-animation">
        <p className="text-black font-medium text-center ml-auto">
          Item in Cart
        </p>
        <div className="w-0.5 h-full bg-base ml-auto" />

        <span className="p-4   ">
          <HiCheckBadge className="h-6 w-6 text-black" />
        </span>
      </div>
    );
  } else
    return (
      <div onClick={(event)=>handleSelect(event)} className="animate-springUp flex absolute bottom-0 left-0 items-center w-full h-8 rounded-b-lg bg-warning px-1 hover:bg-opacity-80">
        <p className="text-black font-medium text-center ml-auto">
          Add to Cart
        </p>
        <div className="w-0.5 h-full bg-base ml-auto" />

        <span className=" p-4" >
          <HiPlus className="h-6 w-6 text-black font-medium" />
        </span>
      </div>
    );
};

const SubmissionFooter = ({ submission }) => {
  const { contestState } = useContestState();
  const voteActions = useVoteActionContext();
  if (contestState) {
    if (
      voteActions && contestState === "voting"
    )
      return (
        <AddToCartButton submission={submission} voteActions={voteActions} />
      );
    else if (new Decimal(submission.totalVotes ?? "0").greaterThan(0))
      return (
        <div className="animate-springUp flex absolute bottom-0 left-0 items-end w-full h-8 rounded-b-lg bg-warning">
          <div className="text-black font-medium m-auto">
            {submission.totalVotes} votes
          </div>
        </div>
      );
  }

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl lg:text-3xl text-center font-bold text-t1">
        Submissions
      </h1>
      <div className="flex w-full justify-evenly items-center">
        <div className="w-8/12 m-auto sm:w-full grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 sm:auto-rows-fr">
          {submissions.map((submission, idx) => {
            return (
              <CardSubmission
                key={idx}
                basePath={`${spaceName}/contest/${contestId}`}
                submission={submission}
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
