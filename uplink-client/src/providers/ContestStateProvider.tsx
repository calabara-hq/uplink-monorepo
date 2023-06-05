"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from "date-fns";

export interface ContestStateProps {
  contestState: string | null;
  stateRemainingTime: string;
}

const ContestStateContext = createContext<ContestStateProps | undefined>(
  undefined
);

export function ContestStateProvider({
  children,
  deadlines,
}: {
  children: React.ReactNode;
  deadlines: {
    startTime: string;
    voteTime: string;
    endTime: string;
  };
}) {
  const [contestState, setContestState] = useState<string | null>(null);
  const [stateRemainingTime, setStateRemainingTime] = useState<string>("");

  useEffect(() => {
    const { startTime, voteTime, endTime } = deadlines;
    const start = parseISO(startTime);
    const vote = parseISO(voteTime);
    const end = parseISO(endTime);

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
        setContestState("end");
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
      } else {
        setStateRemainingTime(`${seconds} s`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [deadlines]);

  return (
    <ContestStateContext.Provider value={{ contestState, stateRemainingTime }}>
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
