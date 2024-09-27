import { calculateImageAspectRatio } from "@/lib/farcaster/utils";
import fetchChannel from "@/lib/fetch/fetchChannel";
import { fetchSingleTokenV1 } from "@/lib/fetch/fetchTokensV2";
import { parseIpfsUrl } from "@/lib/ipfs";
import { ContractID } from "@/types/channel";
import { Boundary } from "@/ui/Boundary/Boundary";
import { MintTokenSwitch, MintV1Onchain } from "@/ui/Token/MintToken";
import { Metadata } from "next";
import React, { Suspense } from "react";

export async function generateMetadata({
    params,
    searchParams
}: {
    params: { name: string, contractId: ContractID, postId: string };
    searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {

    const { name: spaceName, contractId, postId } = params

    const referral = searchParams?.referrer ?? ""
    const token = await fetchSingleTokenV1(contractId, postId)
    const author = token.author
    const aspect = await calculateImageAspectRatio(parseIpfsUrl(token.metadata.image).gateway)

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:image": parseIpfsUrl(token.metadata.image).gateway,
        "fc:frame:image:aspect_ratio": aspect, // todo is this necc???
    };

    const linkableMetadata: Record<string, string> = {
        "fc:frame:button:1": "Mint on uplink",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}/post/${postId}/v1${referral ? `?referrer=${referral}` : ''}`,
    }

    return {
        title: `Mint ${token.metadata.name} on uplink`,
        description: `Mint ${token.metadata.name} on uplink`,
        openGraph: {
            title: `Mint ${token.metadata.name} on uplink`,
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
            ...linkableMetadata
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
const PageContent = async ({ spaceName, contractId, postId }: { spaceName: string, contractId: ContractID, postId: string }) => {

    const [
        channel,
        token
    ] = await Promise.all([
        fetchChannel(contractId),
        fetchSingleTokenV1(contractId, postId)
    ])


    return <MintTokenSwitch
        referral=""
        contractAddress={channel.id}
        channel={channel}
        token={token}
        display="expanded"
        backwardsNavUrl={`/${spaceName}/mintboard/${contractId}`}
    />
}

export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (
        <div className="grid grid-cols-1 gap-6 w-full sm:w-9/12 m-auto h-full mt-4 p-4">
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <PageContent spaceName={params.name} contractId={params.contractId} postId={params.postId} />
            </Suspense>
        </div>
    );
}