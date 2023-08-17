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

// const getSubmissions = async (contestId: string) => {
//     // hit graphql endpoint
//     // return submissions
//     // fetch the submission data for each returned sub

//     const response = await graphqlClient.query(ContestSubmissionsDocument, { contestId })
//         .toPromise()
//         .then(res => res.data.contest.submissions)
//         .then(async submissions => {
//             return await Promise.all(submissions.map(async (submission, idx) => {
//                 const data = await fetchSubmissionData(submission.url)
//                 return { ...submission, data: data } 
//         }))})
//         .catch(e => {
//             console.log(e);
//             return []
//         })
//     return response
// }

const useTrackSubmissions = (contestId: string) => {
    const { data: liveSubmissions, isLoading, error }: { data: any, isLoading: boolean, error: any } = useSWR(`/ipfs/submissions/${contestId}`, () => getSubmissions(contestId), { refreshInterval: 10000 })

    return { liveSubmissions, isLoading, error }
}


export default useTrackSubmissions;