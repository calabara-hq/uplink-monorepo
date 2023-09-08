"use client";
import { useEffect, useState } from "react";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import { HiCheckBadge, HiPlus } from "react-icons/hi2";

export const SubmissionTypeBadge = ({
  submissionType,
}: {
  submissionType: "video" | "image" | "text";
}) => {
  const badgeType = {
    video: "primary",
    image: "secondary",
    text: "warning",
  }[submissionType];

  return (
    <div className="flex items-center justify-center">
      <div className={`badge rounded badge-outline badge-${badgeType}`}>
        {submissionType}
      </div>
    </div>
  );
};

export const SubmissionVotesBadge = ({}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="badge rounded badge-outline badge-warning">{0} votes</div>
    </div>
  );
};

export const UserSubmissionSelectBadge = ({ submission }) => {
  const { addProposedVote, userVotingState } = useVoteActionContext();
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
  return (
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
  );
};
