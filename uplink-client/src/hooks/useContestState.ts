"use client"
import { ContestState, ReadableContest } from "@/types/contest";
import { calculateContestStatus } from "@/utils/staticContestState";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { useTicks } from "./useTicks";

const fetcher = async (contestId: string) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
              query Contest($contestId: ID!) {
                contest(contestId: $contestId) {
                  id
                  spaceId
                  chainId
                  created
                  tweetId
                  space {
                    id
                    name
                    displayName
                    logoUrl
                    admins {
                      address
                    }
                  }
                  metadata {
                    category
                    type
                  }
                  deadlines {
                    startTime
                    voteTime
                    endTime
                    snapshot
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
  return data;
};

export const useContestState = (contestId: string) => {
  const [contestState, setContestState] = useState<ContestState | null>(null);
  const [stateRemainingTime, setStateRemainingTime] = useState<string | null>(null);
  const {
    data,
    isLoading: isLoading,
    error: isError,
  }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWRImmutable(
    contestId,
    fetcher,
  );


  const update = (data: ReadableContest) => {
    if (!data) return
    const { contestState: v1, stateRemainingTime: v2 } = calculateContestStatus(data.deadlines, data.metadata.type, data.tweetId);
    setContestState(v1);
    setStateRemainingTime(v2)
  }

  useTicks(() => update(data))

  return {
    isLoading,
    contestState,
    stateRemainingTime,
    tweetId: data?.tweetId,
    type: data?.metadata?.type,
    category: data?.metadata?.category,
    contestAdmins: data?.space?.admins,
  }

}