'use client'
import useSWR from 'swr';
import gql from 'graphql-tag';
import graphqlClient from '@/lib/graphql/initUrql';


const ContestSubmissionsDocument = gql`
  query Query($contestId: Int!) {
    contest(contestId: $contestId) {
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
  }
`;


const fetchSubmissionData = async (submissionUrl: string) => {
    return fetch(submissionUrl).then((res) => res.json());
}

const getSubmissions = async (contestId: number) => {
    // hit graphql endpoint
    // return submissions
    // fetch the submission data for each returned sub

    const response = await graphqlClient.query(ContestSubmissionsDocument, { contestId })
        .toPromise()
        .then(res => res.data.contest.submissions)
        .then(async submissions => {
            return await Promise.all(submissions.map(async (submission, idx) => {
                const data = await fetchSubmissionData(submission.url)
                return { ...submission, data: data } 
        }))})
        .catch(e => {
            console.log(e);
            return []
        })
    return response
}

const useTrackSubmissions = (contestId: number) => {
    const {data: liveSubmissions, isLoading, error}: {data: any, isLoading: boolean, error: any} = useSWR(`/ipfs/submissions/${contestId}`, () => getSubmissions(contestId), {refreshInterval: 60000})

    return {liveSubmissions, isLoading, error}
}


export default useTrackSubmissions;