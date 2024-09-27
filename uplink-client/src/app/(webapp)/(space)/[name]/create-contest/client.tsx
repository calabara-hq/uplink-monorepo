"use client";;
import { useCreateFiniteChannel } from "@tx-kit/hooks";
import { CreateFiniteChannelConfig } from "@tx-kit/sdk";
import { useWalletClient } from "wagmi";
import React, { useEffect, useState } from "react";
import { Space } from "@/types/space";
import toast from "react-hot-toast";
import { Metadata, useMetadataSettings } from "@/ui/ChannelSettings/Metadata";
import { Rewards, useRewardsSettings } from "@/ui/ChannelSettings/Rewards";
import { Deadlines, useDeadlineSettings } from "@/ui/ChannelSettings/Deadlines";
import { InteractionLogic, useInteractionLogicSettings } from "@/ui/ChannelSettings/InteractionLogic";
import { concatContractID, ContractID } from "@/types/channel";
import useSWRMutation from "swr/mutation";
import { insertChannel } from "@/lib/fetch/insertChannel";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { useSession } from "@/providers/SessionProvider";
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { TbLoader2 } from "react-icons/tb";
import { useChannel } from "@/hooks/useChannel";
import { useRouter } from "next/navigation";
import { mutateChannel } from "@/app/mutate";
import { Button } from "@/ui/DesignKit/Button";
import { DevModeOnly } from "@/utils/DevModeOnly";
import { ChainSelect } from "@/ui/ChannelSettings/ChainSelect";
import { isNativeToken } from "@/types/token";
import { ChainId } from "@/types/chains";
import { Info } from "@/ui/DesignKit/Info";
import { SectionWrapper } from "@/ui/ChannelSettings/Utils";
import { getChainName } from "@/lib/chains/supportedChains";
import { ChainLabel } from "@/ui/ContestLabels/ContestLabels";


const WaitForNewChannel = ({ spaceData, contractId }: { spaceData: Space, contractId: ContractID }) => {
    const { channel } = useChannel(contractId, 5000);
    const router = useRouter();

    useEffect(() => {
        if (channel) {
            mutateChannel(contractId)
            router.push(`/${spaceData.name}/contest/${contractId}`, { scroll: false })
            router.refresh();
            toast.success('Contest Configured!')
        }
    }, [channel])


    return (
        <div className="flex flex-col gap-4 justify-center items-center h-96 m-auto">
            <h2 className="text-xl text-t1 font-bold">Creating Contest...</h2>
            <TbLoader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )

}

