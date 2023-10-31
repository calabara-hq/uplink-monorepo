"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  UserVote,
  UserVotingParams,
  useContestInteractionState,
} from "./ContestInteractionProvider";
import { toast } from "react-hot-toast";
import { handleMutationError } from "@/lib/handleMutationError";
import { Decimal } from "decimal.js";
import { useSession } from "./SessionProvider";
import { Submission, TwitterSubmission } from "@/types/submission";

// inherit voting params from contest interaction provider
// provide an API for managing user votes



export type VotableSubmission = Submission & {
  votes: string;
}


const apiCastVotes = async (
  contestId: string,
  castVotePayload: any,
  csrfToken: string | null
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
            mutation Mutation($contestId: ID!, $castVotePayload: [CastVotePayload!]!){
              castVotes(contestId: $contestId, castVotePayload: $castVotePayload){
                success
                userVotingParams {
                  totalVotingPower
                  votesRemaining
                  votesSpent
                  userVotes {
                    id
                    votes
                    submissionId
                    submissionUrl
                    votes
                  }
                }
              }
            }`,
      variables: {
        contestId,
        castVotePayload,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.castVotes);
};

const apiRemoveSingleVote = async (
  contestId: string,
  submissionId: string,
  csrfToken: string | null
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
            mutation Mutation($contestId: ID!, $submissionId: ID!){
              removeSingleVote(contestId: $contestId, submissionId: $submissionId){
                success
                userVotingParams {
                  totalVotingPower
                  votesRemaining
                  votesSpent
                  userVotes {
                    id
                    votes
                    submissionId
                    submissionUrl
                    votes
                  }
                }
              }
          }`,
      variables: {
        contestId,
        submissionId,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.removeSingleVote);
};

