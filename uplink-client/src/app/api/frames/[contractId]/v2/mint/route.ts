import { getFrameMessage } from "@/lib/farcaster/utils";
import { FrameRequest } from "@/lib/farcaster/types"; import { NextRequest, NextResponse } from "next/server";
import { Abi, isAddress, PublicClient } from "viem";
import { infiniteChannelAbi, finiteChannelAbi } from "@tx-kit/sdk/abi";
import { TransmissionsClient } from "@tx-kit/sdk";
import { fetchSingleTokenIntent, fetchSingleTokenV2 } from "@/lib/fetch/fetchTokensV2";
import { ChannelToken, ChannelTokenIntent, ContractID, doesChannelHaveFees, isTokenV2Onchain, splitContractID } from "@/types/channel";
import { createWeb3Client } from "@/lib/viem";
import fetchChannel from "@/lib/fetch/fetchChannel";


class FrameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FrameError';
    }
}


type EthSendTransactionAction = {
    chainId: string;
    method: "eth_sendTransaction";
    attribution?: boolean;
    params: {
        abi: Abi | [];
        to: string;
        value?: string;
        data?: string;
    }
}

export async function POST(request: NextRequest) {

    try {
        const requestData: FrameRequest = await request.json();
        const searchParams = request.nextUrl.searchParams;
        const intent = searchParams.get('intent');
        const postId = searchParams.get('postId');
        const referral = searchParams.get('referrer')

        if (!postId) {
            throw new FrameError('Missing postId')
        }

        const contractId = request.nextUrl.pathname.split("/")[3] as ContractID;

        const { contractAddress, chainId } = splitContractID(contractId);

        const mintReferral = referral && isAddress(referral) ? referral : "";

        const [{ isValid, message }, channel] = await Promise.all([
            getFrameMessage(requestData, { neynarApiKey: process.env.NEYNAR_API_KEY }),
            fetchChannel(contractId)
        ]);


        if (!isValid) {
            throw new FrameError('Invalid frame request');
        }

        if (!message.address) {
            throw new FrameError('Invalid address')
        }

        if (!channel) {
            throw new FrameError('Channel not found')
        }

        const mintPrice = doesChannelHaveFees(channel) ? BigInt(channel.fees.fees.ethMintPrice) : BigInt(0);

        const hubRequest = intent === 'true' ? () => fetchSingleTokenIntent(contractId, postId) : () => fetchSingleTokenV2(contractId, postId);
        const token = await hubRequest();

        if (!token) {
            throw new FrameError('Token not found')
        }

        const { uplinkClient } = new TransmissionsClient({
            chainId: chainId,
            publicClient: createWeb3Client(chainId) as PublicClient
        })

        const generateCalldata = async (token: ChannelToken | ChannelTokenIntent) => {
            if (isTokenV2Onchain(token)) {
                return uplinkClient.callData.mintTokenBatchWithETH({
                    channelAddress: contractAddress,
                    to: message.address,
                    tokenIds: [BigInt((token as ChannelToken).tokenId)],
                    amounts: [1],
                    mintReferral,
                    data: "",
                    transactionOverrides: {
                        value: mintPrice
                    }
                })
            } else {
                return uplinkClient.callData.sponsorWithETH({
                    channelAddress: contractAddress,
                    sponsoredToken: token as ChannelTokenIntent,
                    to: message.address,
                    amount: 1,
                    mintReferral,
                    data: "",
                    transactionOverrides: {
                        value: mintPrice
                    }
                })
            }

        }


        const calldata = await generateCalldata(token);


        const response: EthSendTransactionAction = {
            chainId: `eip155:${chainId.toString()}`,
            method: "eth_sendTransaction",
            params: {
                abi: [...finiteChannelAbi, ...infiniteChannelAbi],
                to: calldata.address,
                data: calldata.data,
                value: mintPrice.toString()
            }
        }

        return NextResponse.json(response)

    } catch (err) {
        if (err instanceof FrameError) {
            return new NextResponse(err.message, { status: 500 })
        } else {
            console.log(err)
            return new NextResponse('Invalid request', { status: 500 })
        }
    }
}