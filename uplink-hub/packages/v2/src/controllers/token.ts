import { AuthorizationError, NotFoundError, TransactionRevertedError } from "../errors.js";
import {
    dbBanTokenIntent,
    dbBanTokenV2,
    dbFulfillTokenIntent,
    dbGetChannelTokenIntents,
    dbGetV1TokensByChannelAddress,
    dbInsertTokenIntent,
    dbIsUserSpaceAdmin,
    prepared_bannedTokensV2,
    dbGetChannel,
    dbGetSpaceByChannelAddress
} from "../utils/database.js";
import { AuthorizationController, schema } from "lib";
import { Request, Response, NextFunction } from 'express'
import { clientByChainId } from "../utils/transmissions.js";
import { parseIntentMetadata, parseV1Metadata, parseV2Metadata, splitContractID } from "../utils/utils.js";
import { ContexedRequest, FiniteTokenPage, IntentTokenPage, V1TokenPage, V1TokenWithMetadata, V2TokenPage, V2TokenWithMetadata } from "../types.js";
import { decodeEventLog, Hash, Hex, Log } from "viem";
import { finiteChannelAbi, infiniteChannelAbi } from "@tx-kit/sdk/abi";
import { createWeb3Client } from "../utils/viem.js";
import { gql } from '@urql/core'
import { CHANNEL_FRAGMENT, TRANSPORT_LAYER_FRAGMENT, FEE_CONFIG_FRAGMENT, TOKEN_FRAGMENT, formatGqlTokens, formatGqlChannel, IFiniteTransportConfig } from "@tx-kit/sdk/subgraph"

const authorizationController = new AuthorizationController(process.env.REDIS_URL);


/* -------------------------------------------------------------------------- */
/*                                  TOKENS V1                                 */
/* -------------------------------------------------------------------------- */

export const getChannelTokensV1 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = req.query.pageSize as string
    const skip = req.query.skip as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const v1Tokens = await dbGetV1TokensByChannelAddress({
            channelAddress: contractAddress,
            chainId,
            orderByMints: false,
            limit: parseInt(pageSize) + 1,
            offset: parseInt(skip)
        })

        const pageData = v1Tokens.slice(0, parseInt(pageSize))
        const resolvedTokens = pageData.map(parseV1Metadata)

        const response: V1TokenPage = {
            data: resolvedTokens,
            pageInfo: {
                endCursor: pageData.length,
                hasNextPage: v1Tokens.length > parseInt(pageSize)
            }
        }

        res.send(response).status(200)

    } catch (err) {
        next(err)
    }
}

export const getSingleTokenV1 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const postId = req.query.postId as string

    console.log("post ID", postId)

    try {
        const { chainId, contractAddress } = splitContractID(contractId)

        const token = await dbGetV1TokensByChannelAddress({
            channelAddress: contractAddress,
            chainId,
            orderByMints: false,
        }).then(data => data.filter(data => data.id.toString() === postId)).then(data => data[0]).then(parseV1Metadata)

        res.send(token).status(200)

    } catch (err) {
        console.log(err)
        next(err)
    }
}

/* -------------------------------------------------------------------------- */
/*                                  TOKENS V2                                 */
/* -------------------------------------------------------------------------- */

export const getFiniteChannelTokensV2 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = Number(req.query.pageSize)
    const skip = Number(req.query.skip)

    // in finite mode, we order by totalMinted and add a field 'isWinner' to the response

    try {

        const { chainId, contractAddress } = splitContractID(contractId)
        const { downlinkClient } = clientByChainId(chainId)

        const bannedTokens = await prepared_bannedTokensV2
            .execute({ channelAddress: contractAddress, chainId: chainId })
            .then(data => data.map(data => data.tokenId))

        const ignoredTokens = ["0", ...bannedTokens]

        const data = await downlinkClient.customQuery(
            gql`
                query($channelAddress: String!, $ignoredTokens: [String!]! $pageSize: Int!, $skip: Int!) {
                    channel(id: $channelAddress) {
                        ...ChannelFragment
                            transportLayer {
                                ...TransportLayerFragment
                            }
                        tokens(
                            where: { tokenId_not_in: $ignoredTokens }
                            orderBy: totalMinted,
                            orderDirection:desc, 
                            first: $pageSize, skip: $skip
                            
                        ) {
                        ...TokenFragment
                    }
                    }
                }
                ${CHANNEL_FRAGMENT}
                ${TRANSPORT_LAYER_FRAGMENT}
                ${TOKEN_FRAGMENT}
            `,
            { channelAddress: contractAddress.toLowerCase(), ignoredTokens, pageSize: pageSize + 1, skip })


        const channel = formatGqlChannel(data.channel)

        const pageData = channel.tokens.slice(0, pageSize)
        const resolvedTokens = await Promise.all(pageData.map(parseV2Metadata))
        const transportConfig = channel.transportLayer.transportConfig as IFiniteTransportConfig


        const ranks = transportConfig.ranks
        const rankedTokens = resolvedTokens.map(token => ({ ...token, isWinner: false }))

        const now = Math.floor(Date.now() / 1000);

        // only set winners if the minting period has ended
        if (Number(transportConfig.mintEnd) < now) {
            for (let i = 0; i < ranks.length; i++) {
                let rank = ranks[i];

                // Adjust the rank to match the current page's context
                const adjustedRank = rank - skip - 1;

                // Ensure the adjusted rank falls within the current page's range
                if (adjustedRank >= 0 && adjustedRank < pageSize && rankedTokens[adjustedRank]) {
                    rankedTokens[adjustedRank].isWinner = true;
                }
            }

        }

        const response: FiniteTokenPage = {
            data: rankedTokens,
            pageInfo: {
                endCursor: pageData.length,
                hasNextPage: data.channel.tokens.length > pageSize
            }
        }

        res.send(response).status(200)

    } catch (err) {
        next(err)
    }
}