const apiRemoveAllVotes = async (
  contestId: string,
  csrfToken: string | null
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
            mutation Mutation($contestId: ID!){
              removeAllVotes(contestId: $contestId){
                success
                userVotingParams {
                  totalVotingPower
                  votesRemaining
                  votesSpent
                  userVotes {
                    id
                    votes
                    submissionId
                    submissionUrl
                    votes
                  }
                }
              }
          }`,
      variables: {
        contestId,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.removeAllVotes);
};

export interface VoteActionProps {
  removeAllVotes: () => void;
  removeSingleVote: (
    submissionId: number,
    mode: "current" | "proposed"
  ) => void;
  addProposedVote: (el: VotableSubmission) => void;
  updateVoteAmount: (submissionId: number, amount: string) => void;
  submitVotes: () => void;
  areCurrentVotesDirty: boolean;
  areUserVotingParamsLoading: boolean;
  proposedVotes: Array<VotableSubmission>;
}

const VoteActionContext = createContext<any | undefined>(undefined);

export const VoteActionProvider = ({
  children,
  contestId,
}: {
  children: React.ReactNode;
  contestId: string;
}) => {
  // userVoteParams will be undefined if not in the voting window TODO: verify this
  const { userVoteParams, areUserVotingParamsLoading, mutateUserVotingParams } =
    useContestInteractionState();
  const [proposedVotes, setProposedVotes] = useState<Array<VotableSubmission>>([]);
  const [areCurrentVotesDirty, setAreCurrentVotesDirty] = useState(false);
  const { data: session, status } = useSession();

  // handle cases where the user was signed out, added proposed votes, then signed in
  // if proposed votes already exist in current votes, remove them from proposed votes

  useEffect(() => {
    if (status === "authenticated" && userVoteParams?.userVotes.length > 0) {
      const newProposedVotes = proposedVotes.filter(
        (el) =>
          !userVoteParams?.userVotes.find(
            (vote: UserVote) => vote?.submissionId === el.id
          )
      );
      setProposedVotes(newProposedVotes);
    }
  }, [status, userVoteParams?.userVotes]);

  // add submission to proposed votes
  const addProposedVote = (el: Submission) => {
    console.log('proposedVotes', proposedVotes)
    console.log('userVoteParams?.userVotes', userVoteParams?.userVotes)
    if (proposedVotes.find(vote => vote.id === el.id)) return toast.error("This selection is already in your cart.");
    if (userVoteParams) {
      if (userVoteParams?.userVotes.find((vote: UserVote) => vote.submissionId === el.id)) return toast.error("This selection is already in your cart.");
    }
    setProposedVotes([...proposedVotes, { ...el, votes: "" }]);
  };

  // remove a single current or proposed vote.
  // proposed votes are local, current votes require an api request
  const removeSingleVote = async (
    submissionId: string,
    mode: "current" | "proposed"
  ) => {
    if (mode === "proposed") {
      //TODO: need to update the vote differentials here
      setProposedVotes(
        proposedVotes.filter((el) => el.id !== submissionId)
      );
    }

    if (mode === "current") {
      const toRemoveIdx = userVoteParams?.userVotes.findIndex(
        (el: UserVote) => el.submissionId === submissionId
      );

      // send the mutation request and optimistically update the cache
      // once the request completes, the cache will be updated with the response
      // if the request fails, the cache will be reverted to original value of userVoteParams

      const options = {
        optimisticData: {
          ...userVoteParams,
          votesRemaining: new Decimal(userVoteParams?.votesRemaining || "0")
            .plus(userVoteParams?.userVotes[toRemoveIdx].votes)
            .toString(),
          votesSpent: new Decimal(userVoteParams?.votesSpent || "0")
            .minus(userVoteParams?.userVotes[toRemoveIdx].votes)
            .toString(),
          userVotes: [
            ...userVoteParams?.userVotes.slice(0, toRemoveIdx),
            ...userVoteParams?.userVotes.slice(toRemoveIdx + 1),
          ],
        },
        populateCache: (newData: {
          userVotingParams: UserVotingParams;
          success: boolean;
        }) => {
          return newData.userVotingParams;
        },
        rollbackOnError: true,
        revalidate: false,
      };
      try {
        await mutateUserVotingParams(
          apiRemoveSingleVote(contestId, submissionId, session.csrfToken),
          options
        );
        toast.success("Your vote has been removed");
      } catch (err) {
        console.log(err);
        mutateUserVotingParams(userVoteParams, { revalidate: false });
      }
    }
  };

  // reset the total user vote state.
  const removeAllVotes = async () => {
    // if the user is signed out, just reset the local proposed vote state

    if (status !== "authenticated") return setProposedVotes([]);

    const previousProposedVotes = [...proposedVotes];

    // send the mutation request and optimistically update the cache
    // once the request completes, the cache will be updated with the response
    // if the request fails, the cache will be reverted to original value of userVoteParams

    const options = {
      optimisticData: () => {
        setProposedVotes([]);
        return {
          ...userVoteParams,
          votesRemaining: userVoteParams?.totalVotingPower || "0",
          votesSpent: "0",
          userVotes: [],
        };
      },
      populateCache: (newData: {
        userVotingParams: UserVotingParams;
        success: boolean;
      }) => {
        return newData.userVotingParams;
      },
      rollbackOnError: true,
      revalidate: false,
    };
    try {
      await mutateUserVotingParams(
        apiRemoveAllVotes(contestId, session.csrfToken),
        options
      );
      toast.success("Your votes have been removed");
    } catch (err) {
      console.log(err);
      setProposedVotes(previousProposedVotes);
      mutateUserVotingParams(userVoteParams, { revalidate: false });
    }
  };

  // update the amount of votes allocated to a submission
  const updateVoteAmount = (
    id: string,
    newAmount: string,
    mode: "current" | "proposed"
  ) => {
    // in proposed mode, we update the local state of the proposed votes along with the swr state of our user voting params
    // in current mode, we only update the swr state of our user voting params

    const constructVoteDifferential = () => {
      // return object should adjust the votesSpent and votesRemaining values
      const voteToUpdate =
        mode === "current"
          ? (userVoteParams?.userVotes || []).find(
            (vote) => vote.submissionId === id
          )
          : proposedVotes.find((vote) => vote.id === id);

      if (!voteToUpdate) return { votesSpent, votesRemaining };

      const oldAmountDecimal = new Decimal(voteToUpdate.votes || "0");
      const newAmountDecimal = new Decimal(newAmount || "0");
      const difference = newAmountDecimal.minus(oldAmountDecimal);
      voteToUpdate.votes = newAmount;

      const newVotesSpent = new Decimal(userVoteParams?.votesSpent ?? "0")
        .plus(difference)
        .toString();

      const newVotesRemaining = new Decimal(
        userVoteParams?.votesRemaining ?? "0"
      )
        .minus(difference)
        .toString();

      return {
        votesSpent: newVotesSpent,
        votesRemaining: newVotesRemaining,
      };
    };

    const { votesSpent, votesRemaining } = constructVoteDifferential();

    if (mode === "proposed") {
      // update the proposed votes to match new value
      setProposedVotes((prevVotes) => {
        const voteIndex = prevVotes.findIndex(
          (vote) => vote.id === id
        );
        if (voteIndex < 0) return prevVotes;
        return [
          ...prevVotes.slice(0, voteIndex),
          { ...prevVotes[voteIndex], votes: newAmount },
          ...prevVotes.slice(voteIndex + 1),
        ];
      });
      // update the user voting params swr state to reflect the new differential
      mutateUserVotingParams(
        {
          ...userVoteParams,
          votesSpent,
          votesRemaining,
        },
        {
          revalidate: false,
        }
      );
    } else if (mode === "current") {
      // update the user voting params swr state to reflect the new differential
      const voteIndex = userVoteParams.userVotes.findIndex(
        (vote: UserVote) => vote.submissionId === id
      );
      const newUserVotes =
        voteIndex < 0
          ? [...userVoteParams.userVotes]
          : [
            ...userVoteParams.userVotes.slice(0, voteIndex),
            { ...userVoteParams.userVotes[voteIndex], votes: newAmount },
            ...userVoteParams.userVotes.slice(voteIndex + 1),
          ];
      setAreCurrentVotesDirty(true);
      mutateUserVotingParams(
        {
          ...userVoteParams,
          userVotes: newUserVotes,
          votesSpent,
          votesRemaining,
        },
        {
          revalidate: false,
        }
      );
    }
  };
  // get the votes payload ready for the API request
  const prepareVotes = () => {
    let runningSum = new Decimal(0);
    let castVotePayload = [];
    let optimisticVotes = [];

    for (const el of userVoteParams.userVotes) {
      const decimalAmount = new Decimal(el.votes || "0");
      if (decimalAmount.greaterThan(0)) {
        runningSum = runningSum.plus(decimalAmount);
        castVotePayload.push({
          submissionId: el.submissionId,
          votes: el.votes,
        });
        optimisticVotes.push(el);
      }
    }

    for (const el of proposedVotes) {
      const decimalAmount = new Decimal(el.votes || "0");
      if (decimalAmount.greaterThan(0)) {
        runningSum = runningSum.plus(decimalAmount);
        castVotePayload.push({
          submissionId: el.id,
          votes: el.votes,
        });
        optimisticVotes.push(el);
      }
    }




    return {
      runningSum,
      castVotePayload,
      optimisticVotes,
    };
  };
  // send votes to the API
  const submitVotes = async () => {
    const { runningSum, castVotePayload, optimisticVotes } = prepareVotes();
    if (castVotePayload.length === 0)
      return toast.error("Please add votes to your selections");
    if (runningSum.greaterThan(userVoteParams.totalVotingPower))
      return toast.error("Insufficient voting power");

    const prevProposedVotes = [...proposedVotes];

    // send the mutation request and optimistically update the cache
    // once the request completes, the cache will be updated with the response
    // if the request fails, the cache will be reverted to original value of userVoteParams

    const options = {
      optimisticData: () => {
        setProposedVotes([]);
        setAreCurrentVotesDirty(false);
        return {
          ...userVoteParams,
          userVotes: optimisticVotes,
          votesRemaining: new Decimal(userVoteParams?.votesRemaining || "0")
            .minus(runningSum)
            .toString(),
          votesSpent: new Decimal(userVoteParams?.votesSpent || "0")
            .plus(runningSum)
            .toString(),
        };
      },
      populateCache: (newData: {
        userVotingParams: UserVotingParams;
        success: boolean;
      }) => {
        return newData.userVotingParams;
      },
      rollbackOnError: true,
      revalidate: false,
    };

    try {
      await mutateUserVotingParams(
        apiCastVotes(contestId, castVotePayload, session.csrfToken),
        options
      );
      toast.success("Your votes have been submitted");
    } catch (err) {
      console.log(err);
      setProposedVotes(prevProposedVotes);
      setAreCurrentVotesDirty(true);
      mutateUserVotingParams(userVoteParams, { revalidate: false });
    }
  };

  return (
    <VoteActionContext.Provider
      value={{
        // fwd the user voting params
        areUserVotingParamsLoading,
        totalVotingPower: userVoteParams?.totalVotingPower || "0",
        votesSpent: userVoteParams?.votesSpent || "0",
        votesRemaining: userVoteParams?.votesRemaining || "0",
        currentVotes: userVoteParams?.userVotes || [],
        // along with endpoints from this API
        areCurrentVotesDirty,
        proposedVotes,
        removeAllVotes,
        removeSingleVote,
        addProposedVote,
        updateVoteAmount,
        submitVotes,
      }}
    >
      {children}
    </VoteActionContext.Provider>
  );
};

export function useVoteActionContext() {
  const context = useContext(VoteActionContext);
  if (context === undefined) {
    throw new Error(
      "useVoteActionContext must be used within a VoteActionProvider"
    );
  }
  return context;
}
