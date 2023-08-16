"use client";
import { useCallback, useEffect, useState } from "react";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { SubmissionCardVote, LockedCardVote } from "../VoteCard/VoteCard";
import { Decimal } from "decimal.js";
import { mutate } from "swr";
import {
  HiLockClosed,
  HiLockOpen,
  HiXCircle,
  HiPhoto,
  HiPlus,
  HiSparkles,
  HiQuestionMarkCircle,
} from "react-icons/hi2";
import useVotingParams from "@/hooks/useVotingParams";
import useSubmitParams from "@/hooks/useSubmitParams";
import { useVoteProposalContext } from "@/providers/VoteProposalProvider";
import useTrackSubmissions from "@/hooks/useTrackSubmissions";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/ConnectButton";
import Modal from "../Modal/Modal";
import { BiInfoCircle } from "react-icons/bi";
import { sub } from "date-fns";
import useTweetQueueStatus from "@/hooks/useTweetQueueStatus";
import CreateThread from "@/ui/CreateThread/CreateThread";
import { ThreadItem } from "@/hooks/useThreadCreator";
import { nanoid } from "nanoid";
import CreateContestTweet from "../ContestForm/CreateContestTweet";
import { OutputData } from "@editorjs/editorjs";
/**
 *
 * the standard sidebar for the main contest view
 *
 */

const TweetQueuedDialog = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Tweet Queued
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
          <p className="font-bold">{`The announcement tweet is queued. It will be tweeted within 5 minutes of the contest start time.`}</p>
        </div>
      </div>
    </div>
  );
};

