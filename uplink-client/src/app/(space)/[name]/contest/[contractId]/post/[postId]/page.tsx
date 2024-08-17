import fetchChannel from "@/lib/fetch/fetchChannel";
import { fetchSingleTokenV2 } from "@/lib/fetch/fetchTokensV2";
import { ContractID } from "@/types/channel";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { Suspense } from "react";


const ExpandedPostSkeleton = () => {
    return <p>loading</p>
}


const Post = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {

    const [
        channel,
        token
    ] = await Promise.all([
        fetchChannel(contractId),
        fetchSingleTokenV2(contractId, postId)
    ])

    return <MintTokenSwitch
        referral={searchParams.referral}
        contractAddress={channel.id}
        channel={channel}
        token={token}
        display="contest-expanded"
        backwardsNavUrl={``}
    />
}

const Sidebar = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {
    return <div className="">sidebar</div>
}

export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {


    return (

        <div className="flex gap-6 m-auto w-full lg:w-[90vw] bg-blue-900">
            <div className="flex flex-col w-5/12 ml-auto gap-4 transition-all duration-200 ease-in-out bg-red-900">
                <Suspense fallback={<ExpandedPostSkeleton />}>
                    <Post spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
                </Suspense>
            </div>
            <div className="hidden lg:block sticky top-3 right-0 w-full max-w-[450px] flex-grow h-full">
                <Suspense fallback={<ExpandedPostSkeleton />}>
                    <Sidebar spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
                </Suspense>
            </div>
        </div>

    )


    return (
        <div className="grid grid-cols-[70%_30%] gap-6 w-9/12 m-auto h-full mt-4 p-4">
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <Post spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <Sidebar spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}