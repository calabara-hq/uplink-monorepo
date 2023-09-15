"use client";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { useEffect, useRef, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import { RenderDetails } from "./ContestSidebar";
import { HiMenu } from "react-icons/hi";

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

const InfoDrawer = ({
  isDrawerOpen,
  handleClose,
  children,
}: {
  isDrawerOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}) => {
  const drawerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        document.body.style.overflow = "visible";
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerRef]);
  if (isDrawerOpen) {
    document.body.style.overflow = "hidden";
    return (
      <div className="drawer drawer-open fixed top-0 left-0 bottom-0 md:left-[62px] z-10 w-[calc(80vw - 62px)] h-screen bg-[#00000080] overflow-hidden ">
        <div className="drawer-side">
          <ul
            ref={drawerRef}
            className="menu flex flex-col gap-4 p-4 w-80 min-h-full bg-base-100 text-base-content shadow-black shadow-sm animate-scrollInX"
          >
            <h1 className="text-xl font-bold">Details</h1>
            {children}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

const MobileActions = ({
  contestId,
  spaceName,
  submitterRewards,
  voterRewards,
  votingPolicy,
  submitterRestrictions,
}: {
  contestId: string;
  spaceName: string;
  submitterRewards: any;
  voterRewards: any;
  votingPolicy: any;
  submitterRestrictions: any;
}) => {
  const { contestState, stateRemainingTime } = useContestState();
  const { proposedVotes } = useVoteActionContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!contestState) return null;

  if (contestState === "submitting") {
    return (
      <div className="flex lg:hidden">
        <StickyContainer>
          <div className="flex flex-row items-center gap-8 w-full">
            <button
              className="btn btn-ghost rounded-full"
              onClick={() => setIsDrawerOpen(true)}
            >
              <HiMenu className="w-8 h-8 font-bold text-t2" />
            </button>
            <div className="flex p-2 w-full">
              <Link
                href={`/${spaceName}/contest/${contestId}/studio`}
                className="btn btn-primary flex flex-1 normal-case rounded-r-none"
                draggable={false}
              >
                Submit
              </Link>
              <div className="flex items-center justify-center bg-base-100 rounded-r-xl">
                <p className="px-4 text-t2">{stateRemainingTime}</p>
              </div>
            </div>
          </div>
        </StickyContainer>
        <InfoDrawer
          isDrawerOpen={isDrawerOpen}
          handleClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <RenderDetails
            submitterRewards={submitterRewards}
            voterRewards={voterRewards}
            votingPolicy={votingPolicy}
            submitterRestrictions={submitterRestrictions}
          />
        </InfoDrawer>
      </div>
      // <div className="flex flex-col w-full bg-blue-200"></div>
    );
  } else if (contestState === "voting") {
    return (
      <div className="flex lg:hidden">
        <StickyContainer>
          <div className="flex flex-row items-center gap-8 w-full">
            <button
              className="btn btn-ghost rounded-full"
              onClick={() => setIsDrawerOpen(true)}
            >
              <HiMenu className="w-8 h-8 font-bold text-t2" />
            </button>
            <div className="flex p-2 w-full">
              {" "}
              <Link
                href={`/${spaceName}/contest/${contestId}/vote`}
                className="btn btn-warning flex flex-1 normal-case rounded-r-none indicator"
                draggable={false}
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
          </div>
        </StickyContainer>
        <InfoDrawer
          isDrawerOpen={isDrawerOpen}
          handleClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <RenderDetails
            submitterRewards={submitterRewards}
            voterRewards={voterRewards}
            votingPolicy={votingPolicy}
            submitterRestrictions={submitterRestrictions}
          />
        </InfoDrawer>
      </div>
    );
  }
};

export default MobileActions;
