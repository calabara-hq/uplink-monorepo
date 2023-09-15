"use client";
import formatOrdinals from "@/lib/formatOrdinals";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Fragment, useState } from "react";
import { IToken } from "@/types/token";
import Modal from "../Modal/Modal";
import Link from "next/link";
import formatDecimal from "@/lib/formatDecimal";

// display info about the contest in the sidebar

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
          <div className="dropdown dropdown-right dropdown-hover">
            <label tabIndex={0} className="cursor-pointer">
              <FaRegCircleQuestion className="w-4 h-4 text-t2" />
            </label>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] card card-compact w-64 p-2 bg-primary text-primary-content shadow-black shadow-lg"
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

// rank-normalize submitter rewards

const normalizeSubmitterRewards = (rewards) => {
  if (rewards.length === 0) return [];
  let lastSeenRank = rewards[0].rank;
  let rewardsObj = {};
  rewards.forEach((reward, idx) => {
    const { rank, tokenReward } = reward;
    if (rewardsObj[rank]) rewardsObj[rank].push(tokenReward);
    else rewardsObj[rank] = [tokenReward];
  });

  return rewardsObj;
};

const SubmitterRewardsModalContent = ({
  submitterRewards,
}: {
  submitterRewards: {
    [rank: number]: { token: IToken; amount: string }[];
  };
}) => {
  return (
    <div className="w-full flex flex-col gap-4 text-t1">
      <h1 className="text-lg font-bold">Submitter Rewards</h1>
      <div className="flex flex-col gap-2">
        {Object.entries(submitterRewards).map(([rank, rewards], idx) => {
          return (
            <>
              <div
                key={idx}
                className="flex flex-row gap-2 items-center justify-start"
              >
                <p>{formatOrdinals(parseInt(rank))} place:</p>
                <div className="flex flex-row ml-4 items-center gap-2">
                  {rewards.map((reward, idx) => {
                    return (
                      <p key={idx}>
                        {formatDecimal(reward.amount).short}{" "}
                        {reward.token.symbol}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-0.5 bg-base-200" />
            </>
          );
        })}
      </div>
    </div>
  );
};

export const SubmitterRewardsSection = ({
  submitterRewards,
}: {
  submitterRewards: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedRewards: {
    [rank: number]: { token: IToken; amount: string }[];
  } = normalizeSubmitterRewards(submitterRewards);

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
      {Object.keys(normalizedRewards).length > 0 ? (
        <div className="flex flex-col gap-1 p-2 text-t2">
          <h2 className="text-sm font-semibold">Rank</h2>
          {Object.entries(normalizedRewards)
            .slice(0, 3)
            .map(([rank, rewards], idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-row gap-2 items-center justify-start text-sm"
                >
                  <p>{formatOrdinals(parseInt(rank))}:</p>
                  <div className="flex flex-row ml-4 items-center gap-2">
                    {rewards.map((reward, idx) => {
                      return (
                        <p key={idx}>
                          {formatDecimal(reward.amount).short}{" "}
                          {reward.token.symbol}{" "}
                          {idx !== rewards.length - 1 && ","}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          {Object.keys(normalizedRewards).length > 3 && (
            <a
              className="hover:underline text-blue-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + {Object.keys(normalizedRewards).length - 3} rewards
            </a>
          )}
        </div>
      ) : (
        <p className="text-t2 p-2">None</p>
      )}
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SubmitterRewardsModalContent submitterRewards={normalizedRewards} />
      </Modal>
    </SectionWrapper>
  );
};

const VoterRewardsModalContent = ({ voterRewards }: { voterRewards: any }) => {
  return (
    <div className="w-full flex flex-col gap-4 text-t1">
      <h1 className="text-lg font-bold">Voter Rewards</h1>

      <div className="flex flex-col gap-1 p-2 ">
        {voterRewards.map((reward: any, idx: number) => {
          return (
            <Fragment key={idx}>
              <div className="flex flex-row items-center gap-2">
                <p>{formatOrdinals(reward.rank)} place:</p>
                <p className="ml-4">{`${
                  formatDecimal(reward.tokenReward.amount).short
                } ${reward.tokenReward.token.symbol}`}</p>
              </div>
              <div className="w-full h-0.5 bg-base-200" />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const VoterRewardsSection = ({
  voterRewards,
}: {
  voterRewards: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                <p>{formatOrdinals(reward.rank)}:</p>
                <p>{`${formatDecimal(reward.tokenReward.amount).short} ${
                  reward.tokenReward.token.symbol
                }`}</p>
              </div>
            );
          })}
          {voterRewards.length > 3 && (
            <a
              className="hover:underline text-blue-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + {voterRewards.length - 3} rewards
            </a>
          )}
        </div>
        <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <VoterRewardsModalContent voterRewards={voterRewards} />
        </Modal>
      </SectionWrapper>
    );
  return null;
};

const SubmitterRestrictionsModalContent = ({
  submitterRestrictions,
}: {
  submitterRestrictions: any;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 text-t1">
      <h1 className="text-lg font-bold">Entry Requirements</h1>

      <div className="flex flex-col gap-1 p-2 ">
        {submitterRestrictions.map((restriction: any, idx: number) => {
          return (
            <Fragment key={idx}>
              <p>
                {`Hold ${
                  formatDecimal(restriction.tokenRestriction.threshold).short
                } or more ${restriction.tokenRestriction.token.symbol} `}{" "}
              </p>
              <div className="w-full h-0.5 bg-base-200" />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const SubmitterRestrictionsSection = ({
  submitterRestrictions,
}: {
  submitterRestrictions: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <div className="flex flex-col gap-1 p-2 text-t2 text-sm">
          {submitterRestrictions
            .slice(0, 3)
            .map((restriction: any, idx: number) => {
              return (
                <p key={idx}>
                  {`Hold ${
                    formatDecimal(restriction.tokenRestriction.threshold).short
                  } or more ${restriction.tokenRestriction.token.symbol} `}{" "}
                </p>
              );
            })}
          {submitterRestrictions.length > 3 && (
            <a
              className="hover:underline text-blue-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + {submitterRestrictions.length - 3} requirements
            </a>
          )}
        </div>
      ) : (
        <p className="text-t2 p-2">Anyone can submit!</p>
      )}

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SubmitterRestrictionsModalContent
          submitterRestrictions={submitterRestrictions}
        />
      </Modal>
    </SectionWrapper>
  );
};

const VotingPolicyModalContent = ({ votingPolicy }: { votingPolicy: any }) => {
  return (
    <div className="w-full flex flex-col gap-4 text-t1">
      <h1 className="text-lg font-bold">Voting Strategies</h1>
      <div className="flex flex-col gap-1 p-2 ">
        <div className="grid grid-cols-3">
          <p className="font-bold">Token</p>
          <p className="font-bold">Type</p>
          <p className="font-bold">Credits</p>
          {votingPolicy.map((strategy: any, idx: number) => {
            return (
              <Fragment key={idx}>
                {strategy.strategyType === "arcade" && (
                  <>
                    <p>{strategy.arcadeVotingStrategy.token.symbol}</p>
                    <p>Arcade</p>
                    <p>
                      {
                        formatDecimal(strategy.arcadeVotingStrategy.votingPower)
                          .short
                      }
                    </p>
                  </>
                )}
                {strategy.strategyType === "weighted" && (
                  <>
                    <p>{strategy.weightedVotingStrategy.token.symbol}</p>
                    <p>Weighted</p>
                    <p>Weighted</p>
                  </>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const VotingPolicySection = ({
  votingPolicy,
}: {
  votingPolicy: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            {`Arcade: All users that hold a specific token get a uniform # of credits.`}
          </p>

          <p className="font-semibold">
            {`If a user meets multiple requirements, the highest # of credits are used.`}
          </p>
        </>
      }
    >
      {votingPolicy.length > 0 ? (
        <div className="flex flex-col gap-1 p-2 text-t2 text-sm">
          <div className="flex flex-col gap-1">
            {votingPolicy.slice(0, 3).map((strategy: any, idx: number) => {
              if (strategy.strategyType === "arcade") {
                return (
                  <p key={idx}>
                    {`Arcade ${strategy.arcadeVotingStrategy.token.symbol} (${
                      formatDecimal(strategy.arcadeVotingStrategy.votingPower)
                        .short
                    } credits) `}
                  </p>
                );
              } else if (strategy.strategyType === "weighted") {
                return (
                  <p key={idx}>
                    {" "}
                    Weighted {strategy.weightedVotingStrategy.token.symbol}
                  </p>
                );
              }
            })}
            {votingPolicy.length > 3 && (
              <a
                className="hover:underline text-blue-500 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                + {votingPolicy.length - 3} strategies
              </a>
            )}
          </div>
        </div>
      ) : (
        <p className="text-t2 text-center">Anyone can submit!</p>
      )}
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <VotingPolicyModalContent votingPolicy={votingPolicy} />
      </Modal>
    </SectionWrapper>
  );
};
