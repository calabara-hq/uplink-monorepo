"use client";
import useVotingParams, { UserVotingParams } from "@/hooks/useVotingParams";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Decimal from "decimal.js";
import gql from "graphql-tag";
import graphqlClient from "@/lib/graphql/initUrql";
import useHandleMutation from "@/hooks/useHandleMutation";
import { useContestInteractionState } from "./ContestInteractionProvider";

export interface VotingStateProps {
  userVotingState: {
    currentVotes: any[];
    proposedUserVotes: any[];
    totalVotingPower: string;
    votesSpent: string;
    votesRemaining: string;
    isLoading: boolean;
  };
  areCurrentVotesDirty: boolean;
  removeSingleVote: (
    submissionId: number,
    mode: "current" | "proposed"
  ) => void;
  removeAllVotes: () => void;
  addProposedVote: (el: any) => void;
  updateVoteAmount: (
    id: number,
    amount: string,
    mode: "current" | "proposed"
  ) => void;
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
          submissionUrl
          votes
        }
      }
    }
  }
`;

const removeSingleVoteDocument = gql`
  mutation Mutation($submissionId: ID!, $contestId: ID!) {
    removeSingleVote(submissionId: $submissionId, contestId: $contestId) {
      success
      userVotingParams {
        totalVotingPower
        userVotes {
          submissionUrl
          submissionId
          id
          votes
        }
        votesRemaining
        votesSpent
      }
    }
  }
`;

const removeAllVotesDocument = gql`
  mutation RemoveAllVotes($contestId: ID!) {
    removeAllVotes(contestId: $contestId) {
      success
      userVotingParams {
        votesSpent
        votesRemaining
        userVotes {
          id
          submissionId
          submissionUrl
          votes
        }
        totalVotingPower
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
  contestId: string;
}) => {
  const {
    userVoteParams: userVotingParams,
    areUserVotingParamsLoading: isLoading,
    mutateUserVotingParams: mutate,
  } = useContestInteractionState();
  const [proposedVotes, setProposedVotes] = useState<any[]>([]);
  const [currentVotes, setCurrentVotes] = useState<any[]>([]);
  const [votesSpent, setVotesSpent] = useState<string>("0");
  const [votesRemaining, setVotesRemaining] = useState<string>("0");
  const [totalVotingPower, setTotalVotingPower] = useState<string>("0");
  const [areCurrentVotesDirty, setAreCurrentVotesDirty] =
    useState<boolean>(false);

  const handleCastVotes = useHandleMutation(CastVotesDocument);
  const handleRemoveSingleVote = useHandleMutation(removeSingleVoteDocument);
  const handleRemoveAllVotes = useHandleMutation(removeAllVotesDocument);

  useEffect(() => {
    if (userVotingParams) {
      setCurrentVotes(userVotingParams.userVotes);
      setVotesSpent(userVotingParams.votesSpent);
      setVotesRemaining(userVotingParams.votesRemaining);
      setTotalVotingPower(userVotingParams.totalVotingPower);
      // if proposed votes are non empty, remove fields from array that appear in current votes (user added votes before signing in)
      if (proposedVotes.length > 0) {
        const newProposedVotes = proposedVotes.filter(
          (el) =>
            !userVotingParams?.userVotes.find(
              (vote) => vote?.submissionId === el.submissionId
            )
        );
        setProposedVotes(newProposedVotes);
      }
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
    setProposedVotes([...proposedVotes, { ...el, votes: "" }]);
  };

  const removeSingleVote = async (
    submissionId: number,
    mode: "current" | "proposed"
  ) => {
    if (mode === "proposed") {
      setProposedVotes(
        proposedVotes.filter((el) => el.submissionId !== submissionId)
      );
    }

    if (mode === "current") {
      const response = await handleRemoveSingleVote({
        contestId,
        submissionId,
      });
      if (!response) return;
      const { success, userVotingParams: newUserVotingParams } =
        response.data.removeSingleVote;
      if (!success)
        return toast.error("There was a problem removing your vote.");
      if (success) {
        toast.success("Successfully removed your vote.");
        mutate({ ...newUserVotingParams });
      }
    }
  };

  const removeAllVotes = async () => {
    const response = await handleRemoveAllVotes({
      contestId,
    });
    if (!response) return;
    const { success, userVotingParams: newUserVotingParams } =
      response.data.removeAllVotes;
    if (!success)
      return toast.error("There was a problem removing your votes.");
    if (success) {
      toast.success("Successfully removed all votes.");
      mutate({ ...newUserVotingParams });
      setProposedVotes([]);
    }
  };

  const updateVoteAmount = (
    id: number,
    newAmount: string,
    mode: "current" | "proposed"
  ) => {
    const updateAction =
      mode === "current" ? setCurrentVotes : setProposedVotes;

    updateAction((prevVotes) => {
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
    let runningSum = new Decimal(0);
    let castVotePayload = [];

    for (const el of [...currentVotes, ...proposedVotes]) {
      const decimalAmount = new Decimal(el.votes || "0");
      if (decimalAmount.greaterThan(0)) {
        runningSum = runningSum.plus(decimalAmount);
        castVotePayload.push({
          submissionId: el.submissionId,
          votes: el.votes,
        });
      }
    }

    return {
      runningSum,
      castVotePayload,
    };
  };

  const submitVotes = async () => {
    const { runningSum, castVotePayload } = prepareVotes();
    if (castVotePayload.length === 0)
      return toast.error("Please add votes to your selections");
    if (runningSum.greaterThan(totalVotingPower))
      return toast.error("Insufficient voting power");
    const response = await handleCastVotes({
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
        areCurrentVotesDirty,
        addProposedVote,
        removeSingleVote,
        removeAllVotes,
        updateVoteAmount,
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
