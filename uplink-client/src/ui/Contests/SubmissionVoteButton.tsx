"use client";

import { useVoteActionContext } from "@/providers/VoteActionProvider";

const SubmissionVoteButton = ({ submission }: { submission: any }) => {
  const { addProposedVote } = useVoteActionContext();
  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          addProposedVote({ ...submission, submissionId: submission.id })
        }
      >
        add to cart
      </button>
    </div>
  );
};

export default SubmissionVoteButton;
