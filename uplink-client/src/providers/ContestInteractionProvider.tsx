"use client";

// used to manage contest interaction state
// track dynamic submissions, user submission parameters, and user voting parameters
// these values may be forwarded to child providers to manage state for specific contest interactions

import { createContext, useContext } from "react";
import useSWR from "swr";
import { useSession } from "./SessionProvider";
import { useContestState } from "./ContestStateProvider";
import { IToken } from "@/types/token";
import { OutputData } from "@editorjs/editorjs";
import fetchSubmissions from "@/lib/fetch/fetchSubmissions";

type SubmissionFormat = "video" | "image" | "text";

type BaseSubmission = {
  id: string;
  contestId: string;
  created: string;
  url: string;
  version: string;
  author?: `0x${string}`;
  totalVotes: string | null;
  rank: number | null;
};

export type TwitterSubmission = BaseSubmission & {
  type: "twitter";
  data: {
    type: SubmissionFormat;
    title: string;
    thread: {
      text?: string;
      previewAsset?: string;
      videoAsset?: string;
      assetSize?: number;
      assetType?: string;
    }[];
  };
};

export type StandardSubmission = BaseSubmission & {
  type: "standard";
  data: {
    type: SubmissionFormat;
    title: string;
    previewAsset?: string;
    videoAsset?: string;
    body?: OutputData;
  };
};

export type Submission = TwitterSubmission | StandardSubmission;

export type UserSubmissionParams = {
  maxSubPower: string;
  remainingSubPower: string;
  userSubmissions: { id: string }[];
  restrictionResults: {
    result: boolean;
    restriction: {
      restrictionType: string;
      tokenRestriction: {
        token: IToken;
        threshold: string;
      };
    };
  }[];
};

type UserVote = {
  votes: string;
  submissionId: string;
  submissionUrl: string;
};

export type UserVotingParams =
  | {
      totalVotingPower: string;
      votesRemaining: string;
      votesSpent: string;
      userVotes: UserVote[] | [];
    }
  | undefined;

export interface ContestInteractionProps {
  submissions: Submission[];
  areSubmissionsLoading: boolean;
  isSubmissionError: any;
  userSubmitParams: UserSubmissionParams;
  areUserSubmitParamsLoading: boolean;
  isUserSubmitParamsError: any;
  userVoteParams: UserVotingParams;
  areUserVotingParamsLoading: boolean;
  isUserVotingParamsError: any;
  mutateUserVotingParams: any; //(newParams: UserVotingParams, options?: any) => void;
  downloadGnosisResults: () => void;
  downloadUtopiaResults: () => void;
}

// fetcher functions

const getUserSubmissionParams = async (
  contestId: string,
  walletAddress: string
) => {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
              query GetUserSubmissionParams($contestId: ID!, $walletAddress: String) {
                  getUserSubmissionParams(contestId: $contestId, walletAddress: $walletAddress) {
                    maxSubPower
                    remainingSubPower
                    userSubmissions {
                        id
                    }
                    restrictionResults {
                      result
                      restriction {
                        restrictionType
                        tokenRestriction {
                          token {
                            address
                            decimals
                            symbol
                            tokenId
                            type
                          }
                          threshold
                        }
                      }
                    }
                  }
                }`,
      variables: {
        contestId,
        walletAddress,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.getUserSubmissionParams)
    .catch((err) => {
      return {
        userSubmissions: [],
        maxSubPower: 0,
        remainingSubPower: 0,
      };
    });
};

const getUserVotingParams = async (
  contestId: string,
  walletAddress: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query getUserVotingParams($contestId: ID!, $walletAddress: String) {
            getUserVotingParams(contestId: $contestId, walletAddress: $walletAddress) {
                totalVotingPower
                votesRemaining
                votesSpent
                userVotes {
                    votes
                    submissionId
                    submissionUrl
                }
            }
            }`,
      variables: {
        contestId,
        walletAddress,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.getUserVotingParams)
    .catch((err) => {
      return {
        totalVotingPower: "0",
        votesRemaining: "0",
        votesSpent: "0",
        userVotes: [],
      };
    });
  return response;
};

