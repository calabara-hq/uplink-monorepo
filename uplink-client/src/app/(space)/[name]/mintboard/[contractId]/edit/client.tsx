"use client";
import { useMintBoardSettings, MintBoardSettingsInput } from "@/hooks/useMintboardSettings";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import { useMulticall, useTransmissionsClient } from "@tx-kit/hooks";
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { Space } from "@/types/space";
import { MintboardSettings } from "@/ui/MintboardSettings/MintboardSettings";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { mutateChannel } from "@/app/mutate";
import { ContractID, splitContractID } from "@/types/channel";
import { useSWRConfig } from "swr";
import { useChannel } from "@/hooks/useChannel";

const BoardForm = ({ spaceData, priorState, contractId }: { spaceId: string, priorState: MintBoardSettingsInput | null, spaceData: Space, contractId: ContractID }) => {
    const { state, setField, validateEditMintboardSettings } = useMintBoardSettings(priorState, spaceData);
    const { mutateSwrChannel } = useChannel(contractId)
    const router = useRouter();
    const { multicall, txHash, status: txStatus, error: txError } = useMulticall();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const { contractAddress, chainId } = splitContractID(contractId)

    useTransmissionsErrorHandler(txError);

    const transmissionsClient = useTransmissionsClient({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
    })

    useEffect(() => {
        if (txStatus == "complete") {
            handleChannelUpdated()
        }
    }, [txStatus]);

    const handleSubmit = async () => {

        const result = await validateEditMintboardSettings();
        if (!result.success) {
            return toast.error("Some of your fields are invalid")
        }

        const [cd_0, cd_1, cd_2] = await Promise.all([
            transmissionsClient.uplinkClient.callData.updateChannelMetadata({
                channelAddress: contractAddress,
                ...result.data.updatedMetadata
            }),
            transmissionsClient.uplinkClient.callData.updateChannelFees({
                channelAddress: contractAddress,
                ...result.data.updatedFees
            }),
            transmissionsClient.uplinkClient.callData.updateInfiniteChannelTransportLayer({
                channelAddress: contractAddress,
                ...result.data.updatedTransportLayer
            })
        ])

        multicall({ channelAddress: contractAddress, calls: [cd_0, cd_1, cd_2] })

    }

    const handleChannelUpdated = () => {

        mutateChannel(contractId)
        mutateSwrChannel()
        router.push(`/${spaceData.name}/mintboard/${contractId}`, { scroll: false })
        router.refresh();
        return toast.success('Mintboard Configured!')
    }

    return (
        <MintboardSettings
            state={state}
            setField={setField} >
            <OnchainButton
                chainId={chainId}
                title={"Save"}
                onClick={handleSubmit}
                isLoading={txStatus === 'pendingApproval' || txStatus === 'txInProgress'}
                loadingChild={
                    <button className="btn btn-disabled normal-case w-auto">
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">{
                                txStatus === 'pendingApproval' ?
                                    <span>Awaiting Signature</span>
                                    :
                                    <span>Processing</span>
                            }
                            </p>
                            <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                        </div>
                    </button>
                }
            />
        </MintboardSettings>
    )
}

export default BoardForm