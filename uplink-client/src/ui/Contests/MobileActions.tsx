"use client";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { useEffect, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { useVoteActionContext } from "@/providers/VoteActionProvider";

// This is essentially the mobile version of the ContestSidebar

// if we want stuff to stick to the screen on scroll
const StickyContainer = ({ children }: { children: React.ReactNode }) => {
  const [elementStyle, setElementStyle] = useState("relative");

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const shouldStick = currPos.y < -350;
      const shouldBeStyle = shouldStick
        ? "fixed top-0 left-0 bg-gradient-to-b from-[#121212] items h-32 md:pl-[64px]"
        : "relative";

      if (shouldBeStyle === elementStyle) return;

      setElementStyle(shouldBeStyle);
    },
    [elementStyle]
  );
  return (
    <div className={`${elementStyle} w-full flex flex-col z-10 m-auto`}>
      {children}
    </div>
  );
};

const MobileActions = ({
  contestId,
  spaceName,
}: {
  contestId: string;
  spaceName: string;
}) => {
  const { contestState, stateRemainingTime } = useContestState();
  const { areUserVotingParamsLoading } = useContestInteractionState();
  const { proposedVotes } = useVoteActionContext();
  if (!contestState) return null;
  if (contestState === "submitting") {
    return (
      <div className="flex lg:hidden">
        <StickyContainer>
          <div className="flex flex-row w-full p-2">
            <Link
              href={`${spaceName}/contest/${contestId}/studio`}
              className="btn btn-primary flex flex-1 normal-case rounded-r-none"
            >
              Submit
            </Link>
            <div className="flex items-center justify-center bg-base-100 rounded-r-xl">
              <p className="px-4 text-t2">{stateRemainingTime}</p>
            </div>
          </div>
        </StickyContainer>
      </div>
      // <div className="flex flex-col w-full bg-blue-200"></div>
    );
  } else if (contestState === "voting") {
    return (
      <div className="flex lg:hidden">
        <StickyContainer>
          <div className="flex flex-row w-full p-2">
            <Link
              href={`${spaceName}/contest/${contestId}/vote`}
              className="btn btn-primary flex flex-1 normal-case rounded-r-none indicator"
            >
              Vote
              {proposedVotes.length > 0 && (
                <span className="indicator-item badge badge-warning rounded-full">
                  <p>{proposedVotes.length}</p>
                </span>
              )}
            </Link>
            <div className="flex items-center justify-center bg-base-100 rounded-r-xl">
              <p className="px-4 text-t2">{stateRemainingTime}</p>
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
};

export default MobileActions;
