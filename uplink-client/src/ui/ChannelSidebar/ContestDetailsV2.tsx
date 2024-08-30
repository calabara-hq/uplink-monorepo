"use client";

import { FaRegCircleQuestion } from "react-icons/fa6";
import { useMemo } from "react";
import formatOrdinals from "@/lib/formatOrdinals";
import Link from "next/link";
import {
    FungibleReward,
    NonFungibleReward,
    SubmitterTokenRewardOption,
    isSubmitterTokenReward,
} from "@/types/contest";
import type { FetchSingleContestResponse } from "@/lib/fetch/fetchContest";
import { ContractID, splitContractID } from "@/types/channel";
import { IFiniteTransportConfig, ILogicConfig } from "@tx-kit/sdk/subgraph";
import { useErc20TokenInfo, useTokenInfo } from "@/hooks/useTokenInfo";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { Address, decodeAbiParameters, formatUnits, Hex, parseEther, parseUnits } from "viem";
import { useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { RenderStatefulChildAndRemainingTime } from "./SidebarUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../DesignKit/Tooltip";
import { Info } from "../DesignKit/Info";
import { Button } from "../DesignKit/Button";

const normalizeSubmitterRewards = (
    subRewards: FetchSingleContestResponse["submitterRewards"]
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
        <div className="flex flex-col justify-between bg-base-100  rounded-lg w-full">
            <div className="space-y-2 p-4">
                <div className={"h-6 w-1/3 mb-4 rounded-lg bg-neutral shimmer"} />
                <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
                <div className={"h-4 w-1/2 rounded-lg bg-neutral shimmer"} />
            </div>
        </div>
    );
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


const TokenLogicRule = ({
    chainId,
    target,
    operator,
    literalOperand,
}: {
    chainId,
    target: Address,
    operator: string,
    literalOperand: string,
}) => {

    const { symbol, decimals, isLoading } = useTokenInfo(target, chainId)

    const formattedLiteralOperand = useMemo(() => {
        const decoded = decodeAbiParameters([{ name: 'x', type: 'uint256' }], literalOperand as Hex)[0]
        return formatUnits(decoded, decimals)

    }, [literalOperand, decimals])

    const operatorSpecificText = useMemo(() => {
        switch (operator) {
            case "0": return "Hold exactly"
            case "1": return "Hold more than"
            case "2": return "Hold less than"
        }

    }, [operator, decimals])

    if (isLoading) return <p>Loading...</p>
    return <p>{`${operatorSpecificText} ${formattedLiteralOperand} ${symbol}`}</p>

}


const DisplayLogicRule = ({
    chainId,
    target,
    signature,
    data,
    operator,
    literalOperand,
}: {
    chainId,
    target: Address,
    signature: string,
    data: string,
    operator: string,
    literalOperand: string,
}) => {

    if (signature === '0x70a08231' || signature === '0x00fdd58e') return <TokenLogicRule chainId={chainId} target={target} operator={operator} literalOperand={literalOperand} />
    else return null
}

const DisplayCredits = ({ interactionPower, interactionPowerType, creditContextLabel }: { interactionPower: string, interactionPowerType: string, creditContextLabel: string }) => {

    const readableInteractionPowerType = interactionPowerType === "0" ? "Uniform" : "Weighted"
    const readableInteractionPower = readableInteractionPowerType === "Weighted" ? `Weighted ${creditContextLabel}` : `${interactionPower} ${creditContextLabel}`

    return <div className="rounded-xl pl-2 pr-2 bg-success font-normal bg-opacity-10 text-success text-sm">{readableInteractionPower}</div>;

}

const LogicDisplay = ({ chainId, logicObject, creditContextLabel }: { chainId: number, logicObject: ILogicConfig | null, creditContextLabel: string }) => {

    return (

        logicObject && logicObject.logic.targets.length > 0 ? (
            <div className="flex flex-col gap-1 p-2 text-t2 text-sm">
                {logicObject.logic.targets
                    .slice(0, 3)
                    .map((_, idx: number) => {
                        const target = logicObject.logic.targets[idx]
                        const signature = logicObject.logic.signatures[idx]
                        const data = logicObject.logic.datas[idx]
                        const operator = logicObject.logic.operators[idx]
                        const literalOperand = logicObject.logic.literalOperands[idx]
                        const interactionPowerType = logicObject.logic.interactionPowerTypes[idx]
                        const interactionPower = logicObject.logic.interactionPowers[idx]

                        return (
                            <div key={idx} className="flex gap-2 items-center">
                                <DisplayLogicRule chainId={chainId} target={target} signature={signature} data={data} operator={operator} literalOperand={literalOperand} />
                                <DisplayCredits interactionPowerType={interactionPowerType} interactionPower={interactionPower} creditContextLabel={creditContextLabel} />
                            </div>
                        )

                        // if (logicObject.logic.signatures[idx] === '0x00fdd58e') return null
                        // else if (logicObject.logic.signatures[idx] === '0x70a08231') return <TokenLogicRule key={idx} chainId={chainId} target={target} operator={operator} literalOperand={literalOperand} />
                        // else return null
                    })}
                {/* modal content */}
                {/* <ExpandSection
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
                    </ExpandSection> */}
            </div>
        ) : (
            <p className="text-t2 p-2 text-sm">Anyone can submit!</p>
        )

    );
};



const RewardsSection = ({
    chainId,
    transportConfig,
}: {
    chainId: number;
    transportConfig: IFiniteTransportConfig
}) => {

    const isNativeToken = transportConfig.token === NATIVE_TOKEN;

    const { symbol: erc20Symbol, decimals: erc20Decimals } = useErc20TokenInfo(transportConfig.token, chainId);

    const symbol = isNativeToken ? "ETH" : erc20Symbol;
    const decimals = isNativeToken ? 18 : erc20Decimals;

    return (
        <DetailSectionWrapper
            title="Submitter Rewards"
            tooltipContent={
                <p className="font-normal">
                    At the end of the voting period, these rewards are allocated to
                    submissions that finish in the pre-defined ranks.
                </p>
            }
        >
            {transportConfig.ranks.length > 0 ? (
                <div className="flex flex-col gap-1 p-2 text-t2">
                    <h2 className="text-sm font-semibold">Rank</h2>
                    {transportConfig.ranks
                        .slice(0, 3)
                        .map((rank, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="flex flex-row gap-2 items-center justify-start text-sm"
                                >
                                    <p>{formatOrdinals(rank)}:</p>
                                    <div className="flex flex-row ml-4 items-center gap-2">
                                        <p>{formatUnits(transportConfig.allocations[idx], decimals)}</p>
                                        <p>{symbol}</p>
                                    </div>
                                </div>
                            );
                        })}
                    {/* modal content */}
                    {/* <ExpandSection
                        data={[]}
                        label={`+ ${transportConfig.ranks.length - 3} rewards`}
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
                    </ExpandSection> */}
                </div>
            ) : (
                <p className="text-t2 p-2 text-sm">None</p>
            )}
        </DetailSectionWrapper>
    );
};

