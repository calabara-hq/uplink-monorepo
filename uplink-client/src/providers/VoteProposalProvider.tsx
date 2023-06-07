"use client";
import useVotingParams, { UserVotingParams } from "@/hooks/useVotingParams";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Decimal from "decimal.js";
import gql from "graphql-tag";
import graphqlClient from "@/lib/graphql/initUrql";
import useHandleMutation from "@/hooks/useHandleMutation";
import { mutate } from "swr";

export interface VotingStateProps {
  userVotingState: {
    currentVotes: any[];
    totalVotingPower: string;
    votesSpent: string;
    votesRemaining: string;
    proposedUserVotes: any[];
    isLoading: boolean;
  };
  removeProposedVote: (id: number) => void;
  addProposedVote: (el: any) => void;
  updateProposedVoteAmount: (id: number, amount: string) => void;
  submitVotes: () => void;
}

const CastVotesDocument = gql`
  mutation Mutation($contestId: ID!, $castVotePayload: [CastVotePayload!]!) {
    castVotes(contestId: $contestId, castVotePayload: $castVotePayload) {
      success
      userVotingParams {
        totalVotingPower
        votesRemaining
        votesSpent
        userVotes {
          submissionId
          votes
        }
      }
    }
  }
`;

const VoteProposalContext = createContext<VotingStateProps | undefined>(
  undefined
);

export const VoteProposalProvider = ({
  children,
  contestId,
}: {
  children: React.ReactNode;
  contestId: number;
}) => {
  const { userVotingParams, isLoading, mutate } = useVotingParams(contestId);
  const [proposedVotes, setProposedVotes] = useState<any[]>([]);
  const [currentVotes, setCurrentVotes] = useState<any[]>([]);
  const [votesSpent, setVotesSpent] = useState<string>("0");
  const [votesRemaining, setVotesRemaining] = useState<string>("0");
  const [totalVotingPower, setTotalVotingPower] = useState<string>("0");
  const handleMutation = useHandleMutation(CastVotesDocument);

  useEffect(() => {
    if (userVotingParams) {
      setCurrentVotes(userVotingParams.userVotes);
      setVotesSpent(userVotingParams.votesSpent);
      setVotesRemaining(userVotingParams.votesRemaining);
      setTotalVotingPower(userVotingParams.totalVotingPower);
    }
  }, [userVotingParams]);

  const addProposedVote = (el: any) => {
    // check if already existing in current votes or proposed votes
    if (
      [...proposedVotes, ...(userVotingParams?.userVotes ?? [])].find(
        (vote) => vote.submissionId === el.submissionId
      )
    )
      return toast.error("This selection is already in your cart.");
    setProposedVotes([
      ...proposedVotes,
      { ...el, submissionId: el.id, votes: "" },
    ]);
  };

  const removeProposedVote = (id: number) => {
    setProposedVotes(proposedVotes.filter((el) => el.submissionId !== id));
  };

  const updateProposedVoteAmount = (id: number, newAmount: string) => {
    setProposedVotes((prevVotes) => {
      const newVotes = [...prevVotes];
      const voteToUpdate = newVotes.find((vote) => vote.submissionId === id);
      if (!voteToUpdate) return prevVotes;

      const oldAmountDecimal = new Decimal(voteToUpdate.votes || "0");
      const newAmountDecimal = new Decimal(newAmount || "0");
      const difference = newAmountDecimal.minus(oldAmountDecimal);

      voteToUpdate.votes = newAmount;

      setVotesSpent((prevVotesSpent) => {
        const votesSpentDecimal = new Decimal(prevVotesSpent || "0");
        return votesSpentDecimal.plus(difference).toString();
      });

      setVotesRemaining((prevVotesRemaining) => {
        const votesRemainingDecimal = new Decimal(prevVotesRemaining || "0");
        return votesRemainingDecimal.minus(difference).toString();
      });

      return newVotes;
    });
  };

  const prepareVotes = () => {
    const votePayload = [...currentVotes, ...proposedVotes].map((el) => {
      const decimalAmount = new Decimal(el.votes || "0");
      if (decimalAmount.greaterThan(0))
        return {
          submissionId: el.submissionId,
          votes: el.votes,
        };
    });
    console.log(votePayload);
    return votePayload;
  };

  const submitVotes = async () => {
    const castVotePayload = prepareVotes();
    if (castVotePayload.length === 0)
      return toast.error("You have not selected any votes to submit.");
    const response = await handleMutation({
      contestId,
      castVotePayload,
    });
    if (!response) return;
    const { success, userVotingParams: newUserVotingParams } =
      response.data.castVotes;
    if (!success)
      return toast.error("There was an error submitting your votes.");
    if (success) {
      toast.success("Your votes have been submitted.");
      mutate({ ...newUserVotingParams });
      setProposedVotes([]);
    }
  };

  return (
    <VoteProposalContext.Provider
      value={{
        userVotingState: {
          currentVotes,
          totalVotingPower,
          votesSpent,
          votesRemaining,
          proposedUserVotes: proposedVotes,
          isLoading,
        },
        addProposedVote,
        removeProposedVote,
        updateProposedVoteAmount,
        submitVotes,
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
