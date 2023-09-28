"import server-only";

const fetchActiveContests = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET,
        },
        body: JSON.stringify({
            query: `
        query ActiveContests {
          activeContests {
            id
            tweetId
            promptUrl
            deadlines {
              startTime
              voteTime
              endTime
            }
            metadata {
              type
              category
            }
            space {
              logoUrl
              displayName
              name
            }
          }
        }`,
        }),
        next: { revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.activeContests);
    return data;
};

export default fetchActiveContests;