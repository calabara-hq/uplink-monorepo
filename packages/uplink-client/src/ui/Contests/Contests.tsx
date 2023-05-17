"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import contestImage from "../../public/tns-sketch-contest.jpeg";
import SubmissionCard from "../SubmissionCard/SubmissionCard";
import { SubmissionCard2 } from "../SubmissionCard/SubmissionCard";
import { SubmissionCardVote, SubmissionCardBoxSelect } from "../SubmissionCard/SubmissionCard";

export const getPromptData = async (contest: any) => {
  const promptData = await fetch(contest.promptUrl).then((res) => res.json());
  return promptData;
};

export function CalculateStatus(contest: any) {
  const now = new Date();
  const startTime = new Date(contest.deadlines.startTime);
  const voteTime = new Date(contest.deadlines.voteTime);
  const endTime = new Date(contest.deadlines.endTime);

  if (now < startTime) {
    return "pending";
  } else if (now < voteTime) {
    return "submitting";
  } else if (now > voteTime && now < endTime) {
    return "voting";
  } else if (now > endTime) {
    return "closed";
  } else {
    return "closed";
  }
}

export default function Contests({
  contest,
  space,
  selectedSubs,
}: {
  contest: any;
  space: any;
  selectedSubs: any;
}) {
  //const promptData = getPromptData(contest);
  const status = CalculateStatus(contest);

  return (
    <div className="flex justify-center m-auto w-[90vw] p-6">
      <div className="flex flex-col w-full gap-4">
        <Prompt
          promptData={contest.prompt}
          metadata={contest.metadata}
          status={status}
          space={space}
          coverUrl={contest.prompt.coverUrl}
        />
        <div className="flex flex-row justify-center w-full">
          <SubmissionDisplay />
          <SideBar
            coverUrl={contest.prompt.coverUrl}
            status={status}
            submitterRewards={contest.submitterRewards}
            selectedSubs={selectedSubs}
          />
        </div>
      </div>
    </div>
  );
}

export function Prompt({
  promptData,
  metadata,
  status,
  space,
  coverUrl,
}: {
  promptData: any;
  metadata: any;
  status: string;
  space: any;
  coverUrl: any;
}) {
  console.log("promptData", promptData);
  return (
    <div className="card lg:card-side bg-transparent gap-4">
      <div className="card-body w-full lg:w-3/4 border-2 border-border shadow-box rounded-lg p-4 lg:p-8">
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-center">
          <div className="avatar">
            <div className=" w-20 lg:w-24 rounded-full bg-transparent">
              <Image
                src={
                  "https://calabara.mypinata.cloud/ipfs/QmUtZj7ksJumBa3amYnQb2tsCE7pdQcLLeD1SNWP1Jir9S"
                }
                alt={"org avatar"}
                height={300}
                width={300}
              />
            </div>
          </div>
          <h2 className="card-title text-xl lg:text-3xl">
            {space.displayName}
          </h2>
          <div className="flex flex-row items-center gap-2 lg:ml-auto">
            <p className="badge lg:badge-lg">{metadata.category}</p>
            <DynamicLabel status={status} />
          </div>
        </div>

        <div className="flex flex-col p-1 lg:p-4 gap-4">
          <h3 className="text-lg lg:text-2xl">{promptData.title}</h3>
          <p className="text-sm lg:text-xl">
            {promptData.body.length > 500
              ? promptData.body.substring(0, 500) + "..."
              : promptData.body}
          </p>
        </div>
      </div>
      {coverUrl && (
        <div className="w-full lg:w-1/3 lg:rounded-xl">
          <figure className="relative h-56 lg:h-80">
            <Image
              src={coverUrl}
              alt="contest image"
              fill
              className="object-fill rounded-xl"
            />
          </figure>
        </div>
      )}
    </div>
  );
}

