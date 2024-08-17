import fetchChannel from "@/lib/fetch/fetchChannel";
import { fetchSingleTokenIntent, fetchSingleTokenV2 } from "@/lib/fetch/fetchTokensV2";
import { ContractID } from "@/types/channel";
import React, { Suspense } from "react";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
import { calculateImageAspectRatio } from "@/lib/farcaster/utils";
import { parseIpfsUrl } from "@/lib/ipfs";
import { Metadata } from "next";
import { Boundary } from "@/ui/Boundary/Boundary";


export async function generateMetadata({
    params,
    searchParams
}: {
    params: { name: string, contractId: ContractID, postId: string };
    searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {

    const { name: spaceName, contractId, postId } = params

    const isIntent = searchParams?.intent ? true : false
    const referral = searchParams?.referrer ?? ""

    const channel = await fetchChannel(contractId);
    const token = isIntent ? await fetchSingleTokenIntent(contractId, postId) : await fetchSingleTokenV2(contractId, postId)

    const author = token.author

    const aspect = await calculateImageAspectRatio(parseIpfsUrl(token.metadata.image).gateway)

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:image": parseIpfsUrl(token.metadata.image).gateway,
        "fc:frame:image:aspect_ratio": aspect, // todo is this necc???
    };

    const mintableMetadata: Record<string, string> = {
        "fc:frame:button:1": "Mint",
        "fc:frame:button:1:action": "tx",
        "fc:frame:button:1:target": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/frames/${contractId}/v2/mint?postId=${postId}&intent=${isIntent ? 'true' : 'false'}&referrer=${referral}`,
        "fc:frame:button:1:post_url": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/frames/${contractId}/v2/after-mint?spaceName=${spaceName}&postId=${postId}&intent=${isIntent ? 'true' : 'false'}`,
    }

    return {
        title: `${author}`,
        description: `Mint ${token.metadata.name} on uplink`,
        openGraph: {
            title: `${author}`,
            description: `Mint ${token.metadata.name} on uplink`,
            images: [
                {
                    url: parseIpfsUrl(token.metadata.image).gateway,
                    width: 600,
                    height: 600,
                    alt: `${params.postId} media`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        other: {
            ...fcMetadata,
            ...mintableMetadata
        },
    };
}


const ExpandedPostSkeleton = () => {
    return (
        <React.Fragment>
            <div className="mt-14" />
            <Boundary >
                <div className="grid grid-cols-1 lg:grid-cols-[45%_50%] gap-2 md:gap-12 w-full">
                    <div className="flex flex-col gap-4 items-center justify-center flex-grow-0">
                        <div className="w-full h-96 m-auto bg-base-100 shimmer rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-8 justify-start ">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2">
                                <div className="w-16 h-4 bg-base-100 shimmer rounded-lg" />
                                <div className="flex gap-2 items-center text-sm text-t2 bg-base rounded-lg p-1">
                                    <div className="w-8 h-8 bg-base-100 shimmer rounded-lg" />
                                    <div className="w-16 h-2 bg-base-100 shimmer rounded-lg" />
                                </div>
                            </div>
                            <div className="w-full h-4 bg-base-100 shimmer rounded-lg" />
                            <div className="w-full h-4 bg-base-100 shimmer rounded-lg" />
                        </div>
                        <div className="w-full h-16 bg-base-100 shimmer rounded-lg" />
                        <div className="w-full h-16 bg-base-100 shimmer rounded-lg" />
                    </div>
                </div>
            </Boundary>
        </React.Fragment>
    );
};


const PageContent = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {

    const isIntent = searchParams?.intent ? true : false

    const [
        channel,
        token
    ] = await Promise.all([
        fetchChannel(contractId),
        isIntent ? fetchSingleTokenIntent(contractId, postId) : fetchSingleTokenV2(contractId, postId)
    ])


    return <MintTokenSwitch
        referral={searchParams.referral}
        contractAddress={channel.id}
        channel={channel}
        token={token}
        display="expanded"
        backwardsNavUrl={`/${spaceName}/mintboard/${contractId}`}
    />
}



/// need to handle 3 cases:
/// 1. v2 token
/// 2. v1 token
/// 3. v2 intent

/// older v1 posts can redirect somewhere else

export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (
        <div className="grid grid-cols-1 gap-6 w-full sm:w-9/12 m-auto h-full mt-4 p-4">
            {/* <ExpandedPostSkeleton />
            <PageContent spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} /> */}
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <PageContent spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}