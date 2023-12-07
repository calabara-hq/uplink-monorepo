import { CreateBoardPost } from "./client";
import { Suspense } from "react";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { MintBoard } from "@/types/mintBoard";
import SwrProvider from "@/providers/SwrProvider";

const createDropTemplate = (mintBoard: MintBoard) => {
    if (!mintBoard) return null;
    return {
        dropConfig: {
            ...mintBoard,
            imageURI: "",
            animationURI: "",
            saleConfig: {
                publicSalePrice: mintBoard.publicSalePrice,
                publicSaleStart: mintBoard.publicSaleStart,
                publicSaleEnd: mintBoard.publicSaleEnd,
            },
        },
        referrer: mintBoard.referrer
    }
}


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


const PageContent = async ({ spaceName }: { spaceName: string }) => {
    const mintBoard = await fetchMintBoard(spaceName);
    const { dropConfig, referrer } = createDropTemplate(mintBoard);

    const fallback = {
        [`/mintBoard/${spaceName}`]: mintBoard,
    };

    return (
        <SwrProvider fallback={fallback}>
            <CreateBoardPost spaceName={spaceName} displayName={mintBoard.space.displayName} templateConfig={dropConfig} referrer={referrer} />
        </SwrProvider>
    )
}


export default async function Page({ params }: { params: { name: string } }) {

    return (
        <div className=" flex flex-col gap-6 w-full md:w-10/12 max-w-[600px] m-auto mt-4 mb-16 p-4">
            <Suspense fallback={<LoadingDialog />}>
                {/*@ts-expect-error*/}
                <PageContent spaceName={params.name} />
            </Suspense>
        </div >
    )


}