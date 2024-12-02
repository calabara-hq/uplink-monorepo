"use client";;
import { FaRegCircleQuestion } from "react-icons/fa6";
import React, { useEffect, useMemo } from "react";
import formatOrdinals from "@/lib/formatOrdinals";
import Link from "next/link";
import { ContractID, isNativeToken, splitContractID } from "@/types/channel";
import { IFiniteTransportConfig, ILogicConfig } from "@tx-kit/sdk/subgraph";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { Address, decodeAbiParameters, formatUnits, Hex } from "viem";
import { ChannelStateLabel, RemainingTimeLabel, RenderTransportLayerState } from "./SidebarUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../DesignKit/Tooltip";
import { Info } from "../DesignKit/Info";
import { Button } from "../DesignKit/Button";
import { useSettleFiniteChannel } from "@tx-kit/hooks";
import { useChannel } from "@/hooks/useChannel";
import { TbLoader2 } from "react-icons/tb";
import toast from "react-hot-toast";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { ChainId } from "@/types/chains";
import { ExpandSection } from "../../app/(legacy)/contest/[id]/client";

const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })

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



const TokenLogicRule = ({
    chainId,
    target,
    operator,
    literalOperand,
    signature,
    data,
}: {
    chainId: ChainId,
    target: Address,
    operator: string,
    literalOperand: string,
    signature: string,
    data: string
}) => {

    const { symbol, decimals, isLoading } = useTokenInfo(target, chainId)

    const formattedLiteralOperand = useMemo(() => {
        const decoded = decodeAbiParameters([{ name: 'x', type: 'uint256' }], literalOperand as Hex)[0]
        return compact_formatter.format(Number(formatUnits(decoded, decimals)))

    }, [literalOperand, decimals])

    const operatorSpecificText = useMemo(() => {
        switch (operator) {
            case "0": return "Hold exactly"
            case "1": return "Hold more than"
            case "2": return "Hold less than"
        }

    }, [operator, decimals])


    const tokenId = useMemo(() => {
        if (signature === '0x00fdd58e') {
            const decoded = decodeAbiParameters([{ name: 'x', type: 'address' }, { name: 'y', type: 'uint256' }], data as Hex)[1]
            return decoded
        }
        return null
    }, [signature, data])


    if (isLoading) return <p>Loading...</p>
    return <p>{
        `
            ${operatorSpecificText} 
            ${formattedLiteralOperand} 
            ${symbol}
            ${tokenId ? `#${tokenId}` : ""}
        
        `}</p>

}


const DisplayLogicRule = ({
    chainId,
    target,
    signature,
    data,
    operator,
    literalOperand,
}: {
    chainId: ChainId,
    target: Address,
    signature: string,
    data: string,
    operator: string,
    literalOperand: string,
}) => {

    if (signature === '0x70a08231' || signature === '0x00fdd58e') return <TokenLogicRule chainId={chainId} target={target} signature={signature} operator={operator} literalOperand={literalOperand} data={data} />
    else return null
}

const DisplayCredits = ({ interactionPower, interactionPowerType, creditContextLabel }: { interactionPower: string, interactionPowerType: string, creditContextLabel: string }) => {

    const readableInteractionPowerType = interactionPowerType === "0" ? "Uniform" : "Weighted"
    const readableInteractionPower = readableInteractionPowerType === "Weighted" ? `Weighted ${creditContextLabel}` : `${interactionPower} ${creditContextLabel}`

    return <div className="rounded-xl pl-2 pr-2 bg-success font-normal text-center bg-opacity-10 text-success text-sm h-fit min-w-[75px]">{readableInteractionPower}</div>;

}

// const normalizeLogic = (logicObject: ILogicConfig) => {
//     // group by hash(target, signature, operator, literalOperand)
//     // if erc1155, split tokenId from data
// }

export const LogicDisplay = React.memo(({ chainId, logicObject, creditContextLabel }: { chainId: ChainId, logicObject: ILogicConfig | null, creditContextLabel: string }) => {

    //const normalizedLogic = normalizeLogic(logicObject)


    return (

        logicObject && logicObject.logic.targets.length > 0 ? (
            <div className="flex flex-col gap-1 p-2 text-t2 text-sm">
                {logicObject.logic.targets
                    // TODO update slice back to 0
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
                    })}
                {/* modal content */}
                <ExpandSection
                    data={logicObject.logic.targets}
                    label={`+ ${logicObject.logic.targets.length - 3} requirements`}
                >
                    <div className="w-full flex flex-col gap-4 text-t1">
                        <h1 className="text-lg font-bold">Entry Requirements</h1>

                        <div className="flex flex-col gap-1 p-2 ">
                            {logicObject.logic.targets.map((_, idx: number) => {
                                const target = logicObject.logic.targets[idx]
                                const signature = logicObject.logic.signatures[idx]
                                const data = logicObject.logic.datas[idx]
                                const operator = logicObject.logic.operators[idx]
                                const literalOperand = logicObject.logic.literalOperands[idx]
                                const interactionPowerType = logicObject.logic.interactionPowerTypes[idx]
                                const interactionPower = logicObject.logic.interactionPowers[idx]

                                return (
                                    <>
                                        <div key={idx} className="flex gap-2 items-center text-sm">
                                            <DisplayLogicRule chainId={chainId} target={target} signature={signature} data={data} operator={operator} literalOperand={literalOperand} />
                                            <DisplayCredits interactionPowerType={interactionPowerType} interactionPower={interactionPower} creditContextLabel={creditContextLabel} />
                                        </div>
                                        <div className="w-full h-0.5 bg-base-200" />
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </ExpandSection>
            </div>
        ) : (
            <p className="text-t2 p-2 text-sm">Anyone can {creditContextLabel === "entries" ? "submit!" : "vote!"}</p>
        )

    );
});

LogicDisplay.displayName = "LogicDisplay";



const RewardsSection = ({
    chainId,
    transportConfig,
}: {
    chainId: ChainId;
    transportConfig: IFiniteTransportConfig
}) => {

    const isNative = isNativeToken(transportConfig.token);

    const { symbol: erc20Symbol, decimals: erc20Decimals } = useTokenInfo(transportConfig.token, chainId);

    const symbol = isNative ? "ETH" : erc20Symbol;
    const decimals = isNative ? 18 : erc20Decimals;

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
                                        <p>{compact_formatter.format(Number(formatUnits(transportConfig.allocations[idx], decimals)))}</p>
                                        <p>{symbol}</p>
                                    </div>
                                </div>
                            );
                        })}
                    {/* modal content */}
                    <ExpandSection
                        data={transportConfig.ranks}
                        label={`+ ${transportConfig.ranks.length - 3} rewards`}
                    >
                        <div className="w-full flex flex-col gap-4 text-t1">
                            <h1 className="text-lg font-bold">Submitter Rewards</h1>
                            <div className="flex flex-col gap-1">
                                {transportConfig.ranks.map(
                                    (rank, idx) => {
                                        return (
                                            <>
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

// thinking ...
// contractID
// creatorLogic (need types)
// minterLogic (need types)
// rewards (need types)

const ContestDetailsV2 = ({
    spaceName,
    contractId,
    transportConfig,
    creatorLogic,
    minterLogic
}: {
    spaceName: string;
    contractId: ContractID;
    transportConfig: IFiniteTransportConfig;
    creatorLogic: ILogicConfig | null;
    minterLogic: ILogicConfig | null;
}) => {

    const { chainId, contractAddress } = splitContractID(contractId);
    const { settle, status, txHash, error } = useSettleFiniteChannel();
    const isSettling = status === "pendingApproval" || status === "txInProgress";
    const { mutateSwrChannel } = useChannel(contractId);
    useTransmissionsErrorHandler(error);

    useEffect(() => {
        console.log(error)
    }, [error])

    useEffect(() => {
        if (status === "complete") {
            mutateSwrChannel();
            toast.success("Channel settled successfully");
        }
    }, [status])


    const handleSettle = async () => {
        await settle({ channelAddress: contractAddress as Address });
    }

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

            <RenderTransportLayerState contractId={contractId}>
                {({ isLoading, channelState, stateRemainingTime }) => {
                    if (isLoading) return (
                        <div className="w-full h-5 rounded-lg shimmer bg-base-100" />
                    )

                    if (channelState === "submitting") return (
                        <div className="grid grid-cols-[25%_75%] items-center justify-between rounded-lg gap-2 h-fit w-full">
                            <div className="bg-base-200 h-full rounded-xl p-2 flex items-center justify-center">
                                <p className="text-center text-t1 ">
                                    {channelState ? stateRemainingTime : <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />}
                                </p>
                            </div>
                            <Link className="w-full" href={`/${spaceName}/contest/${contractId}/studio`} passHref>
                                <Button className="w-full">Submit</Button>
                            </Link>
                        </div>

                    )

                    if (channelState === "complete") return (
                        <Button disabled={isSettling} onClick={handleSettle}>
                            {isSettling ? (
                                <div className="flex gap-2 items-center">
                                    <p>Settling</p>
                                    <TbLoader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : "Settle"}
                        </Button>
                    )

                    else return (
                        <div className="flex gap-2 items-center">
                            <RemainingTimeLabel channelState={channelState} remainingTime={stateRemainingTime} />
                            <ChannelStateLabel channelState={channelState} />
                        </div>
                    )
                }}
            </RenderTransportLayerState>
        </div>
    );
};

export default ContestDetailsV2;