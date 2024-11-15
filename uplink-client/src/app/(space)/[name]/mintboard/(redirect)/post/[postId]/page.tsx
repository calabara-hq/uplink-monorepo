
import fetchSpaceChannels from "@/lib/fetch/fetchSpaceChannels";
import { concatContractID, isInfiniteChannel } from "@/types/channel";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { TbLoader2 } from "react-icons/tb";

// redirect legacy mintboard posts to v2 mintboard posts

const Redirect = async ({ spaceName, postId }: { spaceName: string, postId: string }) => {
    const channels = await fetchSpaceChannels(spaceName, 8453);
    const mintboard = channels.infiniteChannels[0];

    if (!mintboard) notFound();

    const contractId = concatContractID({ contractAddress: mintboard.id, chainId: mintboard.chainId });

    permanentRedirect(`/${spaceName}/mintboard/${contractId}/post/${postId}/v1`);
}


const RedirectFallback = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center h-96">
            <h2 className="text-xl text-t1 font-bold">Loading Post ...</h2>
            <TbLoader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )
}



export default function Page({ params }: { params: { name: string, postId: string } }) {
    return (
        <Suspense fallback={<RedirectFallback />}>
            <Redirect spaceName={params.name} postId={params.postId} />
        </Suspense>
    )
}