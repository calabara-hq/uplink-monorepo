import { createWeb3Client } from "@/lib/viem";
import { ContractID, splitContractID } from "@/types/channel";
import { getFrameMessage, getFrameHtmlResponse } from "@/lib/farcaster/utils";
import { FrameRequest } from "@/lib/farcaster/types";
import { NextRequest, NextResponse } from "next/server";
import { Hash } from "viem";

class FrameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FrameError';
    }
}

export async function POST(request: NextRequest) {

    try {

        const queryParams = request.nextUrl.searchParams;
        const spaceName = queryParams.get('spaceName');
        const requestData: FrameRequest = await request.json();
        const contractId = request.nextUrl.pathname.split("/")[3] as ContractID;
        const { contractAddress, chainId } = splitContractID(contractId);
        const { isValid, message } = await getFrameMessage(requestData, { neynarApiKey: process.env.NEYNAR_API_KEY });

        if (!isValid) {
            throw new FrameError('Invalid frame request');
        }


        const explorer = chainId === 8453 ? 'https://basescan.org' : 'https://sepolia.basescan.org';

        const txHash = message.transaction.hash as Hash;

        const publicClient = createWeb3Client(chainId);

        const transaction = await publicClient.waitForTransactionReceipt({ hash: txHash })

        if (transaction.status === 'success') {
            return new NextResponse(
                getFrameHtmlResponse({
                    buttons: [
                        {
                            action: 'link',
                            label: 'Go to mintboard',
                            target: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}` // todo fix this
                        },
                        {
                            action: 'link',
                            label: 'View transaction',
                            target: `${explorer}/tx/${txHash}` // todo fix this
                        }

                    ],
                    image: "https://uplink.mypinata.cloud/ipfs/QmQCKPZu1FUV3aLQz2K2dGdsTT3DjJhJabYNE5UUULaw33",
                })
            )
        }


    } catch (err) {
        if (err instanceof FrameError) {
            return new NextResponse(err.message, { status: 500 })
        } else {
            console.log(err)
            return new NextResponse('Invalid request', { status: 500 })
        }
    }

}