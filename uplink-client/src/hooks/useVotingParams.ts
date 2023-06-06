import { useSession } from "@/providers/SessionProvider";
import useSWR from "swr";
import graphqlClient from "@/lib/graphql/initUrql";
import gql from "graphql-tag";
import { useContestState } from "@/providers/ContestStateProvider";

type UserVote = {
  votes: string;
  submissionId: string;
}

export interface UserVotingParams {
  maxVotingPower: string;
  votesRemaining: string;
  votesSpent: string;
  userVotes: UserVote[];
}



const UserVotingParamsDocument = gql`
  query Query($contestId: ID!) {
    getUserVotingParams(contestId: $contestId) {
      totalVotingPower
      userVotes {
        votes
        submissionId
      }
      votesRemaining
      votesSpent
    }
  }
`;


// this will only be called when the user is authenticated and has a wallet address
// because of this, we will return a default value if the query fails

const getUserVotingParams = async (contestId: number) => {
  const response = await graphqlClient
    .query(UserVotingParamsDocument, { contestId })
    .toPromise()
    .then((res) => res.data.getUserVotingParams)
    .catch((e) => {
      console.log(e);
      return {
        totalVotingPower: "0",
        votesRemaining: "0",
        votesSpent: "0",
        userVotes: [],
      };
    });
  return response;
};


const useVotingParams = (contestId: number) => {
  const { data: session, status } = useSession();
  const { contestState } = useContestState();


  const isAuthed = status === "authenticated"
  const isVotingPeriod = contestState === "voting";

  // The key will be undefined until the user is authenticated and the contest is in the voting stage

  const swrKey = isAuthed && isVotingPeriod && session?.user?.address
    ? [`/api/userVotingParams/${contestId}`, session.user.address]
    : null;

  const { data: userVotingParams }: { data: any } = useSWR(swrKey, () => getUserVotingParams(contestId));

  return userVotingParams;
};




export default useVotingParams;