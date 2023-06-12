"use client";
import { useEffect, useState } from "react";
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
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
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
  const { userVotingState } = useVoteProposalContext();
  const {
    currentVotes,
    proposedUserVotes,
    totalVotingPower,
    votesSpent,
    votesRemaining,
  } = userVotingState;
  const {liveSubmissions} = useTrackSubmissions(contestId)


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

              {currentVotes.map((sub: any, idx: number) => {
                if (editMode) {
                  console.log('edit mode m8')
                  return <SubmissionCardVote key={idx} sub={liveSubmissions.find(
                    el => el.id === sub.submissionId
                  ).data} />;
                } else {
                  return <LockedCardVote key={idx} sub={liveSubmissions.find(
                    el => el.id === sub.submissionId
                  ).data}/>;
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
            <p>{totalVotingPower}</p>
            <p className={votesSpentColor}>{votesSpent}</p>
            <p className={votesRemainingColor}>{votesRemaining}</p>
          </div>
        </motion.div>

        {proposedUserVotes.length > 0 && (
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
              <div className="p-2 " />
              {(userVotingState.proposedUserVotes.length > 0 || editMode) && (
                <VoteButton />
              )}
            </>
          )}
          {activeTab === "details" && <DetailTab />}
        </div>
      </div>
    </div>
  );
}

export function VoteButton() {
  const { userVotingState, submitVotes } = useVoteProposalContext();
  const handleSubmit = () => {
    submitVotes();
  };
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
      <button className="btn btn-secondary flex flex-1" onClick={handleSubmit}>
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
