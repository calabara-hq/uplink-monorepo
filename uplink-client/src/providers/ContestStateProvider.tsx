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

export function ContestStateProvider({
  children,
  deadlines,
  metadata,
  tweetId,
  contestAdmins,
}: {
  children: React.ReactNode;
  deadlines: {
    startTime: string;
    voteTime: string;
    endTime: string;
  };
  metadata: {
    category: string;
    type: "twitter" | "standard";
  };
  tweetId: string | null;
  contestAdmins: string[];
}) {
  const [contestState, setContestState] = useState<string | null>(null);
  const [stateRemainingTime, setStateRemainingTime] = useState<string>("");
  useState<number>(0);
  const { category, type } = metadata;
  useEffect(() => {
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
  }, [deadlines]);

  return (
    <ContestStateContext.Provider
      value={{
        contestState,
        stateRemainingTime,
        category,
        type,
        tweetId,
        contestAdmins,
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
