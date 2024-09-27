"use client";
import { mutateChannel } from "@/app/mutate";
import { useMintBoardSettings, MintBoardSettingsInput } from "@/hooks/useMintboardSettings";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import useSWRMutation from "swr/mutation";
import { useCreateInfiniteChannel } from "@tx-kit/hooks";
import { useAccount } from 'wagmi';
import OnchainButton from "@/ui/OnchainButton/OnchainButton";
import { Space } from "@/types/space";
import { insertChannel } from "@/lib/fetch/insertChannel";
import { MintboardSettings } from "@/ui/MintboardSettings/MintboardSettings";
import { useTransmissionsErrorHandler } from "@/hooks/useTransmissionsErrorHandler";
import { concatContractID, ContractID } from "@/types/channel";
import { useChannel } from "@/hooks/useChannel";
import { Button } from "@/ui/DesignKit/Button";




const WaitForNewChannel = ({ spaceData, contractId }: { spaceData: Space, contractId: ContractID }) => {
    const { channel } = useChannel(contractId, 5000);
    const router = useRouter();

    useEffect(() => {
        if (channel) {
            mutateChannel(contractId)
            router.push(`/${spaceData.name}/mintboard/${contractId}`, { scroll: false })
            router.refresh();
            toast.success('Mintboard Configured!')
        }
    }, [channel])


    return (
        <div className="flex flex-col gap-4 justify-center items-center h-96">
            <h2 className="text-xl text-t1 font-bold">Creating Mintboard...</h2>
            <TbLoader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )

}


const BoardForm = ({ spaceData, priorState }: { spaceId: string, priorState: MintBoardSettingsInput | null, spaceData: Space }) => {
    const { state, setField, validateNewMintboardSettings } = useMintBoardSettings(priorState, spaceData);
    const [waitForNewChannel, setWaitForNewChannel] = useState(false);
    const { data: session, status } = useSession();
    const { chain } = useAccount();
    const { createInfiniteChannel, channelAddress, txHash, status: txStatus, error: txError } = useCreateInfiniteChannel();

    const contractId = concatContractID({ chainId: state.chainId, contractAddress: channelAddress })

    useTransmissionsErrorHandler(txError);


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
                spaceId: spaceData.id,
                contractId: contractId,
                channelType: "infinite",

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
        if (txStatus == "complete") {
            handleChannelCreated();
        }
    }, [txStatus]);


    const handleSubmit = async () => {
        const { success, data } = await validateNewMintboardSettings();
        if (!success) {
            return toast.error("Some of your fields are invalid")
        }
        await createInfiniteChannel(data)
    }

    if (waitForNewChannel) return <WaitForNewChannel spaceData={spaceData} contractId={contractId} />

    return (
        <MintboardSettings
            state={state}
            setField={setField}
            isNew={true}
        >
            <OnchainButton
                chainId={state.chainId}
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
                                    <span>processing</span>
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