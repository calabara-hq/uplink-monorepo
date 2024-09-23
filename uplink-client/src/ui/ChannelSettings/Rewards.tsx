"use client";

import { useEffect, useReducer, useState } from "react";
import { z } from "zod";
import { FieldError, SectionWrapper } from "./Utils";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { HiCheckBadge } from "react-icons/hi2";
import { IERCToken } from "@/types/token";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/ui/DesignKit/Table";
import { Input } from "../DesignKit/Input";
import { Button } from "../DesignKit/Button";
import { parseUnits } from "viem";
import { validateFiniteTransportLayer } from "@tx-kit/sdk/utils";
import { MdOutlineDelete } from "react-icons/md";
import { Info } from "../DesignKit/Info";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { getTokenInfo } from "@/lib/tokenInfo";
import { Dialog, DialogContent, DialogFooter } from "../DesignKit/Dialog";
import { AddToken } from "../ManageTokenModal/ManageTokenModal";
import { useManagedTokenEditor } from "@/hooks/useTokenManager";


const rewardsSchema = z.object({
    chainId: z.union([z.literal(8453), z.literal(84532)]),
    rewardToken: z.string().min(1, { message: "Reward token is required" }),
    rewardRanks: z.array(z.number()),
    rewardAllocations: z.array(z.string()),
}).transform(async (data, ctx) => {

    const fetchTokenDecimals = async (token: string) => {
        if (token === NATIVE_TOKEN) return 18;

        const { decimals } = await getTokenInfo({ contractAddress: token, chainId: data.chainId }).catch(() => {
            return { decimals: 0 }
        })
        return decimals;
    }

    const tokenDecimals = await fetchTokenDecimals(data.rewardToken);

    const allocations = data.rewardAllocations.map(alloc => parseUnits(alloc, tokenDecimals));
    const totalAllocation = allocations.reduce((acc, curr) => acc + curr, BigInt(0));

    const rewards = {
        ranks: data.rewardRanks,
        allocations: allocations,
        totalAllocation,
        token: data.rewardToken,
    }

    for (let i = 0; i < allocations.length; i++) {
        console.log(allocations[i])
        if (allocations[i] === BigInt(0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rewardAllocations"],
                message: "1 or more allocations are blank"
            })
            break;
        }

        if (!rewards.ranks[i]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rewardRanks"],
                message: "1 or more ranks are blank"
            })
            break;
        }

    }


    try {
        console.log(rewards)
        validateFiniteTransportLayer({
            rewards,
            createStartInSeconds: 1, // don't care about timing validation here. use random values
            mintStartInSeconds: 2,
            mintEndInSeconds: 3,
        })
    } catch (e) {
        console.log(e)
        if (e.message.startsWith("Invalid rank")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rewardRanks"],
                message: "Invalid ranks. Ranks must be unique and in ascending order"
            })
        }
    }

    return rewards
});

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export type RewardsInput = z.input<typeof rewardsSchema>;
export type RewardsOutput = z.output<typeof rewardsSchema>;
export type RewardsState = RewardsInput & { errors?: ZodSafeParseErrorFormat };

const RewardsReducer = (state: RewardsState, action: { type: string; payload: any }): RewardsState => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: undefined }, // Clear error when field is set
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
}

export const useRewardsSettings = (initialState?: RewardsInput) => {

    const [rewards, dispatch] = useReducer(RewardsReducer, {
        chainId: 8453,
        rewardToken: NATIVE_TOKEN,
        rewardRanks: [1],
        rewardAllocations: [""],
        ...initialState,
    });

    const setRewards = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const validateRewards = async () => {
        const { errors, ...rest } = rewards;
        const result = await rewardsSchema.safeParseAsync(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof rewardsSchema>).error.format();
            console.log(formattedErrors);
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            throw new Error("Invalid rewards settings");
        }

        return result;
    }
    return {
        rewards,
        setRewards,
        validateRewards,
    };
}

