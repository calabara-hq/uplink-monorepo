



import fetchSpaceChannels from "@/lib/fetch/fetchSpaceChannels";
import { concatContractID, isInfiniteChannel } from "@/types/channel";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { TbLoader2 } from "react-icons/tb";

// redirect legacy mintboards to v2 mintboards

const Redirect = async ({ spaceName }: { spaceName: string }) => {
    const channels = await fetchSpaceChannels(spaceName, 8453);
    const mintboard = channels.infiniteChannels[0];

    if (!mintboard) notFound();

    const contractId = concatContractID({ contractAddress: mintboard.id, chainId: mintboard.chainId });
    permanentRedirect(`/${spaceName}/mintboard/${contractId}`);
}


const RedirectFallback = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center h-96">
            <h2 className="text-xl text-t1 font-bold">Loading Mintboard...</h2>
            <TbLoader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    )
}



export default function Page({ params }: { params: { name: string } }) {
    return (
        <Suspense fallback={<RedirectFallback />}>
            <Redirect spaceName={params.name} />
        </Suspense>
    )
}