import { AuthorizationError, NotFoundError } from "../errors.js";
import {
    dbBanTokenIntent,
    dbBanTokenV2,
    dbFulfillTokenIntent,
    dbGetChannelTokenIntents,
    dbGetV1TokensByChannelAddress,
    dbInsertTokenIntent,
    dbIsUserSpaceAdmin,
    prepared_bannedTokensV2,
    dbGetChannel
} from "../utils/database.js";
import { AuthorizationController, schema } from "lib";
import { Request, Response, NextFunction } from 'express'
import { clientByChainId } from "../utils/transmissions.js";
import { parseIntentMetadata, parseV1Metadata, parseV2Metadata, splitContractID } from "../utils/utils.js";
import { ContexedRequest, IntentTokenPage, V1TokenPage, V1TokenWithMetadata, V2TokenPage, V2TokenWithMetadata } from "../types.js";

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

export const getChannelTokensV2 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const pageSize = req.query.pageSize as string
    const skip = req.query.skip as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const txClient = clientByChainId(chainId)

        const bannedTokens = await prepared_bannedTokensV2
            .execute({ channelAddress: contractAddress, chainId: chainId })
            .then(data => data.map(data => data.tokenId))


        const onchainTokens = await txClient.getChannelTokenPage({
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


export const getSingleTokenV2 = async (req: Request, res: Response, next: NextFunction) => {

    const contractId = req.query.contractId as string
    const postId = req.query.postId as string

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const txClient = clientByChainId(chainId)

        const onchainToken = await txClient.getChannelTokenPage({
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

        const txClient = clientByChainId(chainId)

        const bannedTokens = await prepared_bannedTokensV2
            .execute({ channelAddress: contractAddress, chainId: chainId })
            .then(data => data.map(data => data.tokenId))

        const onchainTokensV2_promise = txClient.getChannelTokenPage({
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
            const txClient = clientByChainId(chainId)
            const onchainToken = await txClient.getChannelTokenPage({
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


export const insertChannelTokenIntent = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    const contractId = req.body.contractId as string
    const tokenIntent = req.body.tokenIntent

    try {

        const { chainId, contractAddress } = splitContractID(contractId)

        const user = await authorizationController.getUser(req.context)
        if (!user) throw new AuthorizationError('UNAUTHORIZED')

        const channel = await dbGetChannel(contractAddress, chainId)
        if (!channel) throw new NotFoundError('Channel not found')

        await dbInsertTokenIntent({
            spaceId: channel.spaceId,
            author: user.address,
            channelId: channel.id,
            chainId: channel.chainId,
            channelAddress: channel.channelAddress,
            tokenIntent: JSON.stringify(tokenIntent),
            deadline: tokenIntent.intent.message.deadline
        })
        res.send({ success: true }).status(200)
    } catch (err) {
        next(err)
    }

}


export const fulfillChannelTokenIntent = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    const contractId = req.body.contractId as string
    const tokenIntentId = req.body.tokenIntentId as string
    const tokenId = req.body.tokenId as string

    /// todo use tokenId to check if token was actually sponsored

    try {
        const { chainId, contractAddress } = splitContractID(contractId)

        const user = await authorizationController.getUser(req.context)
        if (!user) throw new AuthorizationError('UNAUTHORIZED')

        await dbFulfillTokenIntent({ channelAddress: contractAddress, chainId, tokenIntentId, tokenId })
        res.send({ success: true }).status(200)
    } catch (err) {
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

