import { ConfigurableZoraEditionInput, ConfigurableZoraEditionSchema } from "@/hooks/useCreateZoraEdition";
import { CreateBoardPost } from "./client";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { Suspense } from "react";

const fetchDropTemplate = async (spaceName: string) => {
    const space = await fetchSingleSpace(spaceName);
    const { mintBoard, ...rest } = space;
    if (mintBoard) {
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
                editionSize: mintBoard.editionSize,
            },
            referrer: mintBoard.referrer
        }
    }
    return null;
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
    const { dropConfig, referrer } = await fetchDropTemplate(spaceName);
    return <CreateBoardPost spaceName={spaceName} templateConfig={dropConfig} referrer={referrer} />
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