import { CreateToken } from "./client";
import { Suspense } from "react";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { ContractID } from "@/types/channel";

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
    const space = await fetchSingleSpace(spaceName);

    return (
        <CreateToken contractId={contractId} spaceDisplayName={space.displayName} spaceSystemName={spaceName} />
    )
}


export default async function Page({ params }: { params: { name: string, contractId: ContractID } }) {
    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 m-auto mt-4 mb-16 p-4">
            <Suspense fallback={<LoadingDialog />}>
                <PageContent spaceName={params.name} contractId={params.contractId} />
            </Suspense>
        </div >
    )


}