export const TempCreateContestV2 = ({ space }: { space: Space }) => {
    const { createFiniteChannel, status, txHash, error, channelAddress } = useCreateFiniteChannel();
    const { data: walletClient } = useWalletClient();
    const { data: session } = useSession();
    const [chainId, setChainId] = useState<ChainId>(8453);
    const { metadata, setMetadata, validateMetadata } = useMetadataSettings();
    const { rewards, setRewards, validateRewards } = useRewardsSettings({ chainId });
    const { deadlines, setDeadlines, validateDeadlines } = useDeadlineSettings();
    const { interactionLogic: submitterRules, setInteractionLogic: setSubmitterRules, validateInteractionLogic: validateSubmitterRules } = useInteractionLogicSettings({ chainId })
    const { interactionLogic: voterRules, setInteractionLogic: setVoterRules, validateInteractionLogic: validateVoterRules } = useInteractionLogicSettings({ chainId }, true)
    const [waitForNewChannel, setWaitForNewChannel] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const contractId = concatContractID({ chainId: chainId, contractAddress: channelAddress })
    useTransmissionsErrorHandler(error);

    const { trigger, data: swrData, error: swrError, isMutating: isSwrMutating, reset: resetSwr } = useSWRMutation(
        `/api/insertChannel/${contractId}`,
        insertChannel,
        {
            onError: (err) => {
                console.log(err);
                resetSwr();
            },
        }
    );

    const handleChannelCreated = async () => {
        try {
            await trigger({
                csrfToken: session.csrfToken,
                spaceId: space.id,
                contractId: contractId,
                channelType: "finite",

            }).then((response) => {
                if (!response.success) {
                    toast.error('Something went wrong')
                    return resetSwr();
                }
                setWaitForNewChannel(true);
            });
        } catch (e) {
            console.log(e)
            resetSwr();
        }
    }

    useEffect(() => {
        if (status == "complete") {
            handleChannelCreated();
        }
    }, [status]);



    const handleSubmit = async () => {

        try {
            const [{ data: metadataOutput }, { data: rewardsOutput }, { data: submitterLogicOutput }, { data: voterLogicOutput }] = await Promise.all([
                validateMetadata(),
                validateRewards(),
                validateSubmitterRules(),
                validateVoterRules()
            ])

            const { data: deadlinesOutput } = validateDeadlines()

            const data: CreateFiniteChannelConfig = {
                uri: metadataOutput.uri,
                name: metadata.title,
                defaultAdmin: walletClient.account.address,
                managers: space.admins.map((admin) => admin.address),
                setupActions: submitterLogicOutput.logicContract || voterLogicOutput.logicContract ?
                    [{
                        logicContract: submitterLogicOutput.logicContract || voterLogicOutput.logicContract,
                        creatorLogic: submitterLogicOutput.logic,
                        minterLogic: voterLogicOutput.logic
                    }]
                    : [],
                transportLayer: {
                    createStartInSeconds: deadlinesOutput.createStart,
                    mintStartInSeconds: deadlinesOutput.mintStart,
                    mintEndInSeconds: deadlinesOutput.mintEnd,
                    rewards: {
                        ...rewardsOutput
                    }
                },
                transactionOverrides: {
                    value: isNativeToken(rewardsOutput.token) ? rewardsOutput.totalAllocation : BigInt(0)
                }
            }

            await createFiniteChannel(data);

        } catch (e) {
            toast.error("Please fill out all required fields")
        }

    }


    if (waitForNewChannel) return <WaitForNewChannel spaceData={space} contractId={contractId} />


    return (
        <React.Fragment>
            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 m-auto w-full max-w-[1200px] p-6">
                <div className="flex flex-col gap-6 w-full h-auto">
                    <DevModeOnly>
                        <SectionWrapper title="Network">
                            <ChainSelect chainId={chainId} setChainId={setChainId} />
                        </SectionWrapper>
                    </DevModeOnly>
                    <SectionWrapper title="Network">
                        <div className="flex flex-row items-center gap-2">
                            <p className="font-bold">{getChainName(chainId)}</p>
                            <ChainLabel chainId={chainId} px={20} />
                        </div>
                    </SectionWrapper>
                    <Metadata metadata={metadata} setMetadata={setMetadata} />
                    <Rewards rewards={{ ...rewards, chainId }} setRewards={setRewards} />
                    <Deadlines deadlines={deadlines} setDeadlines={setDeadlines} />
                    <InteractionLogic mode="submit" interactionLogic={{ ...submitterRules, chainId }} setInteractionLogic={setSubmitterRules} />
                    <InteractionLogic mode="vote" interactionLogic={{ ...voterRules, chainId }} setInteractionLogic={setVoterRules} />
                </div>
                <div className="flex flex-col gap-6 rounded-lg p-2 border border-border bg-base-100 h-fit w-full">
                    <div className="flex flex-col gap-4">
                        <Info className="bg-base-200 text-t2">
                            <div className="flex flex-col gap-2 text-sm">
                                <p>
                                    After the voting period, the contest can be settled. Settling will distribute the rewards. <b>Anyone</b> can settle the contest after voting ends.</p>
                                <p>If you need to rescue the funds, you must do so before the voting period ends.</p>
                            </div>
                        </Info>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={hasReviewed} onChange={(e) => setHasReviewed(e.target.checked)} />
                                    <p>I understand</p>
                                </div>
                            </div>
                        </div>
                        <OnchainButton
                            chainId={chainId}
                            disabled={!hasReviewed}
                            title={"Save"}
                            onClick={handleSubmit}
                            isLoading={status === 'pendingApproval' || status === 'txInProgress' || status === 'erc20ApprovalInProgress'}
                            loadingChild={
                                <Button disabled>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-sm">{
                                            status === 'pendingApproval' ?
                                                <span>Awaiting Signature</span>
                                                : status === 'erc20ApprovalInProgress' ?
                                                    <span>Requesting Approval</span>
                                                    :
                                                    <span>Processing</span>
                                        }
                                        </p>
                                        <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                    </div>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