export function DynamicLabel({ status }: { status: string }) {
  if (status === "pending") {
    return <p className="badge lg:badge-lg">pending</p>;
  } else if (status === "submitting") {
    return <p className="badge badge-primary lg:badge-lg">submitting</p>;
  } else if (status === "voting") {
    return <p className="badge badge-secondary lg:badge-lg">voting</p>;
  } else if (status === "closed") {
    return <p className="badge badge-ghost lg:badge-lg">closed</p>;
  } else {
    return null;
  }
}

export function SideBar({
  coverUrl,
  status,
  submitterRewards,
  selectedSubs,
}: {
  coverUrl: any;
  status: string;
  submitterRewards: any;
  selectedSubs: any;
}) {
  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 flex items-end w-full h-48 p-8 bg-gradient-to-t from-black to-transparent">
        <SubmitButton />
      </div>
      <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
        <div className="sticky top-5 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
          <DynamicSidebar
            status={status}
            submitterRewards={submitterRewards}
            selectedSubs={selectedSubs}
          />
        </div>
      </div>
    </>
  );
}

export function DynamicSidebar({
  status,
  submitterRewards,
  selectedSubs,
}: {
  status: string;
  submitterRewards: any;
  selectedSubs: any;
}) {
  if (status === "pending") {
    return <Pending />;
  } else if (status === "submitting") {
    return (
      <>
        <DynamicSubRewards submitterRewards={submitterRewards} />

        <SubmitButton />
      </>
    );
  } else if (status === "voting") {
    return <VoterCart selectedSubs={selectedSubs} />;
  } else if (status === "closed") {
    return <Closed />;
  } else {
    return null;
  }
}

export function SubmissionDisplay() {
  return (
    <div className="flex flex-col w-full lg:w-3/4 gap-4">
      <div className="flex w-3/4 justify-between items-center m-auto">
      <h1 className="text-xl lg:text-3xl text-center font-bold">Submissions</h1>
      <button className="btn btn-sm btn-ghost">Contest Details</button>

      </div>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-4 w-full">
        <SubmissionCardBoxSelect />
        <SubmissionCard />
        <SubmissionCard2 />
        <SubmissionCard />
        <SubmissionCard2 />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
        <SubmissionCard />
      </div>
    </div>
  );
}

export function Pending() {
  return (
    <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
      <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Pending
      </div>
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <p className="font-bold">
          This contest hasn't started yet. Check back soon!
        </p>
      </div>
    </div>
  );
}

