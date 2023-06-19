"use client";

import { useVoteProposalContext } from "@/providers/VoteProposalProvider";

const SubmissionVoteButton = ({ submission }: { submission: any }) => {
  const { addProposedVote } = useVoteProposalContext();
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
