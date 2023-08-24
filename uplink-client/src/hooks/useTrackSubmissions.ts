'use client'
import useSWR from 'swr';

const fetchSubmissionData = async (submissionUrl: string) => {
    return fetch(submissionUrl).then((res) => res.json());
};

const getSubmissions = async (contestId: string) => {
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
        .then((res) => res.data.contest.submissions)
        .then(async (submissions) => {
            return await Promise.all(
                submissions.map(async (submission, idx) => {
                    const data = await fetchSubmissionData(submission.url);
                    return { ...submission, data: data };
                })
            );
        });
    return data;
};

const useTrackSubmissions = (contestId: string) => {
    const { data: liveSubmissions, isLoading, error }: { data: any, isLoading: boolean, error: any } = useSWR(`submissions/${contestId}`, () => getSubmissions(contestId), { refreshInterval: 10000 })
    //const {data: contestResults, isLoading: areContestResultsLoading, error: contestResultsError} = useSWR(`contestResults/${contestId}`, () => getContestResults(contestId))

    return { liveSubmissions, isLoading, error }
}


export default useTrackSubmissions;