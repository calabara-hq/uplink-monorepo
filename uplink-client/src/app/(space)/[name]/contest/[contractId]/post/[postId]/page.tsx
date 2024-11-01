import { calculateImageAspectRatio } from "@/lib/farcaster/utils";
import fetchChannel from "@/lib/fetch/fetchChannel";
import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace";
import { fetchSingleTokenIntent, fetchSingleTokenV2 } from "@/lib/fetch/fetchTokensV2";
import { parseIpfsUrl } from "@/lib/ipfs";
import OptimizedImage from "@/lib/OptmizedImage";
import { ContractID } from "@/types/channel";
import { Button } from "@/ui/DesignKit/Button";
import { MintTokenSwitch } from "@/ui/Token/MintToken";
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

    const isIntent = searchParams?.intent ? true : false
    const referral = searchParams?.referrer ?? ""

    const channel = await fetchChannel(contractId);
    const token = isIntent ? await fetchSingleTokenIntent(contractId, postId) : await fetchSingleTokenV2(contractId, postId)

    const author = token.author

    const aspect = await calculateImageAspectRatio(parseIpfsUrl(token.metadata.image).gateway)

    // const fcMetadata: Record<string, string> = {
    //     "fc:frame": "vNext",
    //     "fc:frame:image": parseIpfsUrl(token.metadata.image).gateway,
    //     "fc:frame:image:aspect_ratio": aspect, // todo is this necc???
    // };

    // const mintableMetadata: Record<string, string> = {
    //     "fc:frame:button:1": "Mint",
    //     "fc:frame:button:1:action": "tx",
    //     "fc:frame:button:1:target": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/frames/${contractId}/v2/mint?postId=${postId}&intent=${isIntent ? 'true' : 'false'}&referrer=${referral}`,
    //     "fc:frame:button:1:post_url": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/frames/${contractId}/v2/after-mint?spaceName=${spaceName}&postId=${postId}&intent=${isIntent ? 'true' : 'false'}`,
    // }

    return {
        title: `${author}`,
        description: `${token.metadata.name}`,
        openGraph: {
            title: `${author}`,
            description: `${token.metadata.name}`,
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
        // other: {
        //     ...fcMetadata,
        //     ...mintableMetadata
        // },
    };
}




const ExpandedPostSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 m-auto mt-0 w-full max-w-[65ch]">
            <div className="w-24 h-3 shimmer rounded-lg bg-base-100 pl-0 ml-0" />
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="flex flex-col gap-2">
                    <div className="w-36 h-5 shimmer rounded-lg bg-base-100" />
                    <div className="flex flex-row gap-2 items-center">
                        <div className="w-24 h-6 shimmer rounded-lg bg-base-100" />
                        <div className="ml-auto h-8 w-16 shimmer rounded-lg bg-base-100" />
                        <div className="h-8 w-16 shimmer rounded-lg bg-base-100" />
                    </div>
                    <div className="flex flex-col gap-2 prose mt-6">
                        <div className="w-full h-[325px] shimmer bg-base-100 rounded-lg m-auto" />

                    </div>
                </div>
            </div>
        </div>
    )
}


const Post = async ({ spaceName, contractId, postId, searchParams }: { spaceName: string, contractId: ContractID, postId: string, searchParams: { [key: string]: string | undefined } }) => {

    const [
        channel,
        token
    ] = await Promise.all([
        fetchChannel(contractId),
        fetchSingleTokenV2(contractId, postId)
    ])


    return (
        <div className="flex flex-col gap-2 m-auto mt-0 w-full">
            <Link href={`/${spaceName}/contest/${contractId}`} passHref>
                <Button variant="link" className="flex gap-2 items-center pl-0 ml-0">
                    <HiArrowNarrowLeft className="w-6 h-6" />
                    <p>Back</p>
                </Button>
            </Link>
            <MintTokenSwitch
                referral={searchParams.referral}
                contractAddress={channel.id}
                channel={channel}
                token={token}
                display="contest-expanded"
                backwardsNavUrl={``}
            />
        </div>
    )
}

const ChannelDetails = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {

    const channel = await fetchChannel(contractId)

    const space = await fetchSingleSpace(spaceName)

    return (
        <div className="flex flex-col gap-2 rounded-lg w-full">
            <h2 className="lg:text-xl text-xl font-[600] text-t1">
                {channel.name}
            </h2>
            <div className="flex flex-row gap-2 items-center">
                <Link
                    className="relative w-8 h-8 flex flex-col"
                    href={`/${space.name}`}
                    draggable={false}
                >
                    <OptimizedImage
                        src={space.logoUrl}
                        alt="Org Avatar"
                        fill
                        className="rounded-full object-cover"
                    />
                </Link>
                <Link
                    className="text-sm text-t2 hover:underline hover:text-t1"
                    href={`/${space.name}`}
                    draggable={false}
                >
                    {space.displayName}
                </Link>
            </div>
            <div className="h-0.5 bg-base-100 w-full" />
        </div>
    )
}


export default function Page({ params, searchParams }: { params: { name: string, contractId: ContractID, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (
        <div className="flex flex-row w-10/12 m-auto mt-4 lg:w-5/12 lg:m-0 lg:ml-auto lg:mt-0">
            {/* <ExpandedPostSkeleton /> */}
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <Post spaceName={params.name} contractId={params.contractId} postId={params.postId} searchParams={searchParams} />
            </Suspense>
        </div>
    )
}