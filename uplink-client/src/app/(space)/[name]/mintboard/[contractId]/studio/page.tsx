import { CreateToken } from "@/ui/Studio/TokenStudio";
import { Suspense } from "react";
import { ContractID } from "@/types/channel";
import fetchChannel from "@/lib/fetch/fetchChannel";
import SwrProvider from "@/providers/SwrProvider";

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

const PageContent = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {
    const channel = await fetchChannel(contractId);
    const fallback = {
        [`/swrChannel/${contractId}`]: channel,
    }

    return (
        <SwrProvider fallback={fallback}>
            <CreateToken contractId={contractId} spaceSystemName={spaceName} />
        </SwrProvider>
    )
}

export default async function Page({ params }: { params: { name: string, contractId: ContractID } }) {
    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 m-auto mt-4 mb-16 p-2">
            <Suspense fallback={<LoadingDialog />}>
                <PageContent spaceName={params.name} contractId={params.contractId} />
            </Suspense>
        </div >
    )
}