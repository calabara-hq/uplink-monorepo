"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import Image from "next/image";
import { HiTrash, HiDocumentText } from "react-icons/hi2";

const SubmissionVoteInput = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  console.log(submission);
  const { updateVoteAmount } = useVoteActionContext();

  return (
    <input
      type="number"
      placeholder="votes"
      className="input  text-center w-full py-1 text-sm rounded-none rounded-br-xl"
      value={submission.votes}
      onWheel={(e: React.WheelEvent<HTMLElement>) => {
        (e.target as HTMLElement).blur();
      }}
      onChange={(e) =>
        updateVoteAmount(submission.submissionId, e.target.value, mode)
      }
    />
  );
};

const SubmissionVoteTrash = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  const { removeSingleVote } = useVoteActionContext();

  return (
    <>
      <button
        className="btn btn-ghost w-auto h-full rounded-xl ml-auto md:hidden lg:flex"
        onClick={() => removeSingleVote(submission.submissionId, mode)}
      >
        <HiTrash className="w-5 h-5 text-t2 " />
      </button>
      <button
        className="absolute top-0 right-0 btn btn-ghost rounded-full ml-auto btn-sm lg:hidden"
        onClick={() => removeSingleVote(submission.submissionId, mode)}
      >
        <HiTrash className="w-4 h-4 text-t2" />
      </button>
    </>
  );
};

const SubmissionCardVote = ({
  submission,
  mode,
}: {
  submission: any;
  mode: "current" | "proposed";
}) => {
  return (
    <div className="grid grid-cols-3 w-full h-24 max-h-24">
      <div className="flex flex-col items-center justify-center rounded-l-xl bg-base-100 h-full w-full p-1">
        {submission.data.type === "text" && (
          <CartTextSubmission submission={submission} />
        )}
        {submission.data.type !== "text" && (
          <CartMediaSubmission submission={submission} />
        )}
      </div>
      <div className="flex flex-col items-start justify-center bg-base-100 h-full w-full p-1 break-all">
        <p className="text-base line-clamp-3 text-t1">
          {submission.data.title}
        </p>
      </div>
      <div className="grid grid-cols-[1px_auto] rounded-r-xl bg-base h-full w-full border border-gray-500 border-l-0">
        <div className="bg-gray-500" />
        <div className="grid grid-rows-2 ">
          <div className=" rounded-tr-xl">
            <button className="btn btn-ghost normal-case w-full rounded-none rounded-tr-xl text-error">
              <p className="text-error font-[500]">remove</p>
            </button>
          </div>
          <div className="rounded-br-xl">
            <SubmissionVoteInput submission={submission} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-row w-full h-24 max-h-24 gap-1">
      <div
        className="flex flex-row w-full bg-base-100 rounded-xl
                    cursor-pointer"
      >
        {submission.data.type === "text" && (
          <CartTextSubmission submission={submission} />
        )}
        {submission.data.type !== "text" && (
          <CartMediaSubmission submission={submission} />
        )}
        <div className="flex flex-col justify-between items-start gap-4 h-full p-2 w-full">
          <h2 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap w-3/4 text-left">
            {submission.data.title}
          </h2>
          <SubmissionVoteInput submission={submission} mode={mode} />
        </div>
      </div>
      <SubmissionVoteTrash submission={submission} mode={mode} />
    </div>
  );
};

const CartMediaSubmission = ({ submission }: { submission: any }) => {
  return (
    <figure className="relative w-full h-full rounded-xl">
      <Image
        src={submission.data.previewAsset}
        alt="submission image"
        fill
        className="object-contain rounded-xl"
      />
    </figure>
  );
};

const CartTextSubmission = ({ submission }: { submission: any }) => {
  return (
    <HiDocumentText className="h-full w-full max-w-[80%] text-t2 object-contain text-center " />
  );
  return null; //<HiDocumentText className="w-full h-full text-t2 object-contain text-center p-4" />;
};

const LockedCardVote = ({ submission }: { submission: any }) => {
  const displayableVotes = formatDecimal(submission.votes);
  return (
    <div
      className="flex flex-row w-full h-16 min-h-16 bg-base-100 rounded-xl
                    cursor-pointer-none"
    >
      {submission.data.type === "text" && (
        <CartTextSubmission submission={submission} />
      )}
      {submission.data.type !== "text" && (
        <CartMediaSubmission submission={submission} />
      )}
      <div className="flex flex-row justify-center items-center gap-4 p-2 w-full">
        <h2 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap text-center w-3/4">
          {submission.data.title}
        </h2>
        {/*<SubmissionVoteInput submission={submission} mode={mode} />*/}
        <div className="flex flex-col items-center justify-center ml-auto gap-1 px-2">
          <p>{displayableVotes.short}</p>
        </div>
      </div>
    </div>
  );
};

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
          <span className="indicator-item badge badge-warning rounded-full">
            <p>{proposedVotes.length}</p>
          </span>
        )}
      </a>

      {isVotingCartVisible && (
        <a
          className="tab tab-md font-bold ml-auto"
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
          <button
            className="btn btn-sm btn-ghost normal-case"
            onClick={removeAllVotes}
          >
            Remove All
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
          {currentVotes.length > 0 && (
            <div className="flex flex-row w-full justify-start items-center p-2 text-t2">
              <p className="">+ Your proposed additions</p>
            </div>
          )}
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
        <div className="grid grid-cols-3 justify-items-center justify-evenly gap-2 font-bold text-center">
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableTotalVotingPower.long}
          >
            <p className="text-sm">Voting Power</p>
            <p>{displayableTotalVotingPower.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableVotesSpent.long}
          >
            <p className="text-sm text-gray-500">Spent</p>
            <p className="mt-auto">{displayableVotesSpent.short}</p>
          </div>
          <div
            className="tooltip tooltip-bottom flex flex-col items-center p-2 bg-base-100 w-full rounded text-t2"
            data-tip={displayableVotesRemaining.long}
          >
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="mt-auto">{displayableVotesRemaining.short}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center justify-center bg-base-100 p-2 rounded text-t2">
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

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-5/12 xl:w-1/3 items-center gap-4">
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
  );
};

export default SidebarVote;
