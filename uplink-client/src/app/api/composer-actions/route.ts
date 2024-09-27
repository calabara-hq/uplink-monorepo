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

export async function POST(
    req: NextRequest,
    res: NextResponse,
) {

    const data = req.body;

    return NextResponse.json({
        type: "form",
        title: "Create NFT",
        url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/mintboard/create-post`,
    });
}

export async function GET(
    req: NextRequest,
    res: NextResponse,
) {
    return NextResponse.json({
        "type": "composer",
        "name": "Create NFT",
        "icon": "code", // supported list: https://docs.farcaster.xyz/reference/actions/spec#valid-icons
        "description": "Create an NFT frame",
        "aboutUrl": "",
        "imageUrl": "",
        "action": {
            "type": "post",
        }
    });
}

// export async function POST(request: NextRequest) {

//     try {

//         const response = {
//             type: "form",
//             title: "Create NFT",
//             url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/mintboard-create`,
//         }
//         return NextResponse.json(response)

//     } catch (err) {
//         return new NextResponse('Invalid request', { status: 500 })
//         // if (err instanceof FrameError) {
//         //     return new NextResponse(err.message, { status: 500 })
//         // } else {
//         //     console.log(err)
//         //     return new NextResponse('Invalid request', { status: 500 })
//         // }
//     }
// }