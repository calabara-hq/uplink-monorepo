"use client";
import { CreateToken } from "@/ui/Studio/TokenStudio";
import { ContractID } from "@/types/channel";
import { useChannel } from "@/hooks/useChannel";
import { IFiniteTransportConfig } from "@tx-kit/sdk/subgraph";
import { Button } from "@/ui/DesignKit/Button";
import Link from "next/link";

const LoadingDialog = () => {
    return (
        <div
            className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center"
        >
            <p className="text-lg text-t1 font-semibold">Starting up the studio</p>
            <div
                className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            />
        </div>
    );
};


const PageContent = ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {

    const { channel, isLoading } = useChannel(contractId)

    if (isLoading) return <LoadingDialog />

    if (channel) {

        const timestampInSeconds = Math.floor(Date.now() / 1000)
        const transportConfig = channel.transportLayer.transportConfig as IFiniteTransportConfig

        if (timestampInSeconds < Number(transportConfig.createStart) || timestampInSeconds > Number(transportConfig.mintStart)) {
            return (
                <div className="flex flex-col gap-2 items-center justify-center h-[60vh]">
                    <p>Contest is not accepting submissions</p>
                    <Link href={`/${spaceName}/contest/${contractId}`} passHref>
                        <Button variant="outline">Back to contest</Button>
                    </Link>
                </div>
            )
        }
    }


    return (
        <CreateToken contractId={contractId} spaceSystemName={spaceName} allowIntents={false} />
    )
}


export default function Page({ params }: { params: { name: string, contractId: ContractID } }) {
    return (
        <div className=" flex flex-col gap-6 w-full md:w-11/12 m-auto mt-4 mb-16 p-2 ">
            <PageContent spaceName={params.name} contractId={params.contractId} />
        </div >
    )
}