const SubmitterRewardMatrix = ({ rewards, setRewards }: { rewards: RewardsState, setRewards: (field: string, value: any) => void }) => {

    const { symbol: erc20Symbol, decimals: erc20Decimals } = useTokenInfo(rewards.rewardToken, rewards.chainId)
    const symbol = rewards.rewardToken === NATIVE_TOKEN ? "ETH" : erc20Symbol

    const updateRank = (index: number, value: number) => {
        const newRanks = [...rewards.rewardRanks]
        newRanks[index] = value
        setRewards("rewardRanks", newRanks)
    }

    const updateAllocation = (index: number, value: string) => {
        const newAllocations = [...rewards.rewardAllocations]
        newAllocations[index] = value
        setRewards("rewardAllocations", newAllocations)
    }

    const addRow = () => {
        setRewards("rewardRanks", [...rewards.rewardRanks, rewards.rewardRanks.length + 1])
        setRewards("rewardAllocations", [...rewards.rewardAllocations, ""])
    }

    const removeRow = (index: number) => {
        const newRanks = [...rewards.rewardRanks]
        const newAllocations = [...rewards.rewardAllocations]
        newRanks.splice(index, 1)
        newAllocations.splice(index, 1)
        setRewards("rewardRanks", newRanks)
        setRewards("rewardAllocations", newAllocations)
    }

    if (rewards.rewardToken) return (
        <div className="flex flex-col gap-2 w-full">
            <p className="text-t2">2. Allocate rewards</p>
            <Table className="w-full  bg-base-200 rounded-lg p-2">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center">Rank</TableHead>
                        <TableHead className="w-[150px] text-center">{symbol} Payout</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rewards.rewardRanks.map((rank, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                <Input
                                    variant="outline"
                                    className="text-center"
                                    type="number"
                                    value={rank || ""}
                                    onChange={(e) => updateRank(index, Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    variant="outline"
                                    className="text-center"
                                    type="number"
                                    value={rewards.rewardAllocations[index] || ""}
                                    onChange={(e) => updateAllocation(index, e.target.value)}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                {index > 0 && (
                                    <Button variant="destructive" className="w-fit" onClick={() => removeRow(index)}><MdOutlineDelete className="w-5 h-5 text-t1" /></Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>
                    <Button variant="outline" className="w-full" onClick={addRow}>Add Row</Button>
                </TableCaption>
            </Table>
        </div>
    )
}

export const Rewards = ({ rewards, setRewards }: { rewards: RewardsState, setRewards: (field: string, value: any) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { managedToken, setManagedToken, validateManagedToken } = useManagedTokenEditor({ chainId: rewards.chainId });


    const handleAddToken = (address: string) => {
        setRewards("rewardToken", address)
        if (rewards.rewardRanks.length === 0) {
            setRewards("rewardRanks", [1])
        }
        if (rewards.rewardAllocations.length === 0) {
            setRewards("rewardAllocations", [""])
        }
    }

    const handleModalConfirm = () => {
        try {
            const result = validateManagedToken();
            handleAddToken(result.data.address)
            setIsModalOpen(false)
        } catch (e) {
            console.log(e)
        }
    }



    const handleRemoveToken = (val: any) => { }

    const onSubmit = () => { }

    return (
        <SectionWrapper title="Rewards">
            <Info>
                <div className="flex flex-row gap-6 items-center">
                    <IoMdInformationCircleOutline className="w-5 h-5 font-normal text-primary11" />
                    Choose a reward token and how it will be distributed after voting concludes.
                </div>
            </Info>

            <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-4 w-full ">
                <div className="flex flex-col gap-2 w-full h-fit">
                    <p className="text-t2">1. Pick a reward token</p>
                    <div className="w-full flex flex-row gap-2">
                        <Button
                            variant="outline"
                            className={`relative h-24 w-36 ${rewards.rewardToken === NATIVE_TOKEN && "border-success hover:border-success"}`}
                            onClick={() => { handleAddToken(NATIVE_TOKEN) }}
                        >
                            ETH
                            <span className="absolute top-0 right-0">
                                {rewards.rewardToken === NATIVE_TOKEN && <HiCheckBadge className="w-6 h-6 text-success" />}
                            </span>
                        </Button>
                        {/* */}
                        <Button
                            variant="outline"
                            className={`relative h-24 w-36 ${rewards.rewardToken && rewards.rewardToken !== NATIVE_TOKEN && "border-success hover:border-success"}`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            ERC20
                            <span className="absolute top-0 right-0">
                                {rewards.rewardToken && rewards.rewardToken !== NATIVE_TOKEN && <HiCheckBadge className="w-6 h-6 text-success" />}
                            </span>
                        </Button>
                    </div>
                    {rewards.errors?.rewardToken?._errors && (
                        <FieldError error={rewards.errors.rewardToken._errors.join(",")} />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <SubmitterRewardMatrix
                        rewards={rewards}
                        setRewards={setRewards}
                    />
                    {rewards.errors?.rewardAllocations?._errors && (
                        <FieldError error={rewards.errors.rewardAllocations._errors.join(",")} />
                    )}
                    {rewards.errors?.rewardRanks?._errors && (
                        <FieldError error={rewards.errors.rewardRanks._errors.join(",")} />
                    )}
                </div>

            </div>

            <Dialog open={isModalOpen} onOpenChange={val => setIsModalOpen(val)}>
                <DialogContent>
                    <AddToken
                        state={managedToken}
                        setManagedToken={setManagedToken}
                    />
                    <DialogFooter>
                        <div className="flex w-full justify-between">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button disabled={!managedToken.address} onClick={handleModalConfirm}>Confirm</Button>
                        </div>
                    </DialogFooter >
                </DialogContent>
            </Dialog>
        </SectionWrapper>
    )
}