export const getChannelTokensV2 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = req.query.pageSize as string
    const skip = req.query.skip as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const { downlinkClient } = clientByChainId(chainId)

        const bannedTokens = await prepared_bannedTokensV2
            .execute({ channelAddress: contractAddress, chainId: chainId })
            .then(data => data.map(data => data.tokenId))


        const onchainTokens = await downlinkClient.getChannelTokenPage({
            channelAddress: contractAddress,
            filters: {
                pageSize: parseInt(pageSize) + 1,
                skip: parseInt(skip),
                where: {
                    tokenId_not_in: ["0", ...bannedTokens]
                }
            }
        })

        const pageData = onchainTokens.slice(0, parseInt(pageSize))
        const resolvedTokens = await Promise.all(pageData.map(parseV2Metadata))

        const response: V2TokenPage = {
            data: resolvedTokens,
            pageInfo: {
                endCursor: pageData.length,
                hasNextPage: onchainTokens.length > parseInt(pageSize)
            }
        }

        res.send(response).status(200)

    } catch (err) {
        next(err)
    }
}

export const getFeaturedMints = async (req: Request, res: Response, next: NextFunction) => {

    const chainId = Number(req.query.chainId)
    const pageSize = Number(req.query.pageSize)
    const skip = Number(req.query.skip)

    try {

        const { downlinkClient } = clientByChainId(chainId)

        const data = await downlinkClient.customQuery(
            gql`
                query($pageSize: Int!, $skip: Int!) {
                    tokens(
                        orderBy: totalMinted,
                        orderDirection:desc, 
                        first: $pageSize, skip: $skip
                        where: {channel_: {id_not_in:  ["0xa4bc695f857239a0f26c289fee4c936689a0ddad", "0x00c58936afb2b89d6dd8b918c5a44aa1b0a4fdf8"]}}
                        ) {
                        ...TokenFragment
                        channel {
                            ...ChannelFragment
                            transportLayer {
                                ...TransportLayerFragment
                            }
                            fees { 
                                ...FeeConfigFragment 
                            }
                        }
                    }
                }
                ${CHANNEL_FRAGMENT}
                ${TRANSPORT_LAYER_FRAGMENT}
                ${FEE_CONFIG_FRAGMENT}
                ${TOKEN_FRAGMENT}
                `,

            { pageSize: pageSize + 20, skip }) // account for banned / empty channels

        const sliced = data.tokens.slice(0, pageSize)

        const formatted = await Promise.all(sliced.map(async (token: any) => {
            const { channel } = token

            const [parsedToken, space] = await Promise.all([
                parseV2Metadata(formatGqlTokens([token])[0]),
                dbGetSpaceByChannelAddress(channel.id)
            ])


            return {
                token: parsedToken,
                channel: formatGqlChannel(channel),
                space
            }
        }))


        const response: V2TokenPage = {
            data: formatted.filter(data => data.space),
            pageInfo: {
                endCursor: sliced.length,
                hasNextPage: data.length > pageSize
            }
        }

        res.send(response).status(200)

    } catch (err) {
        console.log(err)
        next(err)
    }
}


export const getSingleTokenV2 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const postId = req.query.postId as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const { downlinkClient } = clientByChainId(chainId)

        const onchainToken = await downlinkClient.getChannelTokenPage({
            channelAddress: contractAddress,
            filters: {
                pageSize: 1,
                skip: 0,
                where: {
                    tokenId_in: [postId]
                }
            }
        }).then(data => data[0]).then(parseV2Metadata)

        res.send(onchainToken).status(200)

    } catch (err) {
        next(err)
    }
}


