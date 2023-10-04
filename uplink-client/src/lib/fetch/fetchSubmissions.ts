"use server";
import handleNotFound from "../handleNotFound";

const fetchSubmissions = async (contestId: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET,
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
        next: { tags: [`submissions/${contestId}`], revalidate: 60 }, // cache submissions for 60 seconds
    })
        .then((res) => res.json())
        .then((res) => res.data.contest)
        .then(handleNotFound)
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

export default fetchSubmissions;