"use client";

import { calculateContestStatus } from "@/utils/staticContestState";
import {
  CategoryLabel,
  ContestCategory,
  RemainingTimeLabel,
  StatusLabel,
} from "../ContestLabels/ContestLabels";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";

const ContestCard = ({
  contestId,
  promptUrl,
  linkTo,
  metadata,
  deadlines,
  spaceName,
  spaceDisplayName,
  spaceLogo,
  tweetId,
}: {
  contestId: string;
  promptUrl: string;
  linkTo: string;
  metadata: { category: ContestCategory; type: "twitter" | "standard" };
  deadlines: { startTime: string; voteTime: string; endTime: string };
  spaceName: string;
  spaceDisplayName: string;
  spaceLogo: string;
  tweetId: string | null;
}) => {
  const showSpace = spaceName && spaceDisplayName && spaceLogo;
  const { contestState, stateRemainingTime } = calculateContestStatus(
    deadlines,
    metadata.type,
    tweetId
  );
  return (
    <Link
      className="card bg-base-100 
    cursor-pointer border border-border rounded-2xl p-4 overflow-hidden w-full h-full transform 
    transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform"
      href={linkTo}
    >
      <div className="card-body items-center p-0">
        <div className="flex flex-col gap-2 items-center">
          <div className="avatar online">
            <Image
              src={spaceLogo}
              width={82}
              height={82}
              alt="spaceLogo"
              className="mask mask-squircle"
            />
          </div>
          <h1 className="font-bold text-2xl">{spaceDisplayName}</h1>
        </div>
        {/*@ts-expect-error*/}
        {/* <PromptSummary promptUrl={promptUrl} /> */}
        <div className="flex flex-row gap-2">
          <CategoryLabel category={metadata.category} />
          <StatusLabel status={contestState} />
        </div>
        <RemainingTimeLabel remainingTime={stateRemainingTime} />
      </div>
    </Link>
  );
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      y: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      y: 0,
      opacity: 0,
    };
  },
};

/**
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 */

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
const ContestCardCarousel = ({ contests }) => {
  const { width } = useWindowSize();
  const numCards = useMemo(() => {
    return width < 768 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
  }, [width]);

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage((prevState) => {
      const [prevPage] = prevState;
      const newPage = prevPage + newDirection * numCards;

      if (newPage >= 0 && newPage <= contests.length - numCards) {
        return [newPage, newDirection];
      }

      return prevState;
    });
  };



  return (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={page}
          className="carousel rounded-box flex overflow-hidden w-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          {/* Display the three cards */}
          {contests.slice(page, page + numCards).map((contest, index) => (
            <div
              key={index}
              className="carousel-item w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
            >
              <ContestCard
                contestId={contest.id}
                promptUrl={contest.promptUrl}
                spaceName={contest.space.name}
                spaceDisplayName={contest.space.displayName}
                spaceLogo={contest.space.logoUrl}
                linkTo={`${contest.space.name}/contests/${contest.id}`}
                metadata={contest.metadata}
                deadlines={contest.deadlines}
                tweetId={contest.tweetId}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      {page > 0 && (
        <div className="btn" onClick={() => paginate(-1)}>
          {"prev"}
        </div>
      )}
      {page + numCards < contests.length && (
        <div className="btn" onClick={() => paginate(1)}>
          {"next"}
        </div>
      )}
    </>
  );

  return (
    <div className="carousel carousel-start w-full p-4 space-x-4 rounded-box">
      {contests.map((contest, idx) => {
        return (
          <div
            className="carousel-item w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            id={`card-${idx}`}
            key={idx}
          >
            <ContestCard
              contestId={contest.id}
              promptUrl={contest.promptUrl}
              spaceName={contest.space.name}
              spaceDisplayName={contest.space.displayName}
              spaceLogo={contest.space.logoUrl}
              linkTo={`${contest.space.name}/contests/${contest.id}`}
              metadata={contest.metadata}
              deadlines={contest.deadlines}
              tweetId={contest.tweetId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ContestCardCarousel;
