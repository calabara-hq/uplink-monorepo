"use client";
import { useTicks } from "@/hooks/useTicks";
import { FetchSingleContestResponse } from "@/lib/fetch/fetchContest";
import { ContestState } from "@/types/contest";
import { calculateContestStatus } from "@/utils/staticContestState";
import React, { createContext, useState } from "react"


export type ContestStateContextValue = {
    contestState: ContestState | null,
    stateRemainingTime: string | null,
    isLoading: boolean,
    tweetId: string,
    type: string,
    category: string,
    contestAdmins: string[],
}

export const ContestStateContext = createContext?.<ContestStateContextValue | undefined>(
    undefined
);

export const ContestStateProvider = ({ contest, children }: { contest: FetchSingleContestResponse, children: React.ReactNode }) => {
    const [contestState, setContestState] = useState<ContestState | null>(null);
    const [stateRemainingTime, setStateRemainingTime] = useState<string | null>(null);

    const update = (data: FetchSingleContestResponse) => {
        if (!data) return
        const { contestState: v1, stateRemainingTime: v2 } = calculateContestStatus(data.deadlines, data.metadata.type, data.tweetId);
        setContestState(v1);
        setStateRemainingTime(v2)
    }

    useTicks(() => update(contest))

    const value = {
        isLoading: contestState === null,
        contestState,
        stateRemainingTime,
        tweetId: contest.tweetId,
        type: contest.metadata.type,
        category: contest.metadata.category,
        contestAdmins: contest.space.admins.map((admin) => admin.address),
    }
    return (
        <ContestStateContext.Provider value={value}>
            {children}
        </ContestStateContext.Provider>
    )
}

export const useContestState = () => {
    const context = React.useContext(ContestStateContext);
    if (context === undefined) {
        throw new Error(
            "useContestState must be used within a ContestStateProvider"
        );
    }
    return context;
}