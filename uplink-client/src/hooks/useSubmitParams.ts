import { useSession } from "@/providers/SessionProvider";
import useSWR from "swr";
import { useContestState } from "@/providers/ContestStateProvider";


const getUserSubmissionParams = async (contestId: string, walletAddress: string) => {
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
        walletAddress
      },
    }),
  })
    .then((res) => res.json())
    .then(res => res.data.getUserSubmissionParams)
    .catch(err => {
      return {
        userSubmissions: [],
        maxSubPower: 0,
        remainingSubPower: 0
      }
    })
};

const useSubmitParams = (contestId: string) => {
  const { data: session, status } = useSession();
  const { contestState } = useContestState();

  const isAuthed = status === "authenticated"
  const isSubmitPeriod = contestState === "submitting";

  // The key will be undefined until the user is authenticated and the contest is in the submitting stage

  const swrKey = isAuthed && isSubmitPeriod && session?.user?.address
    ? [`/api/userSubmitParams/${contestId}`, session.user.address]
    : null;

  const { data: userSubmitParams, isLoading }: { data: any, isLoading: any } = useSWR(swrKey, () => getUserSubmissionParams(contestId, session.user.address));

  return { userSubmitParams, isLoading };
};


export default useSubmitParams;