// thinking ...
// contractID
// creatorLogic (need types)
// minterLogic (need types)
// rewards (need types)

const ContestDetailsV2 = ({
    contractId,
    transportConfig,
    creatorLogic,
    minterLogic
}: {
    contractId: ContractID;
    transportConfig: IFiniteTransportConfig;
    creatorLogic: ILogicConfig | null;
    minterLogic: ILogicConfig | null;
}) => {

    const { chainId, contractAddress } = splitContractID(contractId);
    const { channelState, stateRemainingTime } = useFiniteTransportLayerState(contractId);

    // const contestData = await fetchContest(contestId).then(async (res) => {
    //     const promptData = await fetch(res.promptUrl).then((res) => res.json());
    //     return { ...res, promptData };
    // });
    // const {
    //     chainId,
    //     deadlines,
    //     space,
    //     submitterRewards,
    //     voterRewards,
    //     votingPolicy,
    //     submitterRestrictions,
    //     promptData,
    // } = contestData;

    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4">
                {/* <DetailSectionWrapper title={"Network"}>
                    <div className="flex gap-2 items-center pl-2">
                        <p>{getChainName(chainId)}</p>
                        <ChainLabel chainId={chainId} px={16} />
                    </div>
                </DetailSectionWrapper> */}
                <RewardsSection transportConfig={transportConfig} chainId={chainId} />
                <DetailSectionWrapper
                    title="Entry Requirements"
                    tooltipContent={<p className="font-normal">{`Users satisfying at least one requirement are elgible to submit.`}</p>}
                >
                    <LogicDisplay logicObject={creatorLogic} chainId={chainId} creditContextLabel="entries" />
                </DetailSectionWrapper>
                <DetailSectionWrapper
                    title="Voting Requirements"
                    tooltipContent={<p className="font-normal">{`Users satisfying at least one requirement are elgible to vote.`}</p>}
                >
                    <LogicDisplay logicObject={minterLogic} chainId={chainId} creditContextLabel="votes" />
                </DetailSectionWrapper>
            </div>
            {/* <RenderStateSpecificDialog
                contestId={contestId}
                startTime={deadlines.startTime}
                spaceId={space.id}
                prompt={promptData}
            /> */}

            <RenderStatefulChildAndRemainingTime contractId={contractId} childStateWindow={"submitting"} >
                <Link href={`${contractId}/studio`} passHref>
                    <Button>Submit</Button>
                </Link>
            </RenderStatefulChildAndRemainingTime>

        </div>
    );
};

export default ContestDetailsV2;