"use client";

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
    const { metadata, setMetadata, validateMetadata } = useMetadataSettings();
    const { rewards, setRewards, validateRewards } = useRewardsSettings();
    const { deadlines, setDeadlines, validateDeadlines } = useDeadlineSettings();
    const { interactionLogic: submitterRules, setInteractionLogic: setSubmitterRules, validateInteractionLogic: validateSubmitterRules } = useInteractionLogicSettings()
    const { interactionLogic: voterRules, setInteractionLogic: setVoterRules, validateInteractionLogic: validateVoterRules } = useInteractionLogicSettings()

    const [chainId, setChainId] = useState(8453);
    const [waitForNewChannel, setWaitForNewChannel] = useState(false);


    useTransmissionsErrorHandler(error);

    const contractId = concatContractID({ chainId: chainId, contractAddress: channelAddress })

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

            // write to the blockchain TODO: just eth rewards for now

            const data: CreateFiniteChannelConfig = {
                uri: metadataOutput.uri,
                name: metadata.title,
                defaultAdmin: walletClient.account.address,
                managers: [], // todo space admins
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
                    value: rewardsOutput.totalAllocation
                }
            }

            await createFiniteChannel(data)

        } catch (e) {
            toast.error("Please fill out all required fields")
        }

    }


    if (waitForNewChannel) return <WaitForNewChannel spaceData={space} contractId={contractId} />


    return (
        <React.Fragment>
            <div className="flex flex-col gap-4 transition-all duration-200 ease-in-out w-full max-w-[850px] m-auto">
                <div className="flex flex-col gap-6 w-full">

                    <Metadata metadata={metadata} setMetadata={setMetadata} />
                    <Rewards rewards={rewards} setRewards={setRewards} />
                    <Deadlines deadlines={deadlines} setDeadlines={setDeadlines} />
                    <InteractionLogic mode="submit" interactionLogic={submitterRules} setInteractionLogic={setSubmitterRules} />
                    <InteractionLogic mode="vote" interactionLogic={voterRules} setInteractionLogic={setVoterRules} />

                    <OnchainButton
                        chainId={chainId}
                        title={"Save"}
                        onClick={handleSubmit}
                        isLoading={status === 'pendingApproval' || status === 'txInProgress'}
                        loadingChild={
                            <Button disabled>
                                <div className="flex gap-2 items-center">
                                    <p className="text-sm">{
                                        status === 'pendingApproval' ?
                                            <span>Awaiting Signature</span>
                                            :
                                            <span>processing</span>
                                    }
                                    </p>
                                    <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                                </div>
                            </Button>
                        }
                    />
                </div>
            </div>
        </React.Fragment>
    )
}
