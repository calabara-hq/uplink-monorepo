import { parseIpfsUrl } from "@/lib/ipfs";
import { UserAvatar, UsernameDisplay } from "@/ui/AddressDisplay/AddressDisplay";
import { ImageWrapper } from "@/ui/Submission/MediaWrapper";
import { RenderStandardVideoWithLoader } from "@/ui/VideoPlayer";
import { Suspense } from "react";
import { BackButton, HeaderButtons } from "./client";
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { MintBoardPost } from "@/types/mintBoard";
import UplinkImage from "@/lib/UplinkImage"
import { Metadata } from "next";

export async function generateMetadata({
    params,
    searchParams
}: {
    params: { name: string, postId: string };
    searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {

    const mintboard = await fetchMintBoard(params.name);
    const post = mintboard.posts.find(el => el.id === params.postId)
    const author = post.author.displayName || post.author.address
    const referrer = searchParams?.referrer ?? null

    const nftMetadata: Record<string, string> = {
        "eth:nft:contract_address": post.edition.contractAddress,
        "eth:nft:schema": "ERC721",
        "eth:nft:collection": post.edition.name,
        "eth:nft:creator_address": post.edition.defaultAdmin,
        "eth:nft:media_url": parseIpfsUrl(post.edition.imageURI).gateway,
        "eth:nft:mint_count": post.totalMints.toString()
    }

    const fcMetadata: Record<string, string> = {
        // "fc:frame": "vNext",
        // "fc:frame:post_url": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/space/${params.name}/mintboard/post/${params.postId}/farcaster_handler?referrer=${referrer}`,
        "fc:frame:image": `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/space/${params.name}/mintboard/post/${params.postId}/post_metadata`,
        // "fc:frame:button:1": "Mint"
    };

    return {
        title: `${author}`,
        description: `New mint from ${author}`,
        openGraph: {
            title: `${author}`,
            description: `New mint from ${author} on Uplink`,
            images: [
                {
                    url: `api/space/${params.name}/mintboard/post/${params.postId}/post_metadata`,
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
            ...nftMetadata
        }
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


const PostRenderer = ({ post }: { post: MintBoardPost }) => {
    const { id, edition, author } = post;
    const siteImageURI = parseIpfsUrl(edition.imageURI);
    const siteAnimationURI = parseIpfsUrl(edition.animationURI);


    return (
        <div className="space-y-4">
            <div className="w-full m-auto">

                {siteAnimationURI.gateway && (
                    <div>
                        <RenderStandardVideoWithLoader videoUrl={siteAnimationURI.gateway} posterUrl={siteImageURI.gateway} />
                    </div>
                )}

                {siteImageURI.gateway && !siteAnimationURI.gateway && (
                    <div>
                        <ImageWrapper>
                            <UplinkImage
                                src={siteImageURI.gateway}
                                draggable={false}
                                alt="submission image"
                                fill
                                sizes="40vw"
                                className="object-contain w-full h-full transition-transform duration-300 ease-in-out"
                            />
                        </ImageWrapper>
                    </div>
                )}
            </div>

        </div>
    );
};

const ExpandedPost = ({
    post,
    headerChildren,
}: {
    post: MintBoardPost;
    headerChildren?: React.ReactNode;
}) => {
    const { id, edition, author } = post;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-t1 font-[500]">{edition.name}</h2>
                <div className="flex flex-col sm:flex-row md:items-center">
                    <div className="flex gap-2 items-center">
                        <UserAvatar user={author} size={28} />
                        <h3 className="break-all italic text-sm text-t2 font-semibold">
                            <UsernameDisplay user={author} />
                        </h3>
                    </div>
                    {headerChildren}
                </div>
            </div>
            <div className="w-full h-0.5 bg-base-200" />
            <PostRenderer post={post} />
        </div>
    );
};


// extract this out so we can suspend it
const PageContent = async ({ spaceName, postId, referrer }: { spaceName: string, postId: string, referrer: string | null }) => {
    const mintBoard = await fetchMintBoard(spaceName);
    const post = mintBoard.posts.find((post) => post.id === postId);
    return <ExpandedPost post={post} headerChildren={
        <HeaderButtons spaceName={spaceName} post={post} referrer={referrer ?? mintBoard.referrer} />
    } />;
};

export default function Page({ params, searchParams }: { params: { name: string, postId: string }, searchParams: { [key: string]: string | undefined } }) {

    return (
        <div className="grid grid-cols-1 w-full gap-6 sm:w-10/12 md:w-9/12 lg:w-7/12 xl:w-5/12 m-auto h-full mt-4 p-4">
            <BackButton spaceName={params.name} />
            <Suspense fallback={<ExpandedPostSkeleton />}>
                <PageContent spaceName={params.name} postId={params.postId} referrer={searchParams?.referrer ?? null} />
            </Suspense>
        </div>
    );
}