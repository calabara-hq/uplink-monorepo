"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SubmissionCardVote, LockedCardVote } from "../VoteCard/VoteCard";
import {
  HiLockClosed,
  HiLockOpen,
  HiXCircle,
  HiPhoto,
  HiPlus,
  HiSparkles,
} from "react-icons/hi2";
import { useVoteActionContext } from "@/providers/VoteActionProvider";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/ConnectButton";
import Modal from "../Modal/Modal";

import formatDecimal from "@/lib/formatDecimal";
import { useRouter } from "next/navigation";
import { ContestRewards } from "./ContestSidebar";
import { useContestState } from "@/providers/ContestStateProvider";

const VotingPolicyModalContent = ({ votingPolicy }: { votingPolicy: any }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 italic text-md border border-gray-600 p-2 rounded">
        <p>strategy types:</p>

        <p>arcade = uniform voting power for all token holders</p>
        <p>weighted = voting power corresponds to user token balance</p>
      </div>
      <div className="grid grid-cols-2">
        {votingPolicy.map((el, index) => {
          const strategyType = el.strategyType;
          const objectReference =
            strategyType === "arcade"
              ? el.arcadeVotingPolicy
              : el.weightedVotingPolicy;
          return (
            <div
              key={index}
              className="flex flex-col gap-1 bg-base-100 p-2 rounded"
            >
              <div className="badge badge-secondary">{index + 1}</div>
              <p>
                <a className="font-bold">strategy type: </a> {strategyType}
              </p>
              <p>
                <a className="font-bold">symbol: </a>
                <a
                  className={
                    objectReference.token.symbol === "ETH"
                      ? ""
                      : "underline cursor-pointer hover:text-gray-300"
                  }
                  onClick={
                    objectReference.token.symbol === "ETH"
                      ? () => {}
                      : () => {
                          window.open(
                            `https://etherscan.io/token/${objectReference.token.address}`,
                            "_blank"
                          );
                        }
                  }
                >
                  {" "}
                  {objectReference.token.symbol}
                </a>
                {strategyType === "arcade" && (
                  <p>
                    <a className="font-bold">Voting Power: </a>
                    {objectReference.votingPower.toString()}
                  </p>
                )}
              </p>
              <p></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const VoteButton = ({
  setIsEditMode,
}: {
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  const { submitVotes, areCurrentVotesDirty, proposedVotes } =
    useVoteActionContext();
  const { stateRemainingTime } = useContestState();

  const { status } = useSession();

  const isVoteButtonEnabled = areCurrentVotesDirty || proposedVotes.length > 0;

  const handleSubmit = () => {
    submitVotes();
    setIsEditMode(false);
  };

  if (status !== "authenticated") {
    return <WalletConnectButton style="w-full" />;
  }
  return (
    <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-9/10 m-2">
      <button
        className="btn btn-primary flex flex-1 normal-case"
        onClick={handleSubmit}
        disabled={!isVoteButtonEnabled}
      >
        Cast Votes
      </button>
      <p className="mx-2 p-2 text-center text-t2">{stateRemainingTime}</p>
    </div>
  );
};

const EditButton = ({
  isEditMode,
  setIsEditMode,
}: {
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  if (isEditMode) {
    return (
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => setIsEditMode(false)}
      >
        <HiLockOpen className="w-4 h-4" />
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => setIsEditMode(true)}
      >
        <HiLockClosed className="w-4 h-4 mr-2" />
        Edit
      </button>
    );
  }
};

const VoterTabBar = ({
  handleTabClick,
  isVotingCartVisible,
  setIsVotingCartVisible,
}: {
  handleTabClick: (tab: string) => void;
  isVotingCartVisible: boolean;
  setIsVotingCartVisible: (visible: boolean) => void;
}) => {
  const { proposedVotes } = useVoteActionContext();
  return (
    <div className="tabs w-full">
      <a
        className={`tab tab-md font-bold indicator indicator-secondary ${
          isVotingCartVisible ? "tab-active" : ""
        }`}
        onClick={() => handleTabClick("votes")}
      >
        My Selections
        {proposedVotes.length > 0 && (
          <span className="indicator-item badge badge-secondary">
            {proposedVotes.length}
          </span>
        )}
      </a>

      {isVotingCartVisible && (
        <a
          className="tab tab-md font-bold"
          onClick={() => setIsVotingCartVisible(false)}
        >
          <HiXCircle className="w-5 h-5" />
        </a>
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

export const VoteTab = ({
  contestId,
  votingPolicy,
}: {
  contestId: string;
  votingPolicy: any;
}) => {
  const {
    removeAllVotes,
    proposedVotes,
    currentVotes,
    totalVotingPower,
    votesSpent,
    votesRemaining,
  } = useVoteActionContext();

  const { liveSubmissions } = useTrackSubmissions(contestId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVotingPolicyModalOpen, setIsVotingPolicyModalOpen] = useState(false);
  const displayableVotesSpent = formatDecimal(votesSpent);
  const displayableVotesRemaining = formatDecimal(votesRemaining);
  const displayableTotalVotingPower = formatDecimal(totalVotingPower);

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[...proposedVotes, ...currentVotes].length > 0 && (
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
            <EditButton isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
          </div>
          <div className="flex flex-col gap-2 transition-opacity">
            {currentVotes.map((submission: any, idx: number) => {
              if (isEditMode) {
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

      {proposedVotes.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex flex-row w-full justify-start items-center p-2">
            <p className="">+ Your proposed additions</p>
          </div>
          <div className="flex flex-col gap-4 p-2 max-h-80 overflow-y-auto">
            {proposedVotes.map((submission: any, idx: number) => (
              <SubmissionCardVote
                key={idx}
                submission={submission}
                mode={"proposed"}
              />
            ))}
          </div>
        </motion.div>
      )}

      {proposedVotes.length === 0 && currentVotes.length === 0 && (
        <motion.div variants={itemVariants}>
          <div className="p-10"></div>
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="w-1/4 ml-auto">
              <HiSparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-base-100 rounded-xl">
              <HiPhoto className="w-24 h-24" />
              <div className="space-y-2 w-full">
                <div className="h-3 w-1/3 rounded-lg bg-gray-500 shimmer ml-2" />
                <div className="h-2 w-1/2 rounded-lg bg-gray-500 shimmer ml-2" />
              </div>
              <HiPlus className="absolute bottom-0 right-0 w-6 h-6 ml-auto m-2 text-accent" />
            </div>
            <div className="w-1/4 mr-auto flex justify-end">
              <HiSparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="p-4"></div>
            <h1 className="text-center text-t2">No entries selected.</h1>
            <p className="text-center text-t2">
              Select entries by clicking the plus sign in the bottom right
              corner.
            </p>
          </div>
          <div className="p-10"></div>
        </motion.div>
      )}

      <motion.div className="flex flex-col gap-2 p-2" variants={itemVariants}>
        <div className="grid grid-cols-3 justify-items-center justify-evenly gap-4 font-bold text-center">
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded"
            data-tip={displayableTotalVotingPower.long}
          >
            <p className="text-sm text-gray-500">Voting Power</p>
            <p>{displayableTotalVotingPower.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded"
            data-tip={displayableVotesSpent.long}
          >
            <p className="text-sm text-gray-500">Spent</p>
            <p className="mt-auto">{displayableVotesSpent.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded"
            data-tip={displayableVotesRemaining.long}
          >
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="mt-auto">{displayableVotesRemaining.short}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-center bg-base-100 p-2 rounded text-gray-500">
          <a
            className="underline cursor-pointer hover:text-gray-400"
            onClick={() => setIsVotingPolicyModalOpen(true)}
          >
            How is voting power calculated?
          </a>
        </div>
      </motion.div>
      <VoteButton setIsEditMode={setIsEditMode} />
      <Modal
        isModalOpen={isVotingPolicyModalOpen}
        onClose={() => {
          setIsVotingPolicyModalOpen(false);
        }}
      >
        <VotingPolicyModalContent votingPolicy={votingPolicy} />
      </Modal>
    </motion.div>
  );
};

const SidebarVote = ({
  spaceName,
  contestId,
  voterRewards,
  votingPolicy,
  openRewardsModal,
  openVotingPolicyModal,
}: {
  spaceName: string;
  contestId: string;
  voterRewards: any;
  votingPolicy: any;
  openRewardsModal: () => void;
  openVotingPolicyModal: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("votes");
  const [isVotingCartVisible, setIsVotingCartVisible] = useState(true);
  const { proposedVotes } = useVoteActionContext();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "votes" && !isVotingCartVisible) {
      setIsVotingCartVisible(true);
    }
  };

  // render the sidebar / footerbar in parallel
  return (
    <>
      {proposedVotes.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute flex items-center justify-center bottom-12 h-20 lg:hidden bg-base w-8/12 p-2"
        >
          <Link
            className="btn btn-primary indicator w-full rounded-xl p-2 normal-case"
            href={`${spaceName}/contests/${contestId}/vote`}
          >
            Vote
            {proposedVotes.length > 0 && (
              <span className="indicator-item badge badge-secondary">
                {proposedVotes.length}
              </span>
            )}
          </Link>
        </motion.div>
      )}

      <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
        <ContestRewards
          voterRewards={voterRewards}
          openRewardsModal={openRewardsModal}
        />
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl mt-2">
          <VoterTabBar
            handleTabClick={handleTabClick}
            isVotingCartVisible={isVotingCartVisible}
            setIsVotingCartVisible={setIsVotingCartVisible}
          />
          <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
            {isVotingCartVisible && (
              <VoteTab contestId={contestId} votingPolicy={votingPolicy} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarVote;
