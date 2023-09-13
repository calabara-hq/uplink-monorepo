"use client";
import { useState } from "react";
import { useContestState } from "@/providers/ContestStateProvider";
import Link from "next/link";
import { Decimal } from "decimal.js";
import { mutate } from "swr";
import {
  HiXCircle,
  HiSparkles,
  HiPlusCircle,
  HiInformationCircle,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { useSession } from "@/providers/SessionProvider";
import WalletConnectButton from "../ConnectButton/ConnectButton";
import Modal from "../Modal/Modal";
import { BiInfoCircle, BiTime } from "react-icons/bi";
import useTweetQueueStatus from "@/hooks/useTweetQueueStatus";
import CreateContestTweet from "../ContestForm/CreateContestTweet";
import { OutputData } from "@editorjs/editorjs";
import { useContestInteractionState } from "@/providers/ContestInteractionProvider";
import SidebarVote from "./Vote";
import { toast } from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";
import formatOrdinals from "@/lib/formatOrdinals";
import { FaRegCircleQuestion } from "react-icons/fa6";
// sidebar for the main contest view

const InfoWrapper = ({
  bannerText,
  icon,
  children,
}: {
  bannerText: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="flex gap-2 items-center bg-base text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          {icon}
          <p>{bannerText}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

const TweetQueuedDialog = () => {
  return (
    <InfoWrapper
      bannerText="Tweet Queued"
      icon={<HiInformationCircle className="w-6 h-6 text-primary" />}
    >
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <p className="font-[500] text-t2">{`The announcement tweet is queued. It will be tweeted within 5 minutes of the contest start time.`}</p>
      </div>
    </InfoWrapper>
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
    toast.success("Successfully scheduled your tweet");
    mutate(`/api/tweetQueueStatus/${contestId}`);
  };

  const customDecorators: {
    type: "text";
    data: string;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "text",
      data: `\nbegins ${new Date(startTime).toLocaleString("en-US", {
        hour12: false,
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} UTC`,
      title: "start time",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
    {
      type: "text",
      data: `\n${prompt.title}`,
      title: "prompt title",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
    {
      type: "text",
      data: `\nhttps://uplink.wtf/${spaceName}/contest/${contestId}`,
      title: "contest url",
      icon: <HiPlusCircle className="w-5 h-5 text-t2" />,
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
      <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
        <div className="bg-warning text-black text-lg px-1 py-0.5 rounded-br-md rounded-tl-md w-fit">
          Tweet Not Queued
        </div>
        <div className="flex flex-col items-center justify-evenly p-4 gap-4 w-full">
          <p>{`This contest requires an announcement tweet before it can begin.`}</p>
          <button
            className="btn btn-primary btn-outline normal-case w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Tweet
          </button>
        </div>
      </div>
      <CreateContestTweet
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        contestId={contestId}
        spaceId={spaceId}
        customDecorators={customDecorators}
        onSuccess={handleSuccess}
        onError={() => {}}
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
      <InfoWrapper
        bannerText="Admins Required"
        icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
      >
        <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full text-t2">
          <p className="">{`Hang tight! A space admin is needed to launch the contest.`}</p>
          {!session?.user?.address && (
            <div className="flex flex-row items-center justify-start gap-2 ml-auto text-t1">
              <p>Are you an admin?</p>
              <WalletConnectButton style="btn-sm btn-ghost" />
            </div>
          )}
        </div>
      </InfoWrapper>
    );
};

const Pending = () => {
  return (
    <InfoWrapper
      bannerText="Pending"
      icon={<BiTime className="w-16 h-16 text-purple-500" />}
    >
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        <p className="text-t2">
          {`This contest hasn't started yet. Check back soon!`}
        </p>
      </div>
    </InfoWrapper>
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
  const { downloadGnosisResults, downloadUtopiaResults } =
    useContestInteractionState();
  const [downloadClicked, setDownloadClicked] = useState(false);
  return (
    // <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
    //   <ContestRewards
    //     submitterRewards={submitterRewards}
    //     voterRewards={voterRewards}
    //     openRewardsModal={openRewardsModal}
    //   />

    <InfoWrapper
      bannerText="Contest Closed"
      icon={<HiOutlineLockClosed className="w-6 h-6 text-orange-500" />}
    >
      <div className="flex flex-col items-center justify-evenly p-4 gap-2 w-full">
        {!downloadClicked && (
          <button
            className="btn btn-primary normal-case"
            onClick={() => setDownloadClicked(true)}
          >
            Download Winners
          </button>
        )}
        {downloadClicked && (
          <div className="flex gap-2 items-center">
            <button
              className="btn btn-md btn-outline btn-primary normal-case"
              onClick={downloadGnosisResults}
            >
              Gnosis
            </button>
            <button
              className="btn btn-md btn-outline btn-secondary normal-case"
              onClick={downloadUtopiaResults}
            >
              Utopia
            </button>
            <button
              className="btn btn-ghost btn-sm text-t2"
              onClick={() => setDownloadClicked(false)}
            >
              <HiXCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </InfoWrapper>
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

  // render the mobile footer + fs sidebar in parallel
  return (
    <>
      <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4">
        <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
          <ContestRewards
            submitterRewards={submitterRewards}
            openRewardsModal={openRewardsModal}
          />
          <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
            <Link
              href={`${spaceName}/contest/${contestId}/studio`}
              className="btn btn-accent normal-case flex flex-1"
            >
              Submit
            </Link>
            <p className="mx-2 p-2 text-center text-t2">{stateRemainingTime}</p>
          </div>
        </div>
      </div>
    </>
  );
};

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

export const ContestRewards = ({
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

const SectionWrapper = ({
  title,
  children,
  tooltipContent,
}: {
  title: string;
  children: React.ReactNode;
  tooltipContent?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex gap-2 items-center">
        <h2 className="font-semibold text-t1">{title}</h2>
        {tooltipContent && (
          <div className="dropdown dropdown-left dropdown-hover">
            <label tabIndex={0} className="cursor-pointer">
              <FaRegCircleQuestion className="w-4 h-4 text-t2" />
            </label>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content"
            >
              <div className="card-body">{tooltipContent}</div>
            </div>
          </div>
        )}
      </div>
      {children}
      <div className="bg-base-100 h-0.5 w-full" />
    </div>
  );
};

const SubmitterRewardsSection = ({
  submitterRewards,
  setIsModalOpen,
}: {
  submitterRewards: any;
  setIsModalOpen: (val: boolean) => void;
}) => {
  return (
    <SectionWrapper
      title="Submitter Rewards"
      tooltipContent={
        <p className="font-semibold">
          At the end of the voting period, these rewards are allocated to
          submissions that finish in the pre-defined ranks.
        </p>
      }
    >
      {submitterRewards.length > 0 ? (
        <div className="flex flex-col gap-1 p-2 text-t2">
          <h2 className="text-sm font-semibold">Rank</h2>
          {submitterRewards.slice(0, 3).map((reward: any, idx: number) => {
            return (
              <div key={idx} className="grid grid-cols-5 text-sm">
                <p>{formatOrdinals(reward.rank)}</p>
                <p>{`${reward.tokenReward.amount} ${reward.tokenReward.token.symbol}`}</p>
              </div>
            );
          })}
          {submitterRewards.length > 3 && (
            <a
              className="text-t2 underline hover:text-t1 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + {submitterRewards.length - 3} more
            </a>
          )}
        </div>
      ) : (
        <p className="text-t2 text-left">None</p>
      )}
    </SectionWrapper>
  );
};

const VoterRewardsSection = ({ voterRewards }: { voterRewards: any }) => {
  if (voterRewards.length > 0)
    return (
      <SectionWrapper
        title="Voter Rewards"
        tooltipContent={
          <p className="font-semibold">
            At the end of the voting period, these rewards are split amongst
            voters that accurately choose the submissions that fall in the
            pre-defined ranks.
          </p>
        }
      >
        <div className="flex flex-col gap-1 p-2 text-t2">
          <h2 className="text-sm font-semibold">Rank</h2>
          {voterRewards.slice(0, 3).map((reward: any, idx: number) => {
            return (
              <div key={idx} className="grid grid-cols-5 text-sm">
                <p>{formatOrdinals(reward.rank)}</p>
                <p>{`${reward.tokenReward.amount} ${reward.tokenReward.token.symbol}`}</p>
              </div>
            );
          })}
          {voterRewards.length > 3 && (
            <p className="text-t2">+ {voterRewards.length - 3} more</p>
          )}
        </div>
      </SectionWrapper>
    );
  return null;
};

const SubmitterRestrictionsSection = ({
  submitterRestrictions,
  contestState,
  stateRemainingTime,
  linkTo,
}: {
  submitterRestrictions: any;
  contestState: string | null;
  stateRemainingTime: string;
  linkTo: string;
}) => {
  return (
    <SectionWrapper
      title="Entry Requirements"
      tooltipContent={
        <p className="font-semibold">
          {`Users satisfying at least one restriction (if present) are elgible to submit.`}
        </p>
      }
    >
      {submitterRestrictions.length > 0 ? (
        <div className="flex flex-col gap-1 p-2 text-t2">
          {submitterRestrictions
            .slice(0, 3)
            .map((restriction: any, idx: number) => {
              return (
                <p key={idx}>
                  {`Hold ${restriction.tokenRestriction.threshold} or more ${restriction.tokenRestriction.token.symbol} `}{" "}
                </p>
              );
            })}
          {submitterRestrictions.length > 3 && (
            <p className="text-t2">+ {submitterRestrictions.length - 3} more</p>
          )}
        </div>
      ) : (
        <p className="text-t2 text-left">Anyone can submit!</p>
      )}
      {contestState === "submitting" && (
        <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit">
          <Link
            href={linkTo}
            className="btn btn-success btn-outline normal-case flex flex-1"
          >
            Submit
          </Link>
          <p className="mx-2 p-2 text-center text-t2">{stateRemainingTime}</p>
        </div>
      )}
    </SectionWrapper>
  );
};

const VotingPolicySection = ({ votingPolicy }: { votingPolicy: any }) => {
  return (
    <SectionWrapper
      title="Voting Strategies"
      tooltipContent={
        <>
          <p className="font-semibold">
            {`Eligible voters must meet at least one requirement. Credits determine voting power.`}
          </p>

          <p className="font-extrabold">
            {`Weighted: Credits = token balance.`}
          </p>
          <p className="font-extrabold">
            {`Arcade: All users that hold <Token> get <Credits> credits.`}
          </p>

          <p className="font-semibold">
            {`If a user meets multiple requirements, the highest # of credits are used.`}
          </p>
        </>
      }
    >
      {votingPolicy.length > 0 ? (
        <div className="flex flex-col gap-1 p-2 text-t2">
          <div className="grid grid-cols-3">
            <p>Token</p>
            <p>Type</p>
            <p>Credits</p>
            {votingPolicy.slice(0, 3).map((strategy: any, idx: number) => {
              if (strategy.strategyType === "arcade") {
                return (
                  <>
                    <p>{strategy.arcadeVotingStrategy.token.symbol}</p>
                    <p>Arcade</p>
                    <p>{strategy.arcadeVotingStrategy.votingPower}</p>
                  </>
                );
              } else if (strategy.strategyType === "weighted") {
                return (
                  <>
                    <p>{strategy.weightedVotingStrategy.token.symbol}</p>
                    <p>Weighted</p>
                    <p>Weighted</p>
                  </>
                );
              }
            })}
            {votingPolicy.length > 3 && (
              <p className="text-t2">+ {votingPolicy.length - 3} more</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-t2 text-center">Anyone can submit!</p>
      )}
    </SectionWrapper>
  );
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

const SubmitterRewardsModalContent = ({
  submitterRewards,
}: {
  submitterRewards: any;
}) => {
  return (
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
            {/* {Object.entries(submitterRewards).map(([rank, reward]) => (
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
                  {reward.ERC721?.amount ?? ""} {reward.ERC721?.symbol ?? ""}
                </td>

                <td className="bg-gray-900 text-center">
                  {" "}
                  {reward.ERC1155?.amount ?? ""} {reward.ERC1155?.symbol ?? ""}
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
};

const VoterRewardsModalContent = ({ voterRewards }: { voterRewards: any }) => {
  return (
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
                  voters that accurately choose rank {reward.rank} will split{" "}
                  {reward.tokenReward.amount} {reward.tokenReward.token.symbol}.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
  submitterRestrictions,
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
  submitterRestrictions: any;
}) => {
  const { contestState, stateRemainingTime, type, tweetId } = useContestState();
  const [isSubmitterRewardsModalOpen, setIsSubmitterRewardsModalOpen] =
    useState(false);
  const [isVoterRewardsModalOpen, setIsVoterRewardsModalOpen] = useState(false);
  const [isVotingPolicyModalOpen, setIsVotingPolicyModalOpen] = useState(false);
  const [
    isSubmitterRestrictionsModalOpen,
    setIsSubmitterRestrictionsModalOpen,
  ] = useState(false);

  // show the high priority content at the top, with the rest of the sidebar below
  return (
    <div className="hidden lg:flex lg:flex-col items-center lg:w-1/3 gap-4 pt-4">
      <SubmitterRewardsSection
        submitterRewards={submitterRewards}
        setIsModalOpen={setIsSubmitterRewardsModalOpen}
      />
      <VoterRewardsSection voterRewards={voterRewards} />
      <SubmitterRestrictionsSection
        submitterRestrictions={submitterRestrictions}
        contestState={contestState}
        stateRemainingTime={stateRemainingTime}
        linkTo={`${spaceName}/contest/${contestId}/studio`}
      />
      <VotingPolicySection votingPolicy={votingPolicy} />
      <Modal
        isModalOpen={
          isSubmitterRewardsModalOpen ||
          isVoterRewardsModalOpen ||
          isSubmitterRestrictionsModalOpen ||
          isVotingPolicyModalOpen
        }
        onClose={() => {
          setIsSubmitterRewardsModalOpen(false);
          setIsVoterRewardsModalOpen(false);
          setIsSubmitterRestrictionsModalOpen(false);
          setIsVotingPolicyModalOpen(false);
        }}
      >
        {isSubmitterRewardsModalOpen && (
          <SubmitterRewardsModalContent submitterRewards={submitterRewards} />
        )}
        {isVoterRewardsModalOpen && (
          <VoterRewardsModalContent voterRewards={voterRewards} />
        )}
        {/* {isSubmitterRestrictionsModalOpen && (
          <SubmitterRestrictionsModalContent
            submitterRestrictions={submitterRestrictions}
          />
        )}
        {isVotingPolicyModalOpen && (
          <VotingPolicyModalContent votingPolicy={votingPolicy} />
        )} */}
      </Modal>
    </div>
  );
};

const ContestSidebar2 = ({
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
  const { areUserVotingParamsLoading } = useContestInteractionState();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isVotingPolicyModalOpen, setIsVotingPolicyModalOpen] = useState(false);
  const openRewardsModal = () => {
    setIsRewardModalOpen(true);
  };

  const openVotingPolicyModal = () => {
    setIsVotingPolicyModalOpen(true);
  };

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
      {contestState === "voting" &&
        (areUserVotingParamsLoading ? (
          <SidebarSkeleton />
        ) : (
          <SidebarVote
            spaceName={spaceName}
            contestId={contestId}
            voterRewards={voterRewards}
            votingPolicy={votingPolicy}
            openRewardsModal={openRewardsModal}
            openVotingPolicyModal={openVotingPolicyModal}
          />
        ))}
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
    </>
  );
};

export default ContestSidebar;
