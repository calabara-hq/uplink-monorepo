"use client";
import { useContestState } from "@/providers/ContestStateProvider";
import { StatusLabel } from "./ContestLabels";
import type { ContestState } from "@/types/contest";

const LiveContestState = () => {
  const { contestState } = useContestState();
  if (!contestState)
    return <div className="rounded-xl w-10 h-5 shimmer bg-base-100" />;
  return <StatusLabel status={contestState as ContestState} />;
};

export default LiveContestState;
