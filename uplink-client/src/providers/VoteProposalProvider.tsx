"use client";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

export interface VotingStateProps {
  proposedUserVotes: any[];
  removeProposedVote: (id: number) => void;
  addProposedVote: (el: any) => void;
}

const VoteProposalContext = createContext<VotingStateProps | undefined>(
  undefined
);

export const VoteProposalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [proposedVotes, setProposedVotes] = useState<any[]>([]);

  const addProposedVote = (el: any) => {
    // check if already existing
    if (proposedVotes.find((vote) => vote.id === el.id))
      return toast.error("This selection is already in your cart.");
    setProposedVotes([...proposedVotes, el]);
  };

  const removeProposedVote = (id: number) => {
    setProposedVotes(proposedVotes.filter((el) => el.id !== id));
  };

  return (
    <VoteProposalContext.Provider
      value={{
        proposedUserVotes: proposedVotes,
        addProposedVote,
        removeProposedVote,
      }}
    >
      {children}
    </VoteProposalContext.Provider>
  );
};

export function useVoteProposalContext() {
  const context = useContext(VoteProposalContext);
  if (context === undefined) {
    throw new Error("useVotingState must be used within a VotingStateProvider");
  }
  return context;
}
