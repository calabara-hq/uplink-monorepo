import "server-only"
import handleNotFound from "../handleNotFound";

const fetchSingleSubmission = async (submissionId: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
          query submission($submissionId: ID!){
            submission(submissionId: $submissionId) {
              author
              created
              rank
              totalVotes
              type
              url
              version
            }
        }`,
            variables: {
                submissionId,
            },
        }),
        next: { tags: [`submission/${submissionId}`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.submission)
        .then(handleNotFound)
        .then(async res => {
            const data = await fetch(res.url).then((res) => res.json());
            return { ...res, data: data };
        })

    return data;
};

export default fetchSingleSubmission;