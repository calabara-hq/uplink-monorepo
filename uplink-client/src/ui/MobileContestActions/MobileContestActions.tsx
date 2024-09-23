"use client";;
import { useVote } from "@/hooks/useVote";
import { useContestState } from "@/providers/ContestStateProvider";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../DesignKit/Button";
import { FaVoteYea } from "react-icons/fa";

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="shimmer h-16 w-full bg-base-200 rounded-lg" />
    </div>
  )
}

const StickyContainer = ({ children }: { children: React.ReactNode }) => {
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState<number | null>(null);

  useEffect(() => {
    // Set the initial position of the element relative to the page when the component mounts
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
    }
  }, []);

  useScrollPosition(
    ({ currPos }) => {
      if (elementTop !== null) {
        // Check if we have scrolled past the element's top position
        if (currPos.y < -elementTop + 4) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    },
    [elementTop]
  );

  return (
    <div
      ref={elementRef}
      className={`${isSticky ? "fixed top-0 left-0 bg-gradient-to-b from-[#121212] h-32 sm:pl-[80px] p-4 z-10" : "relative"} w-full flex flex-col m-auto`}
    >
      {children}
    </div>
  );
};

const MobileContestActions = ({
  contestId,

}: {
  contestId: string;

}) => {
  const { contestState, stateRemainingTime } = useContestState();
  const { proposedVotes } = useVote(contestId);

  if (!contestState) return null;

  if (contestState === "submitting") {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
          <p>This contest is accepting submissions for the next <b>{stateRemainingTime}</b>.</p>
        </div>
        <StickyContainer>
          <Link href={`/contest/${contestId}/studio`} passHref>
            <Button variant="default" className="w-full" size="lg"><b>Submit</b></Button>
          </Link>
        </StickyContainer>
      </div>
    )


  } else if (contestState === "voting") {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-base-100 rounded-lg p-2 flex-col text-t2">
          <p>This contest is in the voting phase for the next <b>{stateRemainingTime}</b>.</p>
        </div>
        <StickyContainer>
          <div className="grid grid-cols-[24.5%_1%_74.5%]">
            <div className="rounded-lg flex items-center justify-center gap-2 bg-base-200 text-primary11 font-bold">
              <FaVoteYea className="w-5 h-5" />
              <div>{proposedVotes.length}</div>
            </div>
            <div />
            <Link href={`/contest/${contestId}/vote`} passHref>
              <Button variant="default" disabled={proposedVotes.length === 0} className="w-full" size="lg"><b>Cast votes</b></Button>
            </Link>
          </div>
        </StickyContainer>
      </div>
    )

  }
};

export default MobileContestActions;