const TweetNotQueuedDialog = ({
  startTime,
  prompt,
  contestId,
  spaceName,
  spaceId,
}: {
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  contestId: string;
  spaceName: string;
  spaceId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSuccess = () => {
    mutate(`/api/tweetQueueStatus/${contestId}`);
  };

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Tweet Not Queued
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
          <p className="font-bold">{`This contest requires an announcement tweet before it can begin.`}</p>
          <button
            className="btn lowercase"
            onClick={() => setIsModalOpen(true)}
          >
            add a tweet
          </button>
        </div>
      </div>
      <CreateContestTweet
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        startTime={startTime}
        prompt={prompt}
        contestId={contestId}
        spaceName={spaceName}
        spaceId={spaceId}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

const AdminsRequired = ({
  contestId,
  startTime,
  prompt,
  spaceName,
  spaceId,
}: {
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  contestId: string;
  spaceName: string;
  spaceId: string;
}) => {
  const { data: session, status } = useSession();
  const { contestAdmins } = useContestState();
  const { isTweetQueued, isLoading: isQueueStatusLoading } =
    useTweetQueueStatus(contestId);
  const isAdmin = contestAdmins.includes(session?.user?.address ?? "");

  console.log(isTweetQueued);

  if (status === "loading") return <SidebarSkeleton />;
  else if (isAdmin) {
    if (isQueueStatusLoading) return <SidebarSkeleton />;
    else if (isTweetQueued) return <TweetQueuedDialog />;
    else
      return (
        <TweetNotQueuedDialog
          {...{ contestId, startTime, prompt, spaceName, spaceId }}
        />
      );
  } else
    return (
      <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
        <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
          <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
            Admins required
          </div>
          <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
            <p className="font-bold">{`Hang tight! A space admin is needed to launch the contest.`}</p>
            {!session?.user?.address && (
              <div className="flex flex-row items-center justify-start gap-2 w-full">
                <p>Are you an admin?</p>
                <WalletConnectButton style="btn-sm btn-ghost ml-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

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

const Closed = ({
  submitterRewards,
  voterRewards,
  openRewardsModal,
}: {
  submitterRewards: any;
  voterRewards: any;
  openRewardsModal: () => void;
}) => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <ContestRewards
        submitterRewards={submitterRewards}
        voterRewards={voterRewards}
        openRewardsModal={openRewardsModal}
      />
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
  submitterRewards,
  openRewardsModal,
}: {
  spaceName: string;
  contestId: string;
  submitterRewards: any;
  openRewardsModal: () => void;
}) => {
  const { stateRemainingTime } = useContestState();

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
        <ContestRewards
          submitterRewards={submitterRewards}
          openRewardsModal={openRewardsModal}
        />
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
  handleTabClick,
  isVotingCartVisible,
  setIsVotingCartVisible,
  proposedSelection,
}: {
  handleTabClick: (tab: string) => void;
  isVotingCartVisible: boolean;
  setIsVotingCartVisible: (visible: boolean) => void;
  proposedSelection: any[];
}) => {
  return (
    <div className="tabs w-full">
      <a
        className={`tab tab-md font-bold indicator indicator-secondary ${
          isVotingCartVisible ? "tab-active" : ""
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

const VoteTab = ({
  contestId,
  editMode,
  proposedSelection,
  renderEditButton,
  openVotingPolicyModal,
}: {
  contestId: string;
  editMode: boolean;
  proposedSelection: any[];
  renderEditButton: () => React.ReactNode;
  openVotingPolicyModal: () => void;
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
              <HiSparkles className="absolute top-0 right-28 w-6 h-6 text-accent" />
              <HiSparkles className="absolute top-32 left-28 w-6 h-6 text-accent" />
              <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-base-100 rounded-xl">
                <HiPhoto className="w-24 h-24" />
                <div className="space-y-2 w-full">
                  <div className="h-3 w-1/3 rounded-lg bg-gray-500 shimmer ml-2" />
                  <div className="h-2 w-1/2 rounded-lg bg-gray-500 shimmer ml-2" />
                </div>
                <HiPlus className="absolute bottom-0 right-0 w-6 h-6 ml-auto m-2 text-accent" />
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
              <p className="text-sm text-gray-500">Spent</p>
              <p className={votesSpentColor}>{votesSpent}</p>
            </div>
            <div className="flex flex-col items-center p-2 bg-base-100 w-full rounded">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className={votesRemainingColor}>{votesRemaining}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center bg-base-100 p-2 rounded text-gray-500">
            <a
              className="underline cursor-pointer hover:text-gray-400"
              onClick={openVotingPolicyModal}
            >
              How is voting power calculated?
            </a>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export function VoterCart({
  contestId,
  voterRewards,
  votingPolicy,
  openRewardsModal,
  openVotingPolicyModal,
}: {
  contestId: string;
  voterRewards: any;
  votingPolicy: any;
  openRewardsModal: () => void;
  openVotingPolicyModal: () => void;
}) {
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
          <HiLockOpen className="w-4 h-4" />
        </button>
      );
    } else {
      return (
        <button className="btn btn-sm btn-ghost" onClick={handleEditClick}>
          <HiLockClosed className="w-4 h-4 mr-2" />
          Edit
        </button>
      );
    }
  };

  if (userVotingState.isLoading) return <p>Loading ...</p>;

  return (
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
          proposedSelection={proposedSelection}
        />
        <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
          {isVotingCartVisible && (
            <>
              <VoteTab
                contestId={contestId}
                editMode={editMode}
                proposedSelection={proposedSelection}
                renderEditButton={renderEditButton}
                openVotingPolicyModal={openVotingPolicyModal}
              />
              <VoteButton />
            </>
          )}
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

// Helper function to process rewards
interface TokenReward {
  amount: string;
  token: {
    symbol?: string;
    type: string;
  };
}

interface Reward {
  rank: number;
  tokenReward: TokenReward;
}

// Helper function to process rewards
function processRewards(rewards: Reward[]): Record<string, Decimal> {
  const rewardSummary: Record<string, Decimal> = {};
  console.log(rewards);
  rewards.forEach((reward) => {
    const tokenType =
      reward.tokenReward.token.symbol || reward.tokenReward.token.type;
    if (rewardSummary[tokenType]) {
      rewardSummary[tokenType] = rewardSummary[tokenType].plus(
        new Decimal(reward.tokenReward.amount)
      );
    } else {
      rewardSummary[tokenType] = new Decimal(reward.tokenReward.amount);
    }
  });

  return rewardSummary;
}

const ContestRewards = ({
  submitterRewards,
  voterRewards,
  openRewardsModal,
}: {
  submitterRewards?: Reward[];
  voterRewards?: Reward[];
  openRewardsModal?: () => void;
}) => {
  const processedSubmitterRewards = processRewards(submitterRewards ?? []);
  const processedVoterRewards = processRewards(voterRewards ?? []);
  const componentVisible =
    submitterRewards?.length > 0 || voterRewards?.length > 0;

  if (componentVisible) {
    return (
      <div className="rounded-lg flex flex-col gap-2 w-full bg-base-100">
        <div className="flex items-center">
          <div className="bg-neutral text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
            <p>Rewards</p>
          </div>
          <BiInfoCircle
            className="w-6 h-6 ml-auto mr-2 cursor-pointer"
            onClick={openRewardsModal}
          />
        </div>
        <div className="flex flex-col p-4">
          {submitterRewards?.length > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">Submitter Rewards</span>
              {Object.entries(processedSubmitterRewards).map(
                ([token, amount]) => (
                  <span key={token}>
                    {amount.toString()} {token}
                  </span>
                )
              )}
            </div>
          )}

          {voterRewards?.length > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">Voter Rewards</span>
              {Object.entries(processedVoterRewards).map(([token, amount]) => (
                <span key={token}>
                  {amount.toString()} {token}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else return null;
};
const SidebarSkeleton = () => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
        <div className="space-y-2 p-4">
          <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
          <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
          <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
        </div>
      </div>
    </div>
  );
};

const ExpandedSubmitterRewards = (rewards: Reward[]) => {
  interface RewardElement {
    ETH?: {
      symbol: string;
      amount: string;
    };
    ERC20?: {
      symbol: string;
      amount: string;
    };
    ERC721?: {
      symbol: string;
      amount: string;
    };
    ERC1155?: {
      symbol: string;
      amount: string;
    };
  }
  const rewardSummary: Record<number, RewardElement> = {};

  rewards.forEach((reward) => {
    const tokenType = reward.tokenReward.token.type;
    if (rewardSummary[reward.rank]) {
      rewardSummary[reward.rank][tokenType] = {
        symbol: reward.tokenReward.token.symbol,
        amount: reward.tokenReward.amount,
      };
    } else {
      rewardSummary[reward.rank] = {
        [tokenType]: {
          symbol: reward.tokenReward.token.symbol,
          amount: reward.tokenReward.amount,
        },
      };
    }
  });

  return rewardSummary;
};

const RewardsModalContent = ({
  submitterRewards,
  voterRewards,
}: {
  submitterRewards: Reward[];
  voterRewards: Reward[];
}) => {
  const [tab, setTab] = useState(0); // 0 = submitting, 1 = voting
  const subRewards = ExpandedSubmitterRewards(submitterRewards);

  console.log(subRewards);

  return (
    <div className="tabs tabs-boxed gap-2 bg-base">
      <a
        className={`tab ${tab === 0 ? "tab-active" : ""} `}
        onClick={() => setTab(0)}
      >
        Submitter Rewards
      </a>
      <a
        className={`tab ${tab === 1 ? "tab-active" : ""}`}
        onClick={() => setTab(1)}
      >
        Voter Rewards
      </a>
      {tab === 0 && (
        <div className="overflow-x-auto w-full flex flex-col gap-4">
          <div className="flex items-center gap-4 p-2 rounded-xl border border-border">
            <HiSparkles className="w-6 h-6 text-primary" />
            <p className="">
              Submitter rewards are allocated to submissions that finish in the
              following ranks.
            </p>
          </div>
          {submitterRewards.length === 0 && (
            <p>There are no submitter rewards for this contest</p>
          )}
          {submitterRewards.length > 0 && (
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th className="bg-base-100 text-center">rank</th>
                  <th className="bg-gray-600 text-center">ETH</th>
                  <th className="bg-gray-700 text-center">ERC20</th>
                  <th className="bg-gray-800 text-center">ERC721</th>
                  <th className="bg-gray-900 text-center">ERC1155</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(subRewards).map(([rank, reward]) => (
                  <tr key={rank}>
                    <td className="bg-base-100 text-center">{rank}</td>
                    <td className="bg-gray-600 text-center">
                      {reward.ETH?.amount ?? ""}
                    </td>

                    <td className="bg-gray-700 text-center">
                      {reward.ERC20?.amount ?? ""} {reward.ERC20?.symbol ?? ""}
                    </td>

                    <td className="bg-gray-800 text-center">
                      {" "}
                      {reward.ERC721?.amount ?? ""}{" "}
                      {reward.ERC721?.symbol ?? ""}
                    </td>

                    <td className="bg-gray-900 text-center">
                      {" "}
                      {reward.ERC1155?.amount ?? ""}{" "}
                      {reward.ERC1155?.symbol ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 1 && (
        <div className="overflow-x-auto w-full flex flex-col gap-4">
          <div className="flex items-center gap-4 p-2 rounded-xl border border-border">
            <HiSparkles className="w-6 h-6 text-primary" />
            <p className="">
              Voter rewards are split amongst voters that allocate votes to
              submissions that finish in the following ranks.
            </p>
          </div>
          {voterRewards.length === 0 && (
            <p>There are no voter rewards for this contest</p>
          )}
          {voterRewards.length > 0 && (
            <table className="table w-full">
              <tbody>
                {voterRewards.map((reward, idx) => (
                  <tr key={reward.rank} className="w-full">
                    <td className="w-full">
                      voters that accurately choose rank {reward.rank} will
                      split {reward.tokenReward.amount}{" "}
                      {reward.tokenReward.token.symbol}.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
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

const ContestSidebar = ({
  spaceName,
  contestId,
  spaceId,
  startTime,
  prompt,
  submitterRewards,
  voterRewards,
  votingPolicy,
}: {
  spaceName: string;
  contestId: string;
  spaceId: string;
  startTime: string;
  prompt: {
    title: string;
    body: OutputData | null;
    coverUrl?: string;
  };
  submitterRewards: any;
  voterRewards: any;
  votingPolicy: any;
}) => {
  const { contestState, stateRemainingTime, type, tweetId } = useContestState();
  const { userVotingState } = useVoteProposalContext();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isVotingPolicyModalOpen, setIsVotingPolicyModalOpen] = useState(false);
  const openRewardsModal = () => {
    setIsRewardModalOpen(true);
  };

  const openVotingPolicyModal = () => {
    setIsVotingPolicyModalOpen(true);
  };
  console.log(contestState, type, tweetId);
  return (
    <>
      {!contestState && <SidebarSkeleton />}
      {contestState === "pending" &&
        (!tweetId ? (
          type === "twitter" ? (
            <AdminsRequired
              {...{ contestId, spaceId, spaceName, startTime, prompt }}
            />
          ) : (
            <Pending />
          )
        ) : (
          <Pending />
        ))}
      {contestState === "submitting" && (
        <Submitting
          spaceName={spaceName}
          contestId={contestId}
          submitterRewards={submitterRewards}
          openRewardsModal={openRewardsModal}
        />
      )}
      {contestState === "voting" && !userVotingState.isLoading && (
        <VoterCart
          contestId={contestId}
          voterRewards={voterRewards}
          votingPolicy={votingPolicy}
          openRewardsModal={openRewardsModal}
          openVotingPolicyModal={openVotingPolicyModal}
        />
      )}
      {contestState === "closed" && (
        <Closed
          submitterRewards={submitterRewards}
          voterRewards={voterRewards}
          openRewardsModal={openRewardsModal}
        />
      )}
      <Modal
        isModalOpen={isRewardModalOpen}
        onClose={() => {
          setIsRewardModalOpen(false);
        }}
      >
        <RewardsModalContent
          submitterRewards={submitterRewards}
          voterRewards={voterRewards}
        />
      </Modal>
      <Modal
        isModalOpen={isVotingPolicyModalOpen}
        onClose={() => {
          setIsVotingPolicyModalOpen(false);
        }}
      >
        <VotingPolicyModalContent votingPolicy={votingPolicy} />
      </Modal>
    </>
  );
  /*
  if (contestState === "pending") return <Pending />;
  else if (contestState === "submitting")
    return (
      <Submitting
        spaceName={spaceName}
        contestId={contestId}
      />
    );
  else if (contestState === "voting" && !userVotingState.isLoading)
    return <VoterCart contestId={contestId} />;
  else if (contestState === "closed") return <Closed />;
  else return <SidebarSkeleton />;
  */
};

export default ContestSidebar;
