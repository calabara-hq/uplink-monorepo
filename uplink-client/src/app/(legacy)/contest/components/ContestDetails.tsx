import { FaRegCircleQuestion } from "react-icons/fa6";
import formatDecimal from "@/lib/formatDecimal";
import { ExpandSection } from "../[id]/client";
import { Fragment } from "react";
import formatOrdinals from "@/lib/formatOrdinals";
import { ChainLabel } from "../../../../ui/ChainLabel/ChainLabel";
import {
    FungibleReward,
    LegacyContest,
    NonFungibleReward,
    SubmitterTokenRewardOption,
    isArcadeVotingStrategy,
    isFungibleReward,
    isSubmitterTokenReward,
    isVoterTokenReward,
    isWeightedVotingStrategy,
} from "@/types/contest";
import { getChainName } from "@/lib/chains/supportedChains";
import fetchLegacyContest from "@/lib/fetch/fetchLegacyContest";
import { TooltipContent, Tooltip, TooltipProvider, TooltipTrigger } from "../../../../ui/DesignKit/Tooltip";

import { Info } from "../../../../ui/DesignKit/Info";

const normalizeSubmitterRewards = (
    subRewards: LegacyContest["submitterRewards"]
) => {
    if (subRewards.length === 0) return [];
    let rewardsObj: {
        [rank: number]: SubmitterTokenRewardOption[];
    } = {};

    const pushOrAssign = (
        rank: number,
        reward: FungibleReward | NonFungibleReward
    ) => {
        if (rewardsObj[rank]) rewardsObj[rank].push(reward);
        else rewardsObj[rank] = [reward];
    };

    subRewards.forEach((el, idx: number) => {
        const { rank, reward } = el;
        if (isSubmitterTokenReward(reward)) {
            if (rewardsObj[rank]) rewardsObj[rank].push(reward.tokenReward);
            else rewardsObj[rank] = [reward.tokenReward];
        }
    });

    return rewardsObj;
};


export const DetailsSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
        </div>
    );
};

export const SectionSkeleton = () => {
    return (
        <div className="flex flex-col justify-between bg-base-100 rounded-lg w-full">
            <div className="space-y-2 p-4">
                <div className={"h-6 w-1/3 mb-4 rounded-lg bg-base-200 shimmer"} />
                <div className={"h-4 w-1/2 rounded-lg bg-base-200 shimmer"} />
                <div className={"h-4 w-1/2 rounded-lg bg-base-200 shimmer"} />
            </div>
        </div>
    );
};

export const DetailSectionWrapper = ({
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
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger>
                                <FaRegCircleQuestion className="w-4 h-4 text-t2" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[250px]">
                                <Info className="bg-base-200 border border-border text-t2 text-sm font-normal">{tooltipContent}</Info>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className="flex flex-col gap-1 w-full text-t2 text-sm">
                {children}
            </div>
            <div className="bg-base-200 h-0.5 w-full" />
        </div>
    );
};

const SubmitterRestrictionsSection = ({ submitterRestrictions }: { submitterRestrictions: LegacyContest['submitterRestrictions'] }) => {
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
                                    {`Hold ${formatDecimal(restriction.tokenRestriction.threshold).short
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
                                                {`Hold ${formatDecimal(restriction.tokenRestriction.threshold)
                                                    .short
                                                    } or more ${restriction.tokenRestriction.token.symbol
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
    submitterRewards: LegacyContest["submitterRewards"];
}) => {
    const normalizedRewards: {
        [rank: number]: SubmitterTokenRewardOption[];
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
                                                    {isFungibleReward(reward)
                                                        ? formatDecimal(reward.amount).short
                                                        : "0"}
                                                    {" "}
                                                    {reward.token.symbol}
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
                        data={Object.keys(normalizedRewards)}
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
                                                                    {isFungibleReward(reward)
                                                                        ? formatDecimal(reward.amount).short
                                                                        : 1}{" "}
                                                                    {/* just show token count (1) for NF reward for now */}
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

const VoterRewardsSection = ({
    voterRewards,
}: {
    voterRewards: LegacyContest["voterRewards"];
}) => {
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
                    {voterRewards.slice(0, 3).map((el, idx: number) => {
                        const { rank, reward } = el;
                        if (!isVoterTokenReward(reward)) return null;
                        return (
                            <div key={idx} className="grid grid-cols-5 text-sm">
                                <p>{formatOrdinals(rank)}:</p>
                                <p>{`${formatDecimal(reward.tokenReward.amount).short} ${reward.tokenReward.token.symbol
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
                                {voterRewards.map((el, idx: number) => {
                                    const { rank, reward } = el;
                                    if (!isVoterTokenReward(reward)) return null;
                                    return (
                                        <Fragment key={idx}>
                                            <div className="flex flex-row items-center gap-2">
                                                <p>{formatOrdinals(rank)} place:</p>
                                                <p className="ml-4">{`${formatDecimal(reward.tokenReward.amount).short
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

const VotingPolicySection = ({
    votingPolicy,
}: {
    votingPolicy: LegacyContest["votingPolicy"];
    chainId: LegacyContest["chainId"];
}) => {
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
                        {votingPolicy.slice(0, 3).map((strategy, idx: number) => {
                            if (isArcadeVotingStrategy(strategy)) {
                                return (
                                    <p key={idx}>
                                        {`Arcade ${strategy.arcadeVotingStrategy.token.symbol} (${formatDecimal(strategy.arcadeVotingStrategy.votingPower)
                                            .short
                                            } credits) `}
                                    </p>
                                );
                            } else if (isWeightedVotingStrategy(strategy)) {
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



const ContestDetails = async ({
    contestId,
}: {
    contestId: string;
}) => {
    const contestData = await fetchLegacyContest(contestId).then(async (res) => {
        const promptData = await fetch(res.promptUrl).then((res) => res.json());
        return { ...res, promptData };
    });
    const {
        chainId,
        deadlines,
        space,
        submitterRewards,
        voterRewards,
        votingPolicy,
        submitterRestrictions,
        promptData,
    } = contestData;

    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4">
                {chainId !== 1 && (
                    <DetailSectionWrapper title={"Network"}>
                        <div className="flex gap-2 items-center pl-2">
                            <p>{getChainName(chainId)}</p>
                            <ChainLabel chainId={chainId} px={16} />
                        </div>
                    </DetailSectionWrapper>
                )}
                <SubmitterRestrictionsSection submitterRestrictions={submitterRestrictions} />
                <SubmitterRewardsSection submitterRewards={submitterRewards} />
                <VoterRewardsSection voterRewards={voterRewards} />
                <VotingPolicySection votingPolicy={votingPolicy} chainId={chainId} />
            </div>
        </div>
    );
};


export default ContestDetails;