"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from "date-fns";

export interface ContestStateProps {
  contestAdmins: string[];
  contestState: string | null;
  stateRemainingTime: string | null;
  category: string;
  type: string;
  tweetId: string | null;
}

const ContestStateContext = createContext<ContestStateProps | undefined>(
  undefined
);

// this is a bit of an anti pattern but it is done to make navigation instant
// the alternative would awaiting the promise in the layout component, but that would block the navigation
// we'll make the ugliness-tradeoff for now with plans to redesign later

export function ContestStateProvider({
  children,
  contestPromise,
}: {
  children: React.ReactNode;
  contestPromise: Promise<any>;
}) {
  const [contestState, setContestState] = useState<string | null>(null);
  const [stateRemainingTime, setStateRemainingTime] = useState<string>("");
  const [contestData, setContestData] = useState<any>(null);

  useEffect(() => {
    const processContest = async (contest: Promise<any>) => {
      // await the preloaded promise;
      const data = await contest;
      // extract the data from the promise
      setContestData(data);
    };

    processContest(contestPromise);
  }, []);

  useEffect(() => {
    if (contestData) {
      const { metadata, deadlines, tweetId } = contestData;
      if (metadata.type === "twitter" && !tweetId) {
        setContestState("pending");
        setStateRemainingTime(null);
        return;
      }
      const { startTime, voteTime, endTime } = deadlines;
      const start = parseISO(startTime);
      const vote = parseISO(voteTime);
      const end = parseISO(endTime);

      if (new Date() > end) return setContestState("closed");

      const interval = setInterval(() => {
        const now = new Date();
        let nextDeadline = end;
        if (now < start) {
          setContestState("pending");
          nextDeadline = start;
        } else if (now < vote) {
          setContestState("submitting");
          nextDeadline = vote;
        } else if (now < end) {
          setContestState("voting");
        } else {
          setContestState("closed");
          clearInterval(interval);
        }

        const seconds = differenceInSeconds(nextDeadline, now);
        const minutes = differenceInMinutes(nextDeadline, now);
        const hours = differenceInHours(nextDeadline, now);
        const days = differenceInDays(nextDeadline, now);
        if (days > 0) {
          setStateRemainingTime(`${days} days`);
        } else if (hours > 0) {
          setStateRemainingTime(`${hours} hrs`);
        } else if (minutes > 0) {
          setStateRemainingTime(`${minutes} mins`);
        } else if (seconds < 59) {
          setStateRemainingTime(`${seconds} s`);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [contestData]);

  return (
    <ContestStateContext.Provider
      value={{
        contestState,
        stateRemainingTime,
        category: contestData?.metadata.category,
        type: contestData?.metadata.type,
        tweetId: contestData?.tweetId,
        contestAdmins:
        contestData?.space.admins?.map((admin: any) => {
          return admin.address;
        }) ?? [],
      }}
    >
      {children}
    </ContestStateContext.Provider>
  );
}

export function useContestState() {
  const context = useContext(ContestStateContext);
  if (context === undefined) {
    throw new Error(
      "useContestState must be used within a ContestStateProvider"
    );
  }
  return context;
}
