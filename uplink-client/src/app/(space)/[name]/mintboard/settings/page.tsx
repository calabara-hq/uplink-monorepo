import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace"
import BoardForm from "./form";
import { Suspense } from "react";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { getContractFromEnv } from "@/lib/abi/zoraEdition";


const LoadingDialog = () => {
    return (
        <div
            className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center"
        >
            <p className="text-lg text-t1 font-semibold">Loading Config</p>
            <div
                className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            />
        </div>
    );
};

const PageContent = async ({ spaceName }: { spaceName: string }) => {
    const mintBoard = await fetchMintBoard(spaceName).catch(() => { return null });
    const { chainId } = getContractFromEnv();

    return <BoardForm spaceName={spaceName} initialConfig={{ ...mintBoard, chainId }} />

}

export default async function Page({ params }: { params: { name: string } }) {


    return (
        <div className=" w-full md:w-[50vw] lg:w-[35vw] m-auto mt-4 mb-16 bg-base">
            <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
                <Suspense fallback={<LoadingDialog />}>
                    {/*@ts-expect-error*/}
                    <PageContent spaceName={params.name} />
                </Suspense>
            </div>
        </div>
    )
}