import handleNotFound from "../handleNotFound";
import { Deadlines, Metadata, ContestPromptData } from '@/types/contest';



export type SpaceContest = {
    id: string;
    tweetId: string | null;
    deadlines: Deadlines
    metadata: Metadata;
    promptUrl: string;
    promptData: ContestPromptData;
}

export type FetchSpaceContestResponse = {
    id: string;
    logoUrl: string;
    contests: Array<SpaceContest>
}


const fetchSpaceContests = async (spaceName: string): Promise<FetchSpaceContestResponse> => {

    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": process.env.API_SECRET!,
        },
        body: JSON.stringify({
            query: `
                query space($name: String!){
                  space(name: $name) {
                    id
                    logoUrl
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
        .then(async spaceWithContests => {
            const resolvedContests = await Promise.all(
                spaceWithContests.contests.map(async (contest) => {
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
            return {
                ...spaceWithContests,
                contests: resolvedContests,
            }
        })
    return data;
}

export default fetchSpaceContests;