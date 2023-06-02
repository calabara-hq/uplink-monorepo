"use client";

import { useState, useEffect } from "react";
import TabGroup from "../TabGroup/TabGroup";
import { DynamicLabel } from "../Contests/Contests";
import Link from "next/link";

const tabSelect = ["Active", "All Contests", "Closed"];
// calculate label
// function takes start time, vote time, end time and returns either "accepting submissions", "voting", or "closed"
function calculateStatus(startTime: string, voteTime: string, endTime: string) {
  const now = new Date().toISOString();
  if (now < voteTime) {
    return {
      label: "submitting",
      timeRemaining: "6 days",
    };
  } else if (now > voteTime && now < endTime) {
    return {
      label: "voting",
      timeRemaining: "6 days",
    };
  } else if (now > endTime) {
    return { label: "closed", timeRemaining: "0 days" };
  }
}

export const ContestCard1 = ({ space, contest }: { contest: any, space: any }) => {
  const status = calculateStatus(
    contest.deadlines.startTime,
    contest.deadlines.voteTime,
    contest.deadlines.endTime
  );
  return (
    <Link href={`${space.name}/contests/${contest.id}`}>
    <div
      key={contest.id}
      className="card bg-base-100 
      transition-all duration-300 ease-linear
      cursor-pointer hover:shadow-box hover:scale-105 rounded-3xl p-4 h-fit w-full"
    >
      <div className="card-body items-center p-0">
        <h2 className="card-title mb-0 normal-case">test prompt</h2>
        <p className="badge lg:badge-lg lowercase">{contest.metadata.category}</p>
        <p className="badge lg:badge-lg lowercase">{status?.label}</p>
        <p>{status?.timeRemaining}</p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
    </Link>
  );
};

export default function ContestDisplay({ contests, space }: { contests: any[], space: any }) {
  const [activeTab, setActiveTab] = useState(0);
  const [filteredContests, setFilteredContests] = useState(contests);

  useEffect(() => {
    if (activeTab === 0) {
      // Active tab
      const filtered = contests.filter((contest) => {
        const status = calculateStatus(
          contest.startTime,
          contest.voteTime,
          contest.endTime
        );
        return (
          status && (status.label === "submitting" || status.label === "voting")
        );
      });
      setFilteredContests(filtered);
    } else if (activeTab === 1) {
      // All Contests tab
      setFilteredContests(contests);
    } else if (activeTab === 2) {
      // Closed tab
      const filtered = contests.filter((contest) => {
        const status = calculateStatus(
          contest.startTime,
          contest.voteTime,
          contest.endTime
        );
        return status && status.label === "closed";
      });
      setFilteredContests(filtered);
    }
  }, [activeTab, contests]);

  return (
    <div className="flex flex-col w-full lg:w-3/4 m-auto items-center gap-4">
      <div className="flex flex-col lg:flex-row w-full lg:justify-between items-center">
        <h1 className="text-3xl font-bold">Contests</h1>
        <div
          tabIndex={0}
          className="tabs tabs-boxed content-center p-2 bg-transparent text-white font-bold"
        >
          {tabSelect.map((tab, index) => {
            if (index === activeTab)
              return (
                <a key={index} className="tab tab-active">
                  {tab}
                </a>
              );
            return (
              <a
                key={index}
                className="tab text-white font-bold"
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </a>
            );
          })}
        </div>
      </div>

      <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 w-full">
        {filteredContests.map((contest) => (
          <ContestCard1 key={contest.id} contest={contest} space={space} />
        ))}
      </div>
      {/*}
      <div className="grid grid-rows-1 lg:grid-cols-4 gap-4 justify-center w-full">
        {filteredContests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
        */}
    </div>
  );
}
