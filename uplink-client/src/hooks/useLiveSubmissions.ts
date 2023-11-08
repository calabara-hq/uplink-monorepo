import useSWR from "swr";
import { mutateSubmissions } from "@/app/mutate";
import { useEffect } from "react";
import { Submission } from "@/types/submission";

// local client side fetch, don't use the server-only fetch
const fetchSubmissions = async (contestId: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
        query Query($contestId: ID!){
          contest(contestId: $contestId){
              submissions {
                  id
                  contestId
                  author
                  totalVotes
                  rank
                  created
                  type
                  url
                  version
              }
          }
      }`,
            variables: {
                contestId,
            },
        }),
    })
        .then((res) => res.json())
        .then((res) => res.data.contest)
        .then(res => res.submissions)
        .then(async (submissions) => {
            return await Promise.all(
                submissions.map(async (submission, idx) => {
                    const data = await fetch(submission.url).then((res) => res.json());
                    return { ...submission, data: data };
                })
            );
        });
    return data;
};



const useLiveSubmissions = (contestId: string) => {
    const {
        data: liveSubmissions,
        isLoading: areSubmissionsLoading,
        error: isSubmissionError,
        mutate: mutateSWRSubmissions,
    }: { data: Array<Submission>; isLoading: boolean; error: any; mutate: any } = useSWR(
        `submissions/${contestId}`,
        () => fetchSubmissions(contestId),
        { refreshInterval: 10000 }
    );

    const mutateLiveSubmissions = () => {
        mutateSWRSubmissions(); // mutate the SWR cache
        mutateSubmissions(contestId); // mutate the server cache
    };

    return {
        liveSubmissions,
        areSubmissionsLoading,
        isSubmissionError,
        mutateLiveSubmissions,
    }
}


export default useLiveSubmissions;