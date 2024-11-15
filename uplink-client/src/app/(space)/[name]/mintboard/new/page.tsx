import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace"
import BoardForm from "./client";
import { Suspense } from "react";

const LoadingDialog = () => {
    return (
        <div
            className="animate-springUp flex flex-col gap-2 w-full h-[50vh] items-center justify-center"
        >
            <p className="text-lg text-t1 font-semibold">Loading</p>
            <div
                className="text-xs text-primary ml-1 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            />
        </div>
    );
};

const PageContent = async ({ spaceName }: { spaceName: string }) => {
    const space = await fetchSingleSpace(spaceName).catch(() => { return null });

    return <BoardForm spaceId={space.id} priorState={null} spaceData={space} />
}

export default async function Page({ params }: { params: { name: string } }) {

    return (
        <div className=" w-full md:w-10/12 lg:w-8/12 xl:w-5/12 m-auto mt-4 mb-16 bg-base">
            <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
                <Suspense fallback={<LoadingDialog />}>
                    <PageContent spaceName={params.name} />
                </Suspense>
            </div>
        </div>
    )
}