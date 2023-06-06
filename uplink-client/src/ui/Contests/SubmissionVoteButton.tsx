"use client";

import { useVoteProposalContext } from "@/providers/VoteProposalProvider";

const SubmissionVoteButton = ({ data }: { data: any }) => {
  const { addProposedVote } = useVoteProposalContext();
  return (
    <div>
      <button className="btn" onClick={() => addProposedVote(data)}>
        add to cart
      </button>
    </div>
  );
};

export default SubmissionVoteButton;