// get popular tokens should return a mix of onchainV2 and onchainV1 tokens

export const getChannelPopularTokens = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = req.query.pageSize as string
    const skip = req.query.skip as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const { downlinkClient } = clientByChainId(chainId)

        const bannedTokens = await prepared_bannedTokensV2
            .execute({ channelAddress: contractAddress, chainId: chainId })
            .then(data => data.map(data => data.tokenId))

        const onchainTokensV2_promise = downlinkClient.getChannelTokenPage({
            channelAddress: contractAddress,
            filters: {
                pageSize: parseInt(pageSize) + 1,
                skip: parseInt(skip),
                orderBy: "totalMinted",
                orderDirection: "desc",
                where: {
                    tokenId_not_in: ["0", ...bannedTokens],
                    totalMinted_gt: 0
                }
            }
        }).then(async (data) => {
            return Promise.all(data.map(parseV2Metadata))
        })


        const onchainTokensV1_promise = dbGetV1TokensByChannelAddress({
            channelAddress: contractAddress,
            chainId,
            orderByMints: true,
            limit: parseInt(pageSize),
            offset: parseInt(skip)
        }).then(data => data.map(parseV1Metadata))


        const [onchainTokensV1, onchainTokensV2] = await Promise.all([onchainTokensV1_promise, onchainTokensV2_promise])
        const list: Array<V1TokenWithMetadata | V2TokenWithMetadata> = [...onchainTokensV1, ...onchainTokensV2].sort((a, b) => Number(b.totalMinted) - Number(a.totalMinted)).slice(0, parseInt(pageSize))

        const response = {
            data: list,
            pageInfo: {
                endCursor: list.length,
                hasNextPage: false
            }
        }

        res.send(response).status(200)

    } catch (err) {
        console.log(err)
        next(err)
    }

}

export const banTokenV2 = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    const contractId = req.body.contractId as string
    const tokenId = req.body.tokenId as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const channel_promise = dbGetChannel(contractAddress, chainId)
        const user_promise = authorizationController.getUser(req.context)

        const [channel, user] = await Promise.all([channel_promise, user_promise])

        if (!user) throw new AuthorizationError('UNAUTHORIZED')

        const isAdmin = await dbIsUserSpaceAdmin(user, channel.spaceId);
        if (!isAdmin) throw new AuthorizationError('UNAUTHORIZED')

        await dbBanTokenV2({
            channelAddress: contractAddress,
            tokenId,
            chainId: chainId
        })

        res.send({ success: true }).status(200)

    } catch (err) {
        next(err)
    }

}



/* -------------------------------------------------------------------------- */
/*                                  TOKEN INTENTS                             */
/* -------------------------------------------------------------------------- */

export const getChannelTokenIntents = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = req.query.pageSize as string
    const skip = req.query.skip as string

    try {
        const { chainId, contractAddress } = splitContractID(contractId)

        const tokenIntents = await dbGetChannelTokenIntents({
            channelAddress: contractAddress,
            chainId: chainId,
            onlyActive: true,
            includeBanned: false,
            includeFulfilled: false,
            findMany: {
                limit: parseInt(pageSize) + 1,
                skip: parseInt(skip)
            }
        })


        const pageData = tokenIntents.slice(0, parseInt(pageSize))

        const resolvedTokens = await Promise.all(pageData.map(parseIntentMetadata))

        const response: IntentTokenPage = {
            data: resolvedTokens,
            pageInfo: {
                endCursor: pageData.length,
                hasNextPage: tokenIntents.length > parseInt(pageSize)
            }
        }

        res.send(response).status(200)

    } catch (err) {
        next(err)
    }

}


export const getSingleTokenIntent = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const postId = req.query.postId as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const tokenIntent = await dbGetChannelTokenIntents({
            channelAddress: contractAddress,
            chainId: chainId,
            onlyActive: false,
            includeFulfilled: true,
            includeBanned: false,
            findFirst: {
                id: parseInt(postId)
            }
        }).then(data => data[0]).then(async data => { return parseIntentMetadata(data) })

        if (!tokenIntent) throw new NotFoundError('Token intent not found')

        if (tokenIntent && tokenIntent.tokenId !== "0") {
            /// this is already onchain. get the token and send it back
            const { downlinkClient } = clientByChainId(chainId)
            const onchainToken = await downlinkClient.getChannelTokenPage({
                channelAddress: contractAddress,
                filters: {
                    pageSize: 1,
                    skip: 0,
                    where: {
                        tokenId_in: [tokenIntent.tokenId]
                    }
                }
            }).then(data => data[0]).then(parseV2Metadata)

            return res.send(onchainToken).status(200)

        }

        /// this is not onchain. send the intent back
        return res.send(tokenIntent).status(200)

    } catch (err) {
        next(err)
    }
}

