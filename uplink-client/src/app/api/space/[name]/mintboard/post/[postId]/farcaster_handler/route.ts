import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from "next/og"
import fetchMintBoard from "@/lib/fetch/fetchMintBoard";
import { parseIpfsUrl } from "@/lib/ipfs";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { createPrivClient, createWeb3Client } from '@/lib/viem';
import { ZoraAbi } from '@/lib/abi/zoraEdition';


const HUB_URL = process.env['HUB_URL'] || "nemes.farcaster.xyz:2283"
const client = getSSLHubRpcClient(HUB_URL);
const { client: privClient, account } = createPrivClient();
const pubClient = createWeb3Client(8453);

export async function POST(req: NextRequest) {
    try {
        return NextResponse.json({ status: 400 })

    //     const name = req.nextUrl.pathname.split("/")[3];
    //     const postId = req.nextUrl.pathname.split("/")[6];
    //     const referrer: `0x${string}` = req.nextUrl.searchParams.get('referrer') as `0x${string}` || "0xa943e039B1Ce670873ccCd4024AB959082FC6Dd8";
    //     const mintBoard = await fetchMintBoard(name);
    //     const post = mintBoard.posts.find((post) => post.id === postId)
    //     //const previewImage = parseIpfsUrl(post.edition.imageURI).gateway;

    //     let validatedMessage: Message | undefined = undefined;
    //     let signer: `0x${string}` | undefined = undefined;
    //     try {
    //         const body = await req.json()
    //         /* @ts-ignore */
    //         const frameMessage = Message.decode(Buffer.from(body?.trustedData?.messageBytes || '', 'hex'));
    //         const result = await client.validateMessage(frameMessage);
    //         if (result.isOk() && result.value.valid) {
    //             validatedMessage = result.value.message;
    //             signer = '0x' + Buffer.from(result.value.message.signer).toString('hex')

    //         }
    //     } catch (e) {
    //         //return res.status(400).send(`Failed to validate message: ${e}`);
    //         console.log(e)
    //         return NextResponse.json({ status: 400 })
    //     }


    //     let userAddress: `0x${string}` | undefined = undefined;
    //     const fid = validatedMessage?.data?.fid || 0;
    //     const user = await fetch(`https://searchcaster.xyz/api/profiles?fid=${fid}`).then(res => res.json()).then(data => data[0])
    //     userAddress = user.connectedAddress


    //     // try {
    //     //     const balanceOf = await this.web3.readContract({
    //     //         address: post.edition.contractAddress,
    //     //         abi: ZoraAbi,
    //     //         functionName: 'balanceOf',
    //     //         args: [userAddress]
    //     //     });

    //     //     if (balanceOf > 0) {
    //     //         console.log('already minted!!!')
    //     //         return NextResponse.json({ status: 400 })
    //     //     }


    //     // } catch (err) {
    //     //     console.log(err)
    //     //     return NextResponse.json({ status: 400 })
    //     // }




    //     try {
    //         const { request } = await pubClient.simulateContract({
    //             chainId: 8453,
    //             address: post.edition.contractAddress as `0x${string}`,
    //             abi: ZoraAbi,
    //             functionName: 'mintWithRewards',
    //             args: [
    //                 userAddress,
    //                 BigInt(1),
    //                 "",
    //                 referrer
    //             ],
    //             account,
    //             value: BigInt(777000000000000)
    //         })

    //         await privClient.writeContract({ ...request, account })
    //     } catch (e) {
    //         console.log(e)
    //         return NextResponse.json({ status: 400 })
    //     }

    //     // return NextResponse.json({ revalidated: true, now: Date.now() })
    //     return new NextResponse(
    //         `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <title>Minted</title>
    //         <meta property="og:title" content="Mint Recorded">
    //         <meta name="fc:frame:image" content="https://uplink.mypinata.cloud/ipfs/QmXJLWLiS79vcRnExGogtpc8Sz3J4zJiHfSDrib9Kit1fh">
    //       </head>
    //       <body>
    //       <p>congrats, you just minted on the mintboard (:</p>
    //       </body>
    //     </html>
    //     `,
    //         { status: 200 }
    //     )
    } catch (e) {
        console.error(e)
        return NextResponse.json({ status: 500 })
    }
}