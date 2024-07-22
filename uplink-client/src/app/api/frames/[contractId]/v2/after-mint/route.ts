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

const updateServerIntent = async (contractId: ContractID, sponsoredTokenId: string, transactionHash: string) => {
    try {
        return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/fulfill_tokenIntent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": process.env.API_SECRET!,
            },
            body: JSON.stringify({
                contractId: contractId,
                tokenIntentId: sponsoredTokenId,
                txHash: transactionHash
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    return res
                }
            })
    } catch (e) {
        console.log(e)
        throw new FrameError('Failed to update server intent')
    }
}


export async function POST(request: NextRequest) {

    try {

        const searchParams = request.nextUrl.searchParams;
        const spaceName = searchParams.get('spaceName');
        const intent = searchParams.get('intent');
        const postId = searchParams.get('postId');
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

        // if it's an intent, we need to get the tokenId from the tx logs and send them to the server
        // otherwise just make sure the transaction went through
        const validateTransaction = async () => {
            if (intent === 'true') {
                const { success } = await updateServerIntent(contractId, postId, txHash);
                if (!success) {
                    throw new FrameError('Failed to update server intent')
                }
            } else {
                const transaction = await publicClient.waitForTransactionReceipt({ hash: txHash })
                if (transaction.status !== 'success') {
                    throw new FrameError('Transaction failed');
                }
            }
        }

        await validateTransaction();

        return new NextResponse(
            getFrameHtmlResponse({
                buttons: [
                    {
                        action: 'link',
                        label: 'Go to mintboard',
                        target: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${spaceName}/mintboard/${contractId}`
                    },
                    {
                        action: 'link',
                        label: 'View transaction',
                        target: `${explorer}/tx/${txHash}`
                    }

                ],
                image: "https://uplink.mypinata.cloud/ipfs/QmQCKPZu1FUV3aLQz2K2dGdsTT3DjJhJabYNE5UUULaw33",
            })
        )



    } catch (err) {
        if (err instanceof FrameError) {
            return new NextResponse(err.message, { status: 500 })
        } else {
            console.log(err)
            return new NextResponse('Invalid request', { status: 500 })
        }
    }

}