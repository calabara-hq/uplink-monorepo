import { useSession } from "@/providers/SessionProvider";
import useSWR from "swr";
import graphqlClient from "@/lib/graphql/initUrql";
import gql from "graphql-tag";
import { useContestState } from "@/providers/ContestStateProvider";



const UserSubmissionParamsDocument = gql`
    query Query($contestId: ID!) {
    getUserSubmissionParams(contestId: $contestId) {
        maxSubPower
        remainingSubPower
        userSubmissions {
            author
            contestId
            created
            id
            type
            url
            version
        }
    }
    }
`;


export const getUserSubmissionParams = async (contestId: number) => {
    const response = await graphqlClient.query(UserSubmissionParamsDocument, { contestId })
        .toPromise()
        .then(res => res.data.getUserSubmissionParams)
        .catch((e) => {
            console.log(e)
            return {
                userSubmissions: [],
                maxSubPower: 0,
                remainingSubPower: 0
            }
        })

    return response
}



const useSubmitParams = (contestId: number) => {
    const { data: session, status } = useSession();
    const { contestState } = useContestState();

    const isAuthed = status === "authenticated"
    const isSubmitPeriod = contestState === "submitting";

    // The key will be undefined until the user is authenticated and the contest is in the submitting stage

    const swrKey = isAuthed && isSubmitPeriod && session?.user?.address
        ? [`/api/userSubmitParams/${contestId}`, session.user.address]
        : null;

    const { data: userSubmitParams }: { data: any } = useSWR(swrKey, () => getUserSubmissionParams(contestId));

    return userSubmitParams;
};


export default useSubmitParams;