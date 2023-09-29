import "server-only";
import fetchContest from "@/lib/fetch/fetchContest";
import { FaRegCircleQuestion } from "react-icons/fa6";
import formatDecimal from "@/lib/formatDecimal";
import {
  ExpandSection,
  InteractiveAdminsRequired,
  InteractiveContestClosed,
  InteractiveCreateTweet,
  RenderRemainingTime,
  RenderStateSpecificDialog,
} from "./client_ContestDetails";
import { Fragment, Suspense } from "react";
import formatOrdinals from "@/lib/formatOrdinals";
import { IToken } from "@/types/token";
import Link from "next/link";
import { StatusLabel } from "../ContestLabels/ContestLabels";
import {
  HiInformationCircle,
  HiOutlineLockClosed,
  HiPlusCircle,
} from "react-icons/hi2";
import { BiTime } from "react-icons/bi";
import type { OutputData } from "@editorjs/editorjs";
import { IoWarningOutline } from "react-icons/io5";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
/*
 * note- if this code looks a bit strange, it's because
 * nextjs allows us to pass server components as children to the client
 * to reduce bundle size and improve performance.
 * we'll try it out here, with plans to use it elsewhere in the future
 */

const normalizeSubmitterRewards = (rewards) => {
  if (rewards.length === 0) return [];
  let rewardsObj = {};
  rewards.forEach((reward, idx) => {
    const { rank, tokenReward } = reward;
    if (rewardsObj[rank]) rewardsObj[rank].push(tokenReward);
    else rewardsObj[rank] = [tokenReward];
  });

  return rewardsObj;
};

const DetailSectionWrapper = ({
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
        <h2 className="font-semibold text-t1 text-[16px]">{title}</h2>
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

export const DialogWrapper = ({
  bannerText,
  icon,
  children,
}: {
  bannerText: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center bg-base-100 rounded-lg w-full p-4">
      <div className="flex items-center gap-2 ">
        {icon}
        <p className="text-center text-t1 text-lg font-semibold">
          {bannerText}
        </p>
      </div>
      {children}
    </div>
  );
};

const SectionSkeleton = () => {
  return (
    <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
      <div className="space-y-2 p-4">
        <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
        <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
        <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
      </div>
    </div>
  );
};

const SubmitterRestrictionsSection = ({ submitterRestrictions }) => {
  return (
    <DetailSectionWrapper
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
          {/* modal content */}
          <ExpandSection
            data={submitterRestrictions}
            label={`+ ${submitterRestrictions.length - 3} requirements`}
          >
            <div className="w-full flex flex-col gap-4 text-t1">
              <h1 className="text-lg font-bold">Entry Requirements</h1>

              <div className="flex flex-col gap-1 p-2 ">
                {submitterRestrictions.map((restriction: any, idx: number) => {
                  return (
                    <Fragment key={idx}>
                      <p>
                        {`Hold ${
                          formatDecimal(restriction.tokenRestriction.threshold)
                            .short
                        } or more ${
                          restriction.tokenRestriction.token.symbol
                        } `}{" "}
                      </p>
                      <div className="w-full h-0.5 bg-base-200" />
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </ExpandSection>
        </div>
      ) : (
        <p className="text-t2 p-2 text-sm">Anyone can submit!</p>
      )}
    </DetailSectionWrapper>
  );
};

const SubmitterRewardsSection = ({
  submitterRewards,
}: {
  submitterRewards: any;
}) => {
  const normalizedRewards: {
    [rank: number]: { token: IToken; amount: string }[];
  } = normalizeSubmitterRewards(submitterRewards);

  return (
    <DetailSectionWrapper
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
          {/* modal content */}
          <ExpandSection
            data={submitterRewards}
            label={`+ ${Object.keys(normalizedRewards).length - 3} rewards`}
          >
            <div className="w-full flex flex-col gap-4 text-t1">
              <h1 className="text-lg font-bold">Submitter Rewards</h1>
              <div className="flex flex-col gap-2">
                {Object.entries(normalizedRewards).map(
                  ([rank, rewards], idx) => {
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
                  }
                )}
              </div>
            </div>
          </ExpandSection>
        </div>
      ) : (
        <p className="text-t2 p-2 text-sm">None</p>
      )}
    </DetailSectionWrapper>
  );
};

const VoterRewardsSection = ({ voterRewards }) => {
  if (voterRewards.length > 0) {
    return (
      <DetailSectionWrapper
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
          {/* modal content */}
          <ExpandSection
            data={voterRewards}
            label={`+ ${voterRewards.length - 3} rewards`}
          >
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
          </ExpandSection>
        </div>
      </DetailSectionWrapper>
    );
  }
  return null;
};

const VotingPolicySection = ({ votingPolicy }) => {
  return (
    <DetailSectionWrapper
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
            {/* modal content */}
            <ExpandSection
              data={votingPolicy}
              label={`+ ${votingPolicy.length - 3} strategies`}
            >
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
                              <p>
                                {strategy.arcadeVotingStrategy.token.symbol}
                              </p>
                              <p>Arcade</p>
                              <p>
                                {
                                  formatDecimal(
                                    strategy.arcadeVotingStrategy.votingPower
                                  ).short
                                }
                              </p>
                            </>
                          )}
                          {strategy.strategyType === "weighted" && (
                            <>
                              <p>
                                {strategy.weightedVotingStrategy.token.symbol}
                              </p>
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
            </ExpandSection>
          </div>
        </div>
      ) : (
        <p className="text-t2 p-2 text-sm">Anyone can vote!</p>
      )}
    </DetailSectionWrapper>
  );
};

