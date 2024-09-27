import fetchSingleSpace from "@/lib/fetch/fetchSingleSpace"
import BoardForm from "./client";
import { Suspense } from "react";
import fetchChannel from "@/lib/fetch/fetchChannel";
import { Address, formatEther, zeroAddress } from "viem";
import { MintBoardSettingsInput } from "@/hooks/useMintboardSettings";
import { parseErc20MintPrice } from "@/lib/tokenHelpers";
import { parseIpfsUrl } from "@/lib/ipfs";
import { IInfiniteTransportConfig } from "@tx-kit/sdk/subgraph"
import { ContractID, splitContractID } from "@/types/channel";

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

const parseSaleDurationToReadableString = (value: number): string => {
    if (value === 259200) return "3 days";
    if (value === 604800) return "week";
    else return "forever";
}

const PageContent = async ({ spaceName, contractId }: { spaceName: string, contractId: ContractID }) => {

    const { contractAddress, chainId } = splitContractID(contractId)
    const space_promise = fetchSingleSpace(spaceName).catch(() => { return null });
    const channel_promise = fetchChannel(contractId)

    const [space, channel] = await Promise.all([space_promise, channel_promise])

    const initialErc20Price = channel.fees ? await parseErc20MintPrice(
        channel.fees.fees.erc20Contract,
        BigInt(channel.fees.fees.erc20MintPrice),
        chainId
    ).then(res => res.humanReadable) : "0"


    const priorState: MintBoardSettingsInput = {
        title: channel.tokens[0].metadata.name,
        description: channel.tokens[0].metadata.description,
        imageURI: channel.tokens[0].metadata.image,
        chainId: chainId as MintBoardSettingsInput["chainId"],
        saleDuration: parseSaleDurationToReadableString(Number((channel.transportLayer.transportConfig as IInfiniteTransportConfig).saleDuration)),
        feeContract: channel.fees ? "CUSTOM_FEES_ADDRESS" : zeroAddress,
        channelTreasury: channel.fees ? channel.fees.fees.channelTreasury : "",
        uplinkPercentage: channel.fees ? channel.fees.fees.uplinkPercentage.toString() : "",
        channelPercentage: channel.fees ? channel.fees.fees.channelPercentage.toString() : "",
        creatorPercentage: channel.fees ? channel.fees.fees.creatorPercentage.toString() : "",
        mintReferralPercentage: channel.fees ? channel.fees.fees.mintReferralPercentage.toString() : "",
        sponsorPercentage: channel.fees ? channel.fees.fees.sponsorPercentage.toString() : "",
        ethMintPrice: channel.fees ? formatEther(channel.fees.fees.ethMintPrice) : "0",
        erc20Contract: channel.fees ? channel.fees.fees.erc20Contract : zeroAddress,
        erc20MintPrice: initialErc20Price,
    }

    return <BoardForm spaceId={space.id} priorState={priorState} spaceData={space} contractId={contractId} />
}

export default async function Page({ params }: { params: { name: string, contractId: ContractID } }) {

    return (
        <div className=" w-full md:w-10/12 lg:w-8/12 xl:w-5/12 m-auto mt-4 mb-16 bg-base">
            <div className="flex flex-col w-full px-2 pt-2 pb-6 rounded-lg justify-center items-center">
                <Suspense fallback={<LoadingDialog />}>
                    <PageContent spaceName={params.name} contractId={params.contractId} />
                </Suspense>
            </div>
        </div>
    )
}