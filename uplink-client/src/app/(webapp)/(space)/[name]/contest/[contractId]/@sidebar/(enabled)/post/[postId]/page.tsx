import { fetchFiniteChannelTokensV2 } from "@/lib/fetch/fetchTokensV2";
import { ContractID } from "@/types/channel";
import Link from "next/link";
import { Suspense } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";


const PostNavigation = async ({ spaceName, contractId, postId }: { spaceName: string, contractId: ContractID, postId: string }) => {

    const tokens = await fetchFiniteChannelTokensV2(contractId, 500, 0)

    const currentTokenIndex = tokens.data.findIndex(token => Number(token.tokenId) === Number(postId))

    const prevToken = tokens.data[currentTokenIndex - 1] || null
    const nextToken = tokens.data[currentTokenIndex + 1] || null

    return (
        <div className="flex flex-row w-full gap-2">
            {prevToken && (
                <Link href={`/${spaceName}/contest/${contractId}/post/${prevToken.tokenId}`} className="bg-base-200 hover:bg-base-100 rounded-lg p-2 flex flex-col gap-2 items-start w-full max-w-[50%]">
                    <div className="flex flex-row gap-2 items-center text-t2">
                        <HiArrowNarrowLeft className="w-6 h-6" />
                        <p>Previous post</p>
                    </div>
                    <p className="font-bold line-clamp-1">{prevToken.metadata.name}</p>
                </Link>
            )}
            {nextToken && (
                <Link href={`/${spaceName}/contest/${contractId}/post/${nextToken.tokenId}`} className="bg-base-200 hover:bg-base-100 rounded-lg p-2 flex flex-col gap-2 items-start ml-auto w-full max-w-[50%]">
                    <div className="flex flex-row gap-2 text-t2 mr-auto items-center">
                        <p>Next post</p>
                        <HiArrowNarrowRight className="w-6 h-6" />
                    </div>
                    <p className="font-bold line-clamp-1">{nextToken.metadata.name}</p>
                </Link>
            )}
        </div>

    )
}


export default function Page({ params }: { params: { name: string, postId: string, contractId: ContractID } }) {
    return (
        <Suspense fallback={<div className="flex flex-col gap-2 rounded-lg w-full"><p>loading</p></div>}>
            <PostNavigation spaceName={params.name} postId={params.postId} contractId={params.contractId} />
        </Suspense>
    )
}
