"use client";
import { useCallback, useEffect, useState } from "react";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SubmissionCardVote,
  LockedCardVote,
} from "../SubmissionCard/SubmissionCard";

import {
  BuildingStorefrontIcon,
  LockClosedIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XCircleIcon,
  PhotoIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import useVotingParams from "@/hooks/useVotingParams";
import useSubmitParams from "@/hooks/useSubmitParams";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/ConnectButton";
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
            {`This contest hasn't started yet. Check back soon!`}
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
        My Selections
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const VoteTab = ({
  contestId,
  editMode,
  proposedSelection,
  renderEditButton,
}: {
  contestId: number;
  editMode: boolean;
  proposedSelection: any[];
  renderEditButton: () => React.ReactNode;
}) => {
  const { userVotingState, removeAllVotes } = useVoteProposalContext();
  const {
    currentVotes,
    proposedUserVotes,
    totalVotingPower,
    votesSpent,
    votesRemaining,
  } = userVotingState;
  const { liveSubmissions } = useTrackSubmissions(contestId);

  const [votesSpentColor, setVotesSpentColor] = useState("");
  const [votesRemainingColor, setVotesRemainingColor] = useState("");

  /*

  some color fun



  const [prevVotesSpent, setPrevVotesSpent] = useState(votesSpent);
  const [prevVotesRemaining, setPrevVotesRemaining] = useState(votesRemaining);

  useEffect(() => {
    if (votesSpent > prevVotesSpent) {
      setVotesSpentColor("text-green-400"); // green for increase
    } else if (votesSpent < prevVotesSpent) {
      setVotesSpentColor("text-red-400"); // red for decrease
    }
    setPrevVotesSpent(votesSpent);

    // clear color after 1 second
    const timeoutId = setTimeout(() => setVotesSpentColor(""), 1000);
    return () => clearTimeout(timeoutId);
  }, [votesSpent]);

  useEffect(() => {
    if (votesRemaining > prevVotesRemaining) {
      setVotesRemainingColor("text-green-400"); // green for increase
    } else if (votesRemaining < prevVotesRemaining) {
      setVotesRemainingColor("text-red-400"); // red for decrease
    }
    setPrevVotesRemaining(votesRemaining);

    // clear color after 1 second
    const timeoutId = setTimeout(() => setVotesRemainingColor(""), 1000);
    return () => clearTimeout(timeoutId);
  }, [votesRemaining]);

*/

  return (
    <>
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {proposedUserVotes.length > 0 && (
          <div className="flex flex-row w-full justify-end items-center p-2">
            <button className="btn btn-sm btn-ghost" onClick={removeAllVotes}>
              remove all
            </button>
          </div>
        )}
        {currentVotes.length > 0 && (
          <motion.div
            className="flex flex-col gap-4 p-2 m-2 max-h-80 overflow-y-auto bg-neutral rounded-lg"
            variants={itemVariants}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <p className="">Your current selections</p>
              {renderEditButton()}
            </div>
            <div className="flex flex-col gap-2 transition-opacity">
              {currentVotes.map((submission: any, idx: number) => {
                if (editMode) {
                  return (
                    <SubmissionCardVote
                      key={idx}
                      mode={"current"}
                      submission={{
                        ...submission,
                        data: liveSubmissions.find(
                          (el) => el.id === submission.submissionId
                        ).data,
                      }}
                    />
                  );
                } else {
                  return (
                    <LockedCardVote
                      key={idx}
                      submission={{
                        ...submission,
                        data: liveSubmissions.find(
                          (el) => el.id === submission.submissionId
                        ).data,
                      }}
                    />
                  );
                }
              })}
            </div>
          </motion.div>
        )}

        {proposedUserVotes.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex flex-row w-full justify-start items-center p-2">
              <p className="">+ Your proposed additions</p>
            </div>
            <div className="flex flex-col gap-4 p-2 max-h-80 overflow-y-auto">
              {proposedUserVotes.map((submission: any, idx: number) => (
                <SubmissionCardVote
                  key={idx}
                  submission={submission}
                  mode={"proposed"}
                />
              ))}
            </div>
          </motion.div>
        )}

        {proposedUserVotes.length === 0 && currentVotes.length === 0 && (
          <motion.div variants={itemVariants}>
            <div className="p-10"></div>
            <div className="relative flex flex-col items-center justify-center w-full">
              <SparklesIcon className="absolute top-0 right-28 w-6 h-6 text-accent" />
              <SparklesIcon className="absolute top-32 left-28 w-6 h-6 text-accent" />
              <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-base-100 rounded-xl">
                <PhotoIcon className="w-24 h-24" />
                <div className="space-y-2 w-full">
                  <div className="h-3 w-1/3 rounded-lg bg-gray-500 shimmer ml-2" />
                  <div className="h-2 w-1/2 rounded-lg bg-gray-500 shimmer ml-2" />
                </div>
                <PlusIcon className="absolute bottom-0 right-0 w-6 h-6 ml-auto m-2 text-accent" />
              </div>
              <div className="p-4"></div>
              <h1>No entries selected</h1>
              <p className="text-center">
                Select entries by clicking the plus sign in the bottom right
                corner.
              </p>
            </div>
            <div className="p-10"></div>
          </motion.div>
        )}

        <motion.div className="flex flex-col gap-2 p-2" variants={itemVariants}>
          <div className="grid grid-cols-3 justify-items-center justify-evenly gap-4 font-bold text-center">
            {/*
            <p>Voting Power</p>
            <p>Votes Spent</p>
            <p>Votes Remaining</p>
            <p>{totalVotingPower}</p>
            <p className={votesSpentColor}>{votesSpent}</p>
            <p className={votesRemainingColor}>{votesRemaining}</p>
        */}

            <div className="flex flex-col items-center p-2 bg-base-100 w-full rounded">
              <p className="text-sm text-gray-500">Voting Power</p>
              <p>{totalVotingPower}</p>
            </div>
            <div className="flex flex-col items-center p-2 bg-base-100 w-full rounded">
              <p className="text-sm text-gray-500">Votes Spent</p>
              <p className={votesSpentColor}>{votesSpent}</p>
            </div>
            <div className="flex flex-col items-center p-2 bg-base-100 w-full rounded">
              <p className="text-sm text-gray-500">Votes Remaining</p>
              <p className={votesRemainingColor}>{votesRemaining}</p>
            </div>
          </div>
        </motion.div>
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

  const { userVotingState } = useVoteProposalContext();

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

  if (userVotingState.isLoading) return <p>Loading ...</p>;

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
                contestId={contestId}
                editMode={editMode}
                proposedSelection={proposedSelection}
                renderEditButton={renderEditButton}
              />
              <VoteButton />
            </>
          )}
          {activeTab === "details" && <DetailTab />}
        </div>
      </div>
    </div>
  );
}

export function VoteButton() {
  const { userVotingState, submitVotes, areCurrentVotesDirty } =
    useVoteProposalContext();

  const { status } = useSession();

  const isVoteButtonEnabled =
    areCurrentVotesDirty || userVotingState.proposedUserVotes.length > 0;

  const handleSubmit = () => {
    submitVotes();
  };

  if (status !== "authenticated") {
    return <WalletConnectButton />;
  }
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-9/10 m-2">
      <button
        className="btn btn-secondary flex flex-1"
        onClick={handleSubmit}
        disabled={!isVoteButtonEnabled}
      >
        Cast Votes
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
  const { userVotingState } = useVoteProposalContext();
  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return <Submitting spaceName={spaceName} contestId={contestId} />;
  else if (contestState === "voting" && !userVotingState.isLoading)
    return <VoterCart contestId={contestId} />;
  else if (contestState === "end") return <Closed />;
  else return <SidebarSkeleton />;
};

export default ContestSidebar;
