import { useSession } from "@/providers/SessionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import useSWR from "swr";
import { IToken } from "@/types/token";

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

export type UserVote = {
    id: string;
    votes: string;
    submissionId: string;
    submissionUrl: string;

};

export type UserVotingParams =
    | {
        totalVotingPower: string;
        votesRemaining: string;
        votesSpent: string;
        userVotes: Array<UserVote>;
    }
    | undefined;

export interface ContestInteractionProps {
    userSubmitParams: UserSubmissionParams;
    areUserSubmitParamsLoading: boolean;
    isUserSubmitParamsError: any;
    userVoteParams: UserVotingParams;
    areUserVotingParamsLoading: boolean;
    isUserVotingParamsError: any;
    mutateUserVotingParams: any; //(newParams: UserVotingParams, options?: any) => void;
    downloadGnosisResults: () => void;
}

// fetcher functions

const getUserSubmissionParams = async (
    contestId: string,
    csrfToken: string | null
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            query: `
                query GetUserSubmissionParams($contestId: ID!) {
                    getUserSubmissionParams(contestId: $contestId) {
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
    csrfToken: string | null
) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            query: `
          query getUserVotingParams($contestId: ID!) {
              getUserVotingParams(contestId: $contestId) {
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


export const useContestInteractionApi = (contestId: string) => {

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

    // user submission params
    // The key will be undefined until the user is authenticated and the contest is in the submitting stage

    const {
        data: userSubmitParams,
        isLoading: areUserSubmitParamsLoading,
        error: isUserSubmitParamsError,
    }: { data: any; isLoading: boolean; error: any } = useSWR(
        submitParamsSwrKey,
        () => getUserSubmissionParams(contestId, session.csrfToken)
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
        getUserVotingParams(contestId, session.csrfToken)
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

    return {
        userSubmitParams,
        areUserSubmitParamsLoading,
        isUserSubmitParamsError,
        userVoteParams,
        areUserVotingParamsLoading,
        isUserVotingParamsError,
        mutateUserVotingParams,
        downloadGnosisResults,
    }
}