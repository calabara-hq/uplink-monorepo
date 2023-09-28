import useSWR from "swr";


// return whether a tweet has been queued for a given contest

const getTweetQueueStatus = async (contestId: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
            query Query($contestId: ID!) {
                isContestTweetQueued(contestId: $contestId)
              }`,
            variables: {
                contestId,
            },
        }),
    })

        .then((res) => res.json())
        .then(res => res.data.isContestTweetQueued)
};




const useTweetQueueStatus = (contestId: string) => {
    const swrKey = `/api/tweetQueueStatus/${contestId}`
    const { data: isTweetQueued, error, isLoading, mutate: mutateIsTweetQueued } = useSWR(swrKey, () => getTweetQueueStatus(contestId), { refreshInterval: 1000 * 60 });
    return { isTweetQueued, isLoading, mutateIsTweetQueued };
}


export default useTweetQueueStatus;