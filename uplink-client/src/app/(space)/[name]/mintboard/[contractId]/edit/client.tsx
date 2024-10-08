"use client";;
import { useMintBoardSettings, MintBoardSettingsInput } from "@/hooks/useMintboardSettings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import { useMulticall } from "@tx-kit/hooks";
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { Space } from "@/types/space";
import { MintboardSettings } from "@/ui/MintboardSettings/MintboardSettings";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { mutateChannel } from "@/app/mutate";
import { ContractID, splitContractID } from "@/types/channel";
import { useChannel } from "@/hooks/useChannel";
import { UplinkClient } from "@tx-kit/sdk";
import { Button } from "@/ui/DesignKit/Button";

const WaitForEditChannel = ({ spaceData, contractId }: { spaceData: Space, contractId: ContractID }) => {
    const { mutateSwrChannel } = useChannel(contractId)

    const router = useRouter();

    useEffect(() => {
        // wait for 15 seconds and then refresh the channel
        setTimeout(() => {
            mutateChannel(contractId)
            mutateSwrChannel()
            router.push(`/${spaceData.name}/mintboard/${contractId}`, { scroll: false })
            router.refresh();
            toast.success('Mintboard Configured!')
        }, 15000)
    }, [])


    return (
        <div className="flex flex-col gap-4 justify-center items-center h-96">
            <h2 className="text-xl text-t1 font-bold">Updating Mintboard...</h2>
            <TbLoader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )

}




const BoardForm = ({ spaceData, priorState, contractId }: { spaceId: string, priorState: MintBoardSettingsInput | null, spaceData: Space, contractId: ContractID }) => {
    const { state, setField, validateEditMintboardSettings } = useMintBoardSettings(priorState, spaceData);
    const [waitForEditChannel, setWaitForEditChannel] = useState(false);
    const { multicall, txHash, status: txStatus, error: txError } = useMulticall();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { chain } = useAccount();

    const { contractAddress, chainId } = splitContractID(contractId)

    const calldataClient = new UplinkClient({ chainId, publicClient, walletClient });

    useTransmissionsErrorHandler(txError);

    const handleSubmit = async () => {

        const result = await validateEditMintboardSettings();
        if (!result.success) {
            return toast.error("Some of your fields are invalid")
        }

        const [cd_0, cd_1, cd_2] = await Promise.all([
            calldataClient.callData.updateChannelMetadata({
                channelAddress: contractAddress,
                ...result.data.updatedMetadata
            }),
            calldataClient.callData.updateChannelFees({
                channelAddress: contractAddress,
                ...result.data.updatedFees
            }),
            calldataClient.callData.updateInfiniteChannelTransportLayer({
                channelAddress: contractAddress,
                ...result.data.updatedTransportLayer
            })
        ])

        await multicall({ channelAddress: contractAddress, calls: [cd_0, cd_1, cd_2] }).then((events) => {
            if (events) setWaitForEditChannel(true)
        })
    }


    if (waitForEditChannel) return <WaitForEditChannel spaceData={spaceData} contractId={contractId} />

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
                    <Button disabled className="w-auto">
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
                    </Button>
                }
            />
        </MintboardSettings>
    )
}

export default BoardForm