const RenderDetails = async ({ contestId }: { contestId: string }) => {
  // move the fetch down the tree so we can suspend it.
  // react will auto-dedup the fetches

  const contest = await fetchContest(contestId);
  const {
    submitterRewards,
    voterRewards,
    votingPolicy,
    submitterRestrictions,
  } = contest;

  return (
    <div className="flex flex-col gap-4">
      <SubmitterRestrictionsSection {...{ submitterRestrictions }} />
      <SubmitterRewardsSection {...{ submitterRewards }} />
      <VoterRewardsSection {...{ voterRewards }} />
      <VotingPolicySection {...{ votingPolicy }} />
    </div>
  );
};

const Pending = () => {
  return (
    <DialogWrapper
      bannerText="Pending"
      icon={<BiTime className="w-16 h-16 text-purple-500" />}
    >
      <p className="text-t2 text-center">
        {`This contest hasn't started yet. Check back soon!`}
      </p>
    </DialogWrapper>
  );
};

const Submit = ({ studioLink }: { studioLink: string }) => {
  return (
    <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl">
      <div className="flex flex-row items-center justify-between bg-base-100 rounded-lg gap-2 h-fit w-full">
        <Link
          href={studioLink}
          className="btn btn-accent normal-case flex flex-1"
          draggable={false}
        >
          Submit
        </Link>
        <p className="mx-2 p-2 text-center text-t2">
          <RenderRemainingTime />
        </p>
      </div>
    </div>
  );
};

const Vote = () => {
  return (
    <div className="flex gap-2 items-center">
      <StatusLabel status={"voting"} />
      <p className="text-t2">
        <RenderRemainingTime />
      </p>
    </div>
  );
};

const Closed = () => {
  return (
    <DialogWrapper
      bannerText="Contest Closed"
      icon={<HiOutlineLockClosed className="w-6 h-6 text-orange-500" />}
    >
      <InteractiveContestClosed />
    </DialogWrapper>
  );
};

const AdminRequiredDialog = () => {
  return (
    <DialogWrapper
      bannerText="Admins Required"
      icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
    >
      <div className="flex flex-col items-center justify-evenly gap-2 w-full text-t2">
        <p className="text-center ">{`Hang tight! A space admin is needed to launch the contest.`}</p>
        <div className="flex flex-row items-center justify-start gap-2  xl:ml-auto text-t1">
          <p className="text-t1 text-sm">Are you an admin?</p>
          <WalletConnectButton styleOverride="btn-sm btn-ghost" />
        </div>
      </div>
    </DialogWrapper>
  );
};

const TweetQueuedDialog = () => {
  return (
    <DialogWrapper
      bannerText="Tweet Queued"
      icon={<HiInformationCircle className="w-6 h-6 text-primary" />}
    >
      <div className="flex flex-col items-center justify-evenly gap-2 w-full">
        <p className="font-[500] text-t2">{`The announcement tweet is queued. It will be tweeted within 5 minutes of the contest start time.`}</p>
      </div>
    </DialogWrapper>
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
    <DialogWrapper
      bannerText="Tweet Required"
      icon={<IoWarningOutline className="w-6 h-6 text-warning" />}
    >
      <InteractiveCreateTweet
        contestId={contestId}
        spaceId={spaceId}
        customDecorators={customDecorators}
      />
    </DialogWrapper>
  );
};

const AdminsRequired = ({
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
  return (
    <InteractiveAdminsRequired
      contestId={contestId}
      adminRequiredDialog={<AdminRequiredDialog />}
      tweetQueuedDialog={<TweetQueuedDialog />}
      skeletonChild={<SectionSkeleton />}
      tweetNotQueuedDialog={
        <TweetNotQueuedDialog
          {...{
            startTime,
            prompt,
            contestId,
            spaceName,
            spaceId,
          }}
        />
      }
    ></InteractiveAdminsRequired>
  );
};

const ContestDetails = async ({ contestId }: { contestId: string }) => {
  const contest = await fetchContest(contestId);
  const {
    deadlines,
    space,
    submitterRewards,
    voterRewards,
    votingPolicy,
    submitterRestrictions,
    promptUrl,
  } = contest;

  const promptData = await fetch(promptUrl).then((res) => res.json());

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <Suspense
        fallback={new Array(3).fill(null).map((_, idx) => (
          <SectionSkeleton key={idx} />
        ))}
      >
        {/*@ts-expect-error*/}
        <RenderDetails
          {...{
            contestId,
          }}
        />
      </Suspense>
      <RenderStateSpecificDialog
        adminsChild={
          <AdminsRequired
            {...{
              contestId,
              startTime: deadlines.startTime,
              prompt: promptData,
              spaceName: space.name,
              spaceId: space.id,
            }}
          />
        }
        pendingChild={<Pending />}
        submittingChild={
          <Submit studioLink={`/${space.name}/contest/${contestId}/studio`} />
        }
        votingChild={<Vote />}
        closedChild={<Closed />}
        skeletonChild={<SectionSkeleton />}
      />
    </div>
  );
};

export default ContestDetails;