const getGnosisResults = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query Query($contestId: ID!){
          contest(contestId: $contestId){
            gnosisResults
          }
      }`,
      variables: {
        contestId,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.contest.gnosisResults);

  return data;
};

const getUtopiaResults = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query Query($contestId: ID!){
          contest(contestId: $contestId){
            utopiaResults
          }
      }`,
      variables: {
        contestId,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.contest.utopiaResults);

  return data;
};

const ContestInteractionContext = createContext<
  ContestInteractionProps | undefined
>(undefined);

export function ContestInteractionProvider({
  contestId,
  children,
}: {
  contestId: string;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { contestState } = useContestState();
  const isAuthed = status === "authenticated";
  const isSubmitPeriod = contestState === "submitting";
  const isVotingPeriod = contestState === "voting";

  const submitParamsSwrKey =
    isAuthed && isSubmitPeriod && session?.user?.address
      ? [`/api/userSubmitParams/${contestId}`, session.user.address]
      : null;
  const voteParamsSwrKey =
    isAuthed && isVotingPeriod && session?.user?.address
      ? [`/api/userVotingParams/${contestId}`, session.user.address]
      : null;

  // dynamic submissions. only active when contest is in submitting or voting stage
  const {
    data: liveSubmissions,
    isLoading: areSubmissionsLoading,
    error: isSubmissionError,
  }: { data: any; isLoading: boolean; error: any } = useSWR(
    `submissions/${contestId}`,
    () => fetchSubmissions(contestId),
    { refreshInterval: 10000 }
  );

  // user submission params
  // The key will be undefined until the user is authenticated and the contest is in the submitting stage

  const {
    data: userSubmitParams,
    isLoading: areUserSubmitParamsLoading,
    error: isUserSubmitParamsError,
  }: { data: any; isLoading: boolean; error: any } = useSWR(
    submitParamsSwrKey,
    () => getUserSubmissionParams(contestId, session.user.address)
  );

  // user voting params
  // The key will be undefined until the user is authenticated and the contest is in the voting stage
  const {
    data: userVoteParams,
    isLoading: areUserVotingParamsLoading,
    error: isUserVotingParamsError,
    mutate: mutateUserVotingParams,
  }: {
    data: UserVotingParams;
    isLoading: boolean;
    error: any;
    mutate: any;
  } = useSWR(voteParamsSwrKey, () =>
    getUserVotingParams(contestId, session.user.address)
  );

  const postProcessCsvResults = (results: string, type: string) => {
    const endcodedUri = encodeURI(results);
    const link = document.createElement("a");
    link.setAttribute("href", endcodedUri);
    link.setAttribute("download", `${contestId}-${type}-results.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const downloadGnosisResults = () => {
    getGnosisResults(contestId).then((res: string) =>
      postProcessCsvResults(res, "gnosis")
    );
  };

  const downloadUtopiaResults = () => {
    getUtopiaResults(contestId).then((res: string) =>
      postProcessCsvResults(res, "utopia")
    );
  };

  return (
    <ContestInteractionContext.Provider
      value={{
        submissions: liveSubmissions,
        areSubmissionsLoading,
        isSubmissionError,
        userSubmitParams,
        areUserSubmitParamsLoading,
        isUserSubmitParamsError,
        userVoteParams,
        areUserVotingParamsLoading,
        isUserVotingParamsError,
        mutateUserVotingParams,
        downloadGnosisResults,
        downloadUtopiaResults,
      }}
    >
      {children}
    </ContestInteractionContext.Provider>
  );
}

export function useContestInteractionState() {
  const context = useContext(ContestInteractionContext);
  if (context === undefined) {
    throw new Error(
      "useContestInteractionState must be used within a ContestInteractionProvider"
    );
  }
  return context;
}