export const insertChannelTokenIntent = async (req: Request, res: Response, next: NextFunction) => {
    const contractId = req.body.contractId as string
    const tokenIntent = req.body.tokenIntent

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        // const user = await authorizationController.getUser(req.context)
        // if (!user) throw new AuthorizationError('UNAUTHORIZED')

        const channel = await dbGetChannel(contractAddress, chainId)
        if (!channel) throw new NotFoundError('Channel not found')

        const intentId = await dbInsertTokenIntent({
            spaceId: channel.spaceId,
            author: tokenIntent.author,
            channelId: channel.id,
            chainId: channel.chainId,
            channelAddress: channel.channelAddress,
            tokenIntent: JSON.stringify(tokenIntent),
            deadline: tokenIntent.intent.message.deadline
        })
        res.send({ success: true, id: intentId }).status(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
}


// export const insertChannelTokenIntent = async (req: ContexedRequest, res: Response, next: NextFunction) => {

//     const contractId = req.body.contractId as string
//     const tokenIntent = req.body.tokenIntent

//     try {

//         const { chainId, contractAddress } = splitContractID(contractId)

//         const user = await authorizationController.getUser(req.context)
//         if (!user) throw new AuthorizationError('UNAUTHORIZED')

//         const channel = await dbGetChannel(contractAddress, chainId)
//         if (!channel) throw new NotFoundError('Channel not found')

//         await dbInsertTokenIntent({
//             spaceId: channel.spaceId,
//             author: user.address,
//             channelId: channel.id,
//             chainId: channel.chainId,
//             channelAddress: channel.channelAddress,
//             tokenIntent: JSON.stringify(tokenIntent),
//             deadline: tokenIntent.intent.message.deadline
//         })
//         res.send({ success: true }).status(200)
//     } catch (err) {
//         console.log(err)
//         next(err)
//     }

// }


export const fulfillChannelTokenIntent = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    const contractId = req.body.contractId as string
    const tokenIntentId = req.body.tokenIntentId as string
    const txHash = req.body.txHash as Hash

    try {
        const { chainId, contractAddress } = splitContractID(contractId)

        // get the logs from the txHash

        const { uplinkClient } = clientByChainId(chainId)
        const publicClient = createWeb3Client(chainId)

        const events = await uplinkClient.getTransactionEvents({
            txHash,
            eventTopics: uplinkClient.eventTopics.tokenMinted,
        })

        const event = events?.[0] as Log | undefined

        const block = await publicClient.getBlock({ blockHash: event.blockHash })

        /// revert if the event is older than 2 minutes
        if (Math.floor(Date.now() / 1000) - Number(block.timestamp) > 120) throw new TransactionRevertedError('Transaction failed')

        const decodedLog = event
            ? decodeEventLog({
                abi: [...infiniteChannelAbi, ...finiteChannelAbi],
                data: event.data,
                // @ts-expect-error
                topics: event.topics,
            })
            : undefined

        const tokenId: string | undefined =
            // @ts-expect-error
            decodedLog?.eventName === 'TokenMinted'
                // @ts-expect-error
                ? decodedLog.args.tokenIds[0].toString()
                : undefined

        if (!tokenId) throw new TransactionRevertedError('Transaction failed')

        await dbFulfillTokenIntent({ channelAddress: contractAddress, chainId, tokenIntentId, tokenId })
        res.send({ success: true }).status(200)
    } catch (err) {
        console.log(err)
        next(err)
    }
}


export const banTokenIntent = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    const contractId = req.body.contractId as string
    const tokenIntentId = req.body.tokenIntentId as string


    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const channel_promise = dbGetChannel(contractAddress, chainId)
        const user_promise = authorizationController.getUser(req.context)

        const [channel, user] = await Promise.all([channel_promise, user_promise])

        if (!user) throw new AuthorizationError('UNAUTHORIZED')

        const isAdmin = await dbIsUserSpaceAdmin(user, channel.spaceId);
        if (!isAdmin) throw new AuthorizationError('UNAUTHORIZED')

        await dbBanTokenIntent({
            channelAddress: channel.channelAddress,
            tokenIntentId,
            chainId: channel.chainId
        })
        res.send({ success: true }).status(200)
    } catch (err) {
        next(err)
    }
}

