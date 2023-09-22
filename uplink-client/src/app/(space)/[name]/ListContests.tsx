"use client";
import Link from "next/link";
import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { ContestCategory } from "@/types/contest";
import {
  CategoryLabel,
  StatusLabel,
  RemainingTimeLabel,
  ContestState,
} from "@/ui/ContestLabels/ContestLabels";
import { calculateContestStatus } from "@/utils/staticContestState";

import useSWR from "swr";
import { revalidateDataCache } from "../../actions";
import { startTransition } from "react";
import fetchSpaceContests from "@/lib/fetch/fetchSpaceContests";

export const useListContests = (spaceName: string) => {
  const {
    data: contests,
    isLoading: areContestsLoading,
    error: isContestListError,
    mutate,
  }: { data: any; isLoading: boolean; error: any; mutate: any } = useSWR(
    `space/${spaceName}/contests`,
    () => fetchSpaceContests(spaceName)
  );

  const mutateContests = async (spaceName: string) => {
    mutate(); // reval client cache
    startTransition(() => {
      revalidateDataCache([`space/${spaceName}/contests`]); // reval server cache
    });
  };

  return {
    contests,
    areContestsLoading,
    isContestListError,
    mutateContests,
  };
};

const ContestCard = ({
  spaceName,
  contestId,
  contestTitle,
  category,
  contestState,
  remainingTime,
}: {
  spaceName: string;
  contestId: string;
  contestTitle: string;
  category: ContestCategory;
  contestState: ContestState;
  remainingTime: string;
}) => {
  return (
    <Link href={`${spaceName}/contest/${contestId}`}>
      <div
        key={contestId}
        className="card bg-base-100 
        cursor-pointer border border-border rounded-2xl p-4 h-full max-h-36 overflow-hidden w-full transform transition-transform duration-300 hover:-translate-y-1.5 hover:translate-x-0 will-change-transform"
      >
        <div className="card-body items-start p-0">
          <div className="flex w-full">
            <div className="flex-grow ">
              <h2
                className={`card-title mb-0 normal-case break-all line-clamp-2`}
              >
                {contestTitle}
              </h2>
            </div>
            <div className="ml-2">
              <CategoryLabel category={category} />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <StatusLabel status={contestState} />
            <RemainingTimeLabel remainingTime={remainingTime} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const ListContests = ({ spaceName }: { spaceName: string }) => {
  const [isAllContests, setIsAllContests] = useState(false);
  const { contests } = useListContests(spaceName);
  const now = new Date().toISOString();

  const filteredContests = isAllContests
    ? contests
    : contests.filter((contest) => {
        return contest.deadlines.endTime > now;
      });

  return (
    <div className="flex flex-col w-full lg:w-3/4 ml-auto mr-auto items-center gap-4 border-2 border-border p-6 rounded-xl shadow-primary shadow-lg min-h-[500px]">
      <div className="flex flex-col lg:flex-row w-full lg:justify-between items-center">
        <h1 className="text-3xl font-bold">Contests</h1>
        <div
          tabIndex={0}
          className="tabs tabs-boxed content-center p-1 bg-transparent text-white font-bold"
        >
          <span
            onClick={() => setIsAllContests(false)}
            className={`tab ${!isAllContests && "tab-active"}`}
          >
            Active
          </span>
          <span
            onClick={() => setIsAllContests(true)}
            className={`tab ${isAllContests && "tab-active"}`}
          >
            All Contests
          </span>

          <Link href={`${spaceName}/contest/create`} className="tab">
            <span>New</span>
            <HiSparkles className="h-5 w-5 text-secondary pl-0.5" />
          </Link>
        </div>
      </div>

      {filteredContests.length === 0 && isAllContests && (
        <div className="card bg-base-100 m-auto border-2 border-border">
          <div className="card-body">
            <p>This space has not yet hosted any contests. Check back later!</p>
          </div>
        </div>
      )}
      {filteredContests.length === 0 && !isAllContests && (
        <div className="card bg-base-100 m-auto border-2 border-border">
          <div className="card-body">
            <p>No active contests</p>
            <button
              onClick={() => setIsAllContests(true)}
              className="btn btn-sm btn-primary lowercase"
            >
              view previous
            </button>
          </div>
        </div>
      )}
      {filteredContests.length > 0 && (
        <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full auto-rows-fr">
          {filteredContests.map((contest) => {
            const { contestState, stateRemainingTime } = calculateContestStatus(
              contest.deadlines,
              contest.metadata.type,
              contest.tweetId
            );
            return (
              <ContestCard
                key={contest.id}
                spaceName={spaceName}
                contestId={contest.id}
                contestTitle={contest.promptData.title}
                category={contest.metadata.category}
                contestState={contestState}
                remainingTime={stateRemainingTime}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListContests;
