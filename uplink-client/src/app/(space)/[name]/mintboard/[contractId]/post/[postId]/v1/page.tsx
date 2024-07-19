import { calculateImageAspectRatio } from "@/lib/farcaster/utils";
import fetchChannel from "@/lib/fetch/fetchChannel";
import { fetchSingleTokenV1, fetchTokenIntents } from "@/lib/fetch/fetchTokensV2";
import { parseIpfsUrl } from "@/lib/ipfs";
import { ChannelToken, ChannelTokenIntent, ChannelTokenV1, ContractID, isTokenIntent, isTokenV1Onchain, isTokenV2Onchain, splitContractID } from "@/types/channel";
import { MintTokenSwitch, MintV1Onchain } from "@/ui/Token/MintToken";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";


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
            ...linkableMetadata
        },
    };
}





const ExpandedPostSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="w-64 h-8 bg-base-100 shimmer rounded-lg" />
                <div className="flex flex-row items-center h-8">
                    <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-base-100 shimmer rounded-xl" />
                        <div className="w-16 h-4 bg-base-100 shimmer rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="w-full h-0.5 bg-base-200" />
            <div className="w-96 m-auto h-96 bg-base-100 shimmer rounded-lg" />
        </div>
    );
};

const BackButton = ({ to, label }: { to: string, label: string }) => {
    return (
        <Link href={to} className="flex gap-2 w-fit text-t2 hover:text-t1 cursor-pointer p-2 pl-0"
        >
            <HiArrowNarrowLeft className="w-6 h-6" />
            <p>{label}</p>
        </Link>
    )
}


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
    />
}

export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (
        <div className="grid grid-cols-1 gap-6 w-11/12 m-auto h-full mt-4 p-4">
            <BackButton to={`/${params.name}/mintboard/${params.contractId}`} label="Mintboard" />
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <PageContent spaceName={params.name} contractId={params.contractId} postId={params.postId} />
            </Suspense>
        </div>
    );
}