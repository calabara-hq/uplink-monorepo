"use client";

import React, { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import contestImage from "../../public/tns-sketch-contest.jpeg";
import SubmissionCard, {
  SubmissionCardText,
} from "../SubmissionCard/SubmissionCard";
import { SubmissionCard2 } from "../SubmissionCard/SubmissionCard";
import {
  SubmissionCardVote,
  SubmissionCardBoxSelect,
  LockedCardVote,
} from "../SubmissionCard/SubmissionCard";
import {
  BuildingStorefrontIcon,
  LockClosedIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { is } from "date-fns/locale";
import { set } from "date-fns";
import { motion } from "framer-motion";
import SubmissionViewer from "../SubmissionViewer/SubmissionViewer";
import graphqlClient from "@/lib/graphql/initUrql";
import { TestEndpointDocument } from "@/lib/graphql/votes.gql";
import Link from "next/link";

export const getPromptData = async (contest: any) => {
  const promptData = await fetch(contest.promptUrl).then((res) => res.json());
  return promptData;
};

const testEndpoint = async (id: string) => {
  const results = await graphqlClient
    .query(TestEndpointDocument, { id })
    .toPromise();
  if (results.error) {
    throw new Error(results.error.message);
  }
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

  return <SubmissionDisplay selectedSubs={selectedSubs} />;

  {
    /*
    <div className="flex justify-center gap-4 m-auto w-[80vw] lg:py-6">
      <div className="flex flex-col w-full lg:w-3/4 gap-4">
        <Prompt
          promptData={contest.prompt}
          metadata={contest.metadata}
          status={status}
          space={space}
          coverUrl={contest.prompt.coverUrl}
        />
        <SubmissionDisplay selectedSubs={selectedSubs} />
      </div>
      <SideBar
        coverUrl={contest.prompt.coverUrl}
        status={status}
        submitterRewards={contest.submitterRewards}
        selectedSubs={selectedSubs}
      />
    </div>
  );
  */
  }
}

export function Prompt2({
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
  coverUrl?: any;
}) {
  console.log("promptData", promptData);
  return (
    <div className="card lg:card-side bg-transparent gap-4 h-min">
      <div className="card-body w-full lg:w-full border-2 border-border shadow-box rounded-lg p-4 lg:p-4">
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
        <div className="flex flex-col lg:flex-row justify-between items-start  gap-2 w-full">
          <div className="flex flex-col p-1 lg:p-4 gap-4 w-3/4">
            <h3 className="text-lg lg:text-2xl">{promptData.title}</h3>
            <p className="text-sm lg:text-xl">
              {promptData.body.length > 500
                ? promptData.body.substring(0, 500) + "..."
                : promptData.body}
            </p>
          </div>
          {coverUrl && (
            <div className="w-fit lg:rounded-xl">
              <figure className="relative w-56 h-56 ">
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
      </div>
    </div>
  );
}

export const Prompt = ({ contestId }: { contestId: string }) => {
  //TODO:
  // fetch the prompt data
  // render a loading state
  // render the prompt

  const space = {
    displayName: "Shark DAO",
  };

  const contest = {
    id: "1",
    metadata: {
      type: "standard",
      category: "art",
    },
    prompt: {
      title: "📺 Nouns AI Youtube Banner 📺",
      body: "Draw a DAO",
      coverUrl:
        "https://calabara.mypinata.cloud/ipfs/QmdwVF6xpqxgBqdhoswoY1piVHvGZTTeNam1s9opAS1YtB",
    },
  };

  const status = "submitting";

  return (
    <div className="card lg:card-side bg-transparent gap-4 h-min">
      <div className="card-body w-full lg:w-full border-2 border-border shadow-box rounded-lg p-4 lg:p-4">
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
            <p className="badge lg:badge-lg">{contest.metadata.category}</p>
            <DynamicLabel status={status} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start  gap-2 w-full">
          <div className="flex flex-col p-1 lg:p-4 gap-4 w-3/4">
            <h3 className="text-lg lg:text-2xl">{contest.prompt.title}</h3>
            <p className="text-sm lg:text-xl">
              {contest.prompt.body.length > 500
                ? contest.prompt.body.substring(0, 500) + "..."
                : contest.prompt.body}
            </p>
          </div>
          {contest.prompt.coverUrl && (
            <div className="w-fit lg:rounded-xl">
              <figure className="relative w-56 h-56 ">
                <Image
                  src={contest.prompt.coverUrl}
                  alt="contest image"
                  fill
                  className="object-fill rounded-xl"
                />
              </figure>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

export function SideBar2({
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
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
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

export const SideBar = ({ contestId }: { contestId: string }) => {
  const submitterRewards: any[] = [];
  const selectedSubs: any[] = [];
  const status = "submitting";

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 flex items-end w-full h-48 p-8 bg-gradient-to-t from-black to-transparent">
        <SubmitButton />
      </div>
      <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
          <DynamicSidebar
            status={status}
            submitterRewards={submitterRewards}
            selectedSubs={selectedSubs}
          />
        </div>
      </div>
    </>
  );
};

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
        <Link
          className="btn btn-ghost"
          href={`${window.location.pathname}/studio`}
        >
          submit
        </Link>
      </>
    );
  } else if (status === "voting") {
    return <VoterCart userCurrentSelection={selectedSubs} />;
  } else if (status === "closed") {
    return <Closed />;
  } else {
    return null;
  }
}

export function SubmissionDisplay({ selectedSubs }: { selectedSubs: any }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-evenly items-center">
        <h1 className="text-xl lg:text-3xl text-center font-bold">
          Submissions
        </h1>
        <SubmissionViewer />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-evenly gap-4 lg:w-full w-full">
        <SubmissionCardText />
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
}: {
  submitterRewards: any;
}) {
  console.log(submitterRewards);
  const [activeTab, setActiveTab] = useState("rewards");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (!submitterRewards || submitterRewards.length === 0) {
    return null;
  }

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
          <div className="flex flex-row items-center justify-around w-full gap-2">
            <p className="font-bold text-2xl">1 ETH</p>
            {submitterRewards.length >= 2 && (
              <p className="font-bold text-2xl">20K SHARK</p>
            )}
            {submitterRewards.length >= 3 && (
              <div className="dropdown dropdown-hover dropdown-right dropdown-end">
                <label
                  tabIndex={0}
                  className="font-bold cursor-pointer hover:bg-base-200 p-2 rounded-lg mr-1"
                >
                  {submitterRewards.length - 2} More
                </label>
                <div
                  tabIndex={0}
                  className=" card compact dropdown-content bg-base-200 rounded-box w-24"
                >
                  <div className="card-body">
                    {submitterRewards.length >= 3 && (
                      <>
                        <p>1 NOUN</p>
                        <p>1 TNS</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
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

export function VoterCart({
  totalVotingPower,
  votesSpent,
  votesRemaining,
  userCurrentSelection,
}: {
  totalVotingPower: string;
  votesSpent: string;
  votesRemaining: string;
  userCurrentSelection: any;
}) {
  const [activeTab, setActiveTab] = useState("votes");
  const [editMode, setEditMode] = useState(false);
  const [proposedSelection, setProposedSelection] = useState<any>([]);
  const [isVotingCartVisible, setIsVotingCartVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "votes" && !isVotingCartVisible) {
      setIsVotingCartVisible(true);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setCollapsed(false);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const addProposed = () => {
    setProposedSelection([
      ...proposedSelection,
      {
        id: 1,
        title: "Submission #1",
        image:
          "https://calabara.mypinata.cloud/ipfs/QmUtZj7ksJumBa3amYnQb2tsCE7pdQcLLeD1SNWP1Jir9S",
        votes: 0,
      },
    ]);
  };

  const handleCollapseClick = () => {
    setCollapsed(!collapsed);
    setEditMode(false);
  };

  const renderEditButton = () => {
    if (editMode) {
      return (
        <button className="btn btn-sm btn-ghost" onClick={handleCancelClick}>
          <LockOpenIcon className="w-4 h-4" />
        </button>
      );
    } else {
      return (
        <button className="btn btn-sm btn-ghost" onClick={handleEditClick}>
          <LockClosedIcon className="w-4 h-4 mr-2" />
          Edit
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col w-full mt-2">
      <div className="tabs items-center w-full">
        <a
          className={`tab tab-lg font-bold indicator indicator-secondary ${
            activeTab === "votes" ? "tab-active" : ""
          }`}
          onClick={() => handleTabClick("votes")}
        >
          Voting Cart
          {proposedSelection.length > 0 && (
            <span className="indicator-item badge badge-secondary">
              {proposedSelection.length}
            </span>
          )}
        </a>

        {isVotingCartVisible && (
          <>
            <a
              className={`tab tab-lg font-bold ${
                activeTab === "details" ? "tab-active" : ""
              }`}
              onClick={() => handleTabClick("details")}
            >
              Details
            </a>

            <a
              className="tab tab-lg font-bold"
              onClick={() => setIsVotingCartVisible(false)}
            >
              <XCircleIcon className="w-5 h-5" />
            </a>
          </>
        )}
      </div>

      <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
        {activeTab === "votes" && isVotingCartVisible ? (
          <>
            {(userCurrentSelection && userCurrentSelection.length > 0) ||
            (proposedSelection && proposedSelection.length > 0) ? (
              <>
                <motion.div
                  className="container"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {userCurrentSelection.length > 0 && (
                    <motion.div
                      className="flex flex-col gap-4 p-2 m-2 max-h-80 overflow-y-auto bg-neutral rounded-lg"
                      variants={itemVariants}
                    >
                      <div className="flex flex-row w-full justify-between items-center">
                        <p className="">Your current selections</p>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={handleCollapseClick}
                        >
                          {collapsed ? (
                            <ChevronDownIcon className="w-4 h-4" />
                          ) : (
                            <ChevronUpIcon className="w-4 h-4" />
                          )}
                        </button>
                        {renderEditButton()}
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col gap-2 transition-opacity">
                          {userCurrentSelection.map((sub: any) => {
                            if (editMode) {
                              return <SubmissionCardVote key={sub.id} />;
                            } else {
                              return <LockedCardVote key={sub.id} />;
                            }
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {proposedSelection.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <div className="flex flex-row w-full justify-start items-center p-2">
                        <p className="">+ Your Proposed additions:</p>
                      </div>
                      <div className="flex flex-col gap-4 p-2 max-h-80 overflow-y-auto">
                        {proposedSelection.map((sub: any) => (
                          <SubmissionCardVote key={sub.id} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-col gap-2 p-2"
                    variants={itemVariants}
                  >
                    <div className="grid grid-cols-3 justify-items-center justify-evenly gap-2 w-full font-bold text-center">
                      <p>Voting Power</p>
                      <p>Votes Spent</p>
                      <p>Remaining</p>
                      <p>{totalVotingPower}</p>
                      <p>{votesSpent}</p>
                      <p>{votesRemaining}</p>
                    </div>
                  </motion.div>

                  <button
                    className="btn btn-outline btn-sm w-fit"
                    onClick={addProposed}
                  >
                    add proposed
                  </button>

                  {editMode && userCurrentSelection.length > 0 && (
                    <div className="flex flex-row w-full justify-end items-center p-2">
                      <button className="btn btn-sm btn-ghost">
                        remove all
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-evenly p-4 gap-2 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-lg font-bold">No Submissions Selected!</p>
                <p className="">
                  Voters who select the #1 submission will split:
                  <p className="text-lg font-bold text-center">0.05 ETH</p>
                </p>
                <button
                  className="btn btn-outline btn-sm w-fit"
                  onClick={addProposed}
                >
                  add proposed
                </button>
              </motion.div>
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
      {(proposedSelection.length > 0 || editMode) && <VoteButton />}
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
      <button className="btn btn-secondary flex flex-1">
        Submit Batch Vote
      </button>
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
