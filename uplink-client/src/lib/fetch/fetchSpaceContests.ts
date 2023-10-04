// iterate a list of contests and return the prompts for each
"use server";
import handleNotFound from "../handleNotFound";

const fetchSpaceContests = async (spaceName: string) => {

    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET,
        },
        body: JSON.stringify({
            query: `
                query space($name: String!){
                  space(name: $name) {
                    contests {
                        id
                        tweetId
                        promptUrl
                        deadlines {
                          endTime
                          snapshot
                          startTime
                          voteTime
                        }
                        metadata {
                          category
                          type
                        }
                    }
                  }
              }`,
            variables: {
                name: spaceName,
            },
        }),
        next: { tags: [`space/${spaceName}/contests`], revalidate: 60 },
    })
        .then((res) => res.json())
        .then(res => res.data.space)
        .then(handleNotFound)
        .then((res) => res.contests)
        .then(async contests => {
            return await Promise.all(
                contests.map(async (contest) => {
                    // fetch prompt url
                    const promptData = await fetch(contest.promptUrl).then((res) =>
                        res.json()
                    );
                    return {
                        ...contest,
                        promptData,
                    };
                })
            );
        })
    return data;
}

export default fetchSpaceContests;