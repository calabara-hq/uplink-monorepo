"use client";
import { useState } from "react";

const ListContests = ({
  allContestsChild,
  activeContestsChild,
  isActiveContests,
  isContests,
  newContestChild,
}) => {
  const [isAllContests, setIsAllContests] = useState(false);

  return (
    <div className="flex flex-col w-full lg:w-3/4 m-auto items-center gap-4 border border-border  rounded-xl shadow-box min-h-[500px] animate-fadeIn">
      <div className="flex flex-col md:flex-row w-full md:justify-between items-center bg-base-100 bg-opacity-50 border-b-border border-b-2 rounded-t-xl p-4">
        <h1 className="text-2xl text-t1 font-semibold">Contests</h1>
        <div
          tabIndex={0}
          className="tabs tabs-boxed content-center p-1 bg-transparent text-white font-bold"
        >
          <button
            onClick={() => setIsAllContests(false)}
            className={`tab ${!isAllContests && "tab-active"}`}
          >
            Active
          </button>
          <button
            onClick={() => setIsAllContests(true)}
            className={`tab ${isAllContests && "tab-active"}`}
          >
            All Contests
          </button>
          {newContestChild}
        </div>
      </div>

      {isAllContests &&
        (!isContests ? (
          <div className="flex flex-col gap-2 items-center justify-center m-auto font-bold text-t1 text-lg">
            <p className="text-t1">
              This space has not yet hosted any contests.
            </p>
            <p className="text-t2">Check back later!</p>
          </div>
        ) : (
          allContestsChild
        ))}

      {!isAllContests &&
        (!isActiveContests ? (
          <div className="flex flex-col gap-2 items-center justify-center m-auto font-bold text-t1 text-xl">
            <p>No active contests</p>
            <button
              onClick={() => setIsAllContests(true)}
              className="btn btn-sm btn-ghost normal-case text-t2"
            >
              view previous
            </button>
          </div>
        ) : (
          activeContestsChild
        ))}
    </div>
  );
};

export default ListContests;