export function DynamicSubRewards({
  submitterRewards,
  tab,
}: {
  submitterRewards: any;
  tab: string;
}) {
  console.log(submitterRewards);
  const [activeTab, setActiveTab] = useState("rewards");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  if (!submitterRewards || submitterRewards.length === 0) {
    return null;
  } else if (submitterRewards.length === 1) {
    return (
      <div className="flex flex-col w-full">
        <div className="tabs w-full">
          <a
            className={`tab tab-lg font-bold ${
              activeTab === "rewards" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("rewards")}
          >
            Submitter Rewards
          </a>
          <a
            className={`tab tab-lg font-bold ${
              activeTab === "details" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("details")}
          >
            Details
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 h-fit border-2 border-border rounded-lg p-4">
          {activeTab === "rewards" && (
              <div className="flex flex-row items-center justify-center gap-2">
                <p className="font-bold text-2xl">1 ETH</p>
              </div>
          )}
          {activeTab === "details" && (
            <div className="grid grid-cols-2">
              <p>Rank: </p>
              <p>{submitterRewards.rank} </p>
            </div>
          )}
        </div>
      </div>
    );
  } else if (submitterRewards.length === 2) {
    return (
      <div className="flex flex-col items-center gap-2 h-fit bg-base-100 rounded-lg w-full">
        <div className="bg-primary text-lg text-primary-content px-1 py-0.5 rounded-br-md rounded-tl-md w-fit mr-auto">
          Submitter Rewards
        </div>
        <div className="flex flex-row justify-evenly m-2 p-2 gap-2 w-full ">
          <p className="font-bold">1 ETH</p>
          <p className="font-bold">20K SHARK</p>
        </div>
      </div>
    );
  } else if (submitterRewards.length === 3) {
    return (
      <div className="flex flex-col items-center gap-2 h-fit bg-base-100 rounded-lg w-full">
        <div className="bg-primary text-lg text-primary-content px-1 py-0.5 rounded-br-md rounded-tl-md w-fit mr-auto">
          Submitter Rewards
        </div>
        <div className="flex flex-row justify-evenly m-2 p-2 gap-2 w-full ">
          <p className="font-bold">1 ETH</p>
          <div className="dropdown dropdown-hover dropdown-right dropdown-end">
            <label
              tabIndex={0}
              className="font-bold cursor-pointer hover:bg-base-200 p-2 rounded-lg mr-1"
            >
              2 More
            </label>
            <div
              tabIndex={0}
              className=" card compact dropdown-content bg-base-200 rounded-box w-24"
            >
              <div className="card-body">
                <p>1 NOUN</p>
                <p>1 TNS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else return null;
}

export function VoterRewards() {
  return (
    <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
      <div className="bg-secondary text-secondary-content text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Voter Rewards
      </div>
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <p className="font-bold">
          Voters who select the #1 submission will split <br /> 0.05 ETH
        </p>
      </div>
    </div>
  );
}

export function VoterCart({ selectedSubs }: { selectedSubs: any }) {
  const [activeTab, setActiveTab] = useState("rewards");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex flex-col w-full">
      <div className="tabs w-full">
        <a
          className={`tab tab-lg font-bold ${
            activeTab === "rewards" ? "tab-active" : ""
          }`}
          onClick={() => handleTabClick("rewards")}
        >
          Voting Cart
        </a>
        <a
          className={`tab tab-lg font-bold ${
            activeTab === "details" ? "tab-active" : ""
          }`}
          onClick={() => handleTabClick("details")}
        >
          Details
        </a>
      </div>

      <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full">
        {activeTab === "rewards" ? (
          <>
            {selectedSubs && selectedSubs.length > 0 ? (
              <>
                <div className="flex flex-row w-full justify-between items-center p-2">
                  <p className="">Submissions Selected:</p>
                  <p className="font-bold ">{selectedSubs.length} </p>

                  <button className="btn btn-sm btn-ghost">clear</button>
                </div>
                <div className="flex flex-col gap-4 p-2 max-h-[500px] overflow-y-auto">
                  {selectedSubs.map((sub: any) => (
                    <SubmissionCardVote />
                  ))}
                </div>
                <div className="flex flex-col gap-2 p-2">
                  <div className="grid grid-cols-3 justify-items-center justify-evenly gap-2 w-full font-bold text-center">
                    <p>Voting Power</p>
                    <p>Votes Spent</p>
                    <p>Remaining</p>
                    <p>13</p>
                    <p>3</p>
                    <p>10</p>
                  </div>
                  <VoteButton />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
                <p className="text-lg font-bold">No Submissions Selected!</p>
                <p className="">
                  Voters who select the #1 submission will split:{" "}
                  <p className="text-lg font-bold text-center">0.05 ETH</p>
                </p>
              </div>
            )}
          </>
        ) : (
          activeTab === "details" && (
            <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
              <p className="text-lg font-bold"></p>
              <p className="text-lg font-bold text-center">Arcade style</p>
            </div>
          )
        )}
      </div>
      <div className="p-2 " />
    </div>
  );
}

export function SubmitButton() {
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
      <button className="btn btn-primary flex flex-1">Submit</button>
      <p className="mx-2 p-2 text-center">4 days</p>
    </div>
  );
}

export function VoteButton() {
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
      <button className="btn btn-secondary flex flex-1">Vote</button>
      <p className="mx-2 p-2 text-center">1 days</p>
    </div>
  );
}

export function Closed() {
  return (
    <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
      <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
        Contest Closed
      </div>
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <button className="btn btn-outline">Download Winners</button>
      </div>
    </div>
  );
}
