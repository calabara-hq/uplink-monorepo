"use client";
import { useState } from "react";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";
import { motion } from "framer-motion";
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
import useVotingParams from "@/hooks/useVotingParams";
import useSubmitParams from "@/hooks/useSubmitParams";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
/**
 *
 * the standard sidebar for the main contest view
 *
 */

const Pending = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
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
    </div>
  );
};

const Closed = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Contest Closed
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
          <button className="btn btn-outline">Download Winners</button>
        </div>
      </div>
    </div>
  );
};

const Submitting = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  const { stateRemainingTime } = useContestState();
  const userSubmitParams = useSubmitParams(contestId);

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
        <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
          <Link
            href={`${spaceName}/contests/${contestId}/studio`}
            className="btn btn-accent flex flex-1"
          >
            Submit
          </Link>
          <p className="mx-2 p-2 text-center">{stateRemainingTime}</p>
        </div>
      </div>
    </div>
  );
};

const VoterTabBar = ({
  activeTab,
  handleTabClick,
  isVotingCartVisible,
  setIsVotingCartVisible,
  proposedSelection,
}: {
  activeTab: string;
  handleTabClick: (tab: string) => void;
  isVotingCartVisible: boolean;
  setIsVotingCartVisible: (visible: boolean) => void;
  proposedSelection: any[];
}) => {
  return (
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
  );
};

const VoteTab = ({
  editMode,
  proposedSelection,
  userVotingParams,
  renderEditButton,
}: {
  editMode: boolean;
  proposedSelection: any[];
  userVotingParams: any;
  renderEditButton: () => React.ReactNode;
}) => {
  const { proposedUserVotes } = useVoteProposalContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {userVotingParams.userVotes.length > 0 && (
          <motion.div
            className="flex flex-col gap-4 p-2 m-2 max-h-80 overflow-y-auto bg-neutral rounded-lg"
            variants={itemVariants}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <p className="">Your current selections</p>
              {renderEditButton()}
            </div>
            <div className="flex flex-col gap-2 transition-opacity">
              {userVotingParams.userVotes.map((sub: any, idx: number) => {
                if (editMode) {
                  return <SubmissionCardVote key={idx} sub={sub} />;
                } else {
                  return <LockedCardVote key={idx} />;
                }
              })}
            </div>
          </motion.div>
        )}

        {proposedUserVotes.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex flex-row w-full justify-start items-center p-2">
              <p className="">+ Your Proposed additions:</p>
            </div>
            <div className="flex flex-col gap-4 p-2 max-h-80 overflow-y-auto">
              {proposedUserVotes.map((sub: any, idx: number) => (
                <SubmissionCardVote key={idx} sub={sub} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="flex flex-col gap-2 p-2" variants={itemVariants}>
          <div className="grid grid-cols-3 justify-items-center justify-evenly gap-2 w-full font-bold text-center">
            <p>Voting Power</p>
            <p>Votes Spent</p>
            <p>Remaining</p>
            <p>{userVotingParams.totalVotingPower}</p>
            <p>{userVotingParams.votesSpent}</p>
            <p>{userVotingParams.votesRemaining}</p>
          </div>
        </motion.div>

        {editMode && proposedUserVotes.length > 0 && (
          <div className="flex flex-row w-full justify-end items-center p-2">
            <button className="btn btn-sm btn-ghost">remove all</button>
          </div>
        )}
      </motion.div>
    </>
  );
};

const DetailTab = ({}) => {
  return (
    <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
      <p className="text-lg font-bold"></p>
      <p className="text-lg font-bold text-center">Arcade style</p>
    </div>
  );
};

export function VoterCart({ contestId }: { contestId: number }) {
  const [activeTab, setActiveTab] = useState("votes");
  const [editMode, setEditMode] = useState(false);
  const [proposedSelection, setProposedSelection] = useState<any>([]);
  const [isVotingCartVisible, setIsVotingCartVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const userVotingParams = useVotingParams(contestId);
  const { proposedUserVotes } = useVoteProposalContext();

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

  if (!userVotingParams) return <p>Loading ...</p>;

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl mt-2">
        <VoterTabBar
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          isVotingCartVisible={isVotingCartVisible}
          setIsVotingCartVisible={setIsVotingCartVisible}
          proposedSelection={proposedSelection}
        />
        <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
          {activeTab === "votes" && isVotingCartVisible && (
            <>
              <VoteTab
                editMode={editMode}
                proposedSelection={proposedSelection}
                userVotingParams={userVotingParams}
                renderEditButton={renderEditButton}
              />
              <div className="p-2 " />
              {(proposedUserVotes.length > 0 || editMode) && <VoteButton />}
            </>
          )}
          {activeTab === "details" && <DetailTab />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl mt-2">
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
                        <p>{userVotingParams.totalVotingPower}</p>
                        <p>{userVotingParams.votesSpent}</p>
                        <p>{userVotingParams.votesRemaining}</p>
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

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

/**
 *
 *
 *
 *
 */

const SidebarSkeleton = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
        <div className="space-y-2 p-4">
          <div className={`h-6 w-1/3 mb-4 rounded-lg bg-neutral ${shimmer}`} />
          <div className={`h-4 w-1/2 rounded-lg bg-neutral ${shimmer}`} />
          <div className={`h-4 w-1/2 rounded-lg bg-neutral ${shimmer}`} />
        </div>
      </div>
    </div>
  );
};

const ContestSidebar = ({
  spaceName,
  contestId,
}: {
  spaceName: string;
  contestId: number;
}) => {
  const { contestState } = useContestState();

  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return <Submitting spaceName={spaceName} contestId={contestId} />;
  else if (contestState === "voting")
    return <VoterCart contestId={contestId} />;
  else if (contestState === "end") return <Closed />;
  else return <SidebarSkeleton />;
};

export default ContestSidebar;
