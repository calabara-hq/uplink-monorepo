import { AuthorizationError, InvalidArgumentError, NotFoundError } from "../errors.js";
import { db, dbInsertChannel, dbIsUserSpaceAdmin, dbGetChannel, dbGetChannelsBySpaceName, dbGetSpaceByChannelAddress } from "../utils/database.js";
import { AuthorizationController } from "lib";

import { clientByChainId } from "../utils/transmissions.js";
import { getSupportedChains } from "../utils/constants.js";
import { parseV2Metadata, splitContractID } from "../utils/utils.js";

import { Request, Response, NextFunction } from 'express'
import { ContexedRequest } from "../types.js";
import { gql } from '@urql/core'
import { CHANNEL_FRAGMENT, formatGqlTokens, TOKEN_FRAGMENT } from "@tx-kit/sdk/subgraph";

const authorizationController = new AuthorizationController(process.env.REDIS_URL!);

/// query db for channels associated with space
// export const getSpaceChannels = async (req: Request, res: Response, next: NextFunction) => {
//     const spaceName = req.query.spaceName as string

//     try {

//         const dbChannelsResponse = await dbGetChannelsBySpaceName(spaceName)

//         const channelsByChainId = getSupportedChains().map(chainId => {
//             const channelIds = dbChannelsResponse.filter(channel => channel.chainId === chainId).map(channel => channel.channelAddress.toLowerCase())
//             return {
//                 chainId,
//                 channelIds
//             }
//         })

//         const channels = await Promise.all(channelsByChainId.map(async ({ chainId, channelIds }) => {

//             if (channelIds.length === 0) return []

//             const { downlinkClient } = clientByChainId(chainId)
//             if (!downlinkClient) return []

//             let chainChannels = await downlinkClient.getAllChannels({ filters: { where: { id_in: channelIds } } })

//             return chainChannels.map(channel => { return { ...channel, chainId } })

//         })).then(data => data.flat())


//         res.send(channels).status(200)

//     } catch (err) {
//         next(err)
//     }
// }


export const getSpaceChannels = async (spaceName: string) => {

    const dbChannelsResponse = await dbGetChannelsBySpaceName(spaceName)

    const channelsByChainId = getSupportedChains().map(chainId => {
        const channelIds = dbChannelsResponse.filter(channel => channel.chainId === chainId).map(channel => channel.channelAddress.toLowerCase())
        return {
            chainId,
            channelIds
        }
    })

    const channels = await Promise.all(channelsByChainId.map(async ({ chainId, channelIds }) => {

        if (channelIds.length === 0) return []

        const { downlinkClient } = clientByChainId(chainId)
        if (!downlinkClient) return []

        let chainChannels = await downlinkClient.getAllChannels({ filters: { where: { id_in: channelIds } } })

        return chainChannels.map(channel => { return { ...channel, chainId } })

    })).then(data => data.flat())

    return channels;

}


export const getChannelUpgradePath = async (req: Request, res: Response, next: NextFunction) => {
    const contractId = req.query.contractId as string

    try {
        const { contractAddress, chainId } = splitContractID(contractId)
        const { downlinkClient } = clientByChainId(chainId)

        const channelUpgradePath = await downlinkClient.getOptimalUpgradePath({ address: contractAddress })

        res.send({ channelUpgradePath }).status(200)
    } catch (err) {
        next(err)
    }
}

export const getChannel = async (req: Request, res: Response, next: NextFunction) => {
    const contractId = req.query.contractId as string

    try {
        const { contractAddress, chainId } = splitContractID(contractId)
        const { downlinkClient } = clientByChainId(chainId)

        const [dbChannel, txChannel, channelUpgradePath] = await Promise.all([
            dbGetChannel(contractAddress, chainId),
            downlinkClient.getChannel({
                channelAddress: contractAddress,
                includeTokens: true,
            }).then(async channel => { return { ...channel, tokens: ([await parseV2Metadata(channel.tokens[0])]) } }), // todo move this to the subgraph api
            downlinkClient.getOptimalUpgradePath({ address: contractAddress })
        ])

        if (!dbChannel) throw new NotFoundError('Channel not found')

        const response = {
            ...txChannel,
            chainId,
            upgradePath: channelUpgradePath
        }

        res.send(response).status(200)
    } catch (err) {
        next(err)
    }
}



export const getTrendingChannels = async (req: Request, res: Response, next: NextFunction) => {
    const chainId = req.query.chainId as string

    try {
        const { downlinkClient } = clientByChainId(parseInt(chainId))

        const data = await downlinkClient.customQuery(
            gql`
                query($timestamp: Int!) {
                    channels(
                        where: {tokens_: {blockTimestamp_gt: $timestamp}, id_not_in: ["0xa4bc695f857239a0f26c289fee4c936689a0ddad", "0x00c58936afb2b89d6dd8b918c5a44aa1b0a4fdf8"]}
                        limit: 10
                        ) {
                        ...ChannelFragment
                        transportLayer {
                            type
                        }
                        tokens(first: 10) {
                            ...TokenFragment
                        }
                    }   
                    ${TOKEN_FRAGMENT}
                    ${CHANNEL_FRAGMENT}
                }`,
            { timestamp: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7 }) // 1 week


        const response = await Promise.all(data.channels.map(async (channel: any) => {

            const [tokens, space] = await Promise.all([
                Promise.all(channel.tokens.map(async (token: any) => {
                    return parseV2Metadata(formatGqlTokens([token])[0])
                })),
                dbGetSpaceByChannelAddress(channel.id)
            ])

            return {
                ...channel,
                space,
                chainId,
                tokens
            }
        }))


        res.send(response.filter(data => data.space != undefined && data.tokens.length > 3)).status(200)
    } catch (err) {
        next(err)
    }
}

export const getActiveContests = async (req: Request, res: Response, next: NextFunction) => {
    const chainId = req.query.chainId as string

    try {
        const { downlinkClient } = clientByChainId(parseInt(chainId))

        const activeIDsList = await downlinkClient.customQuery(
            gql`
                query($currentTimestamp: Int!) {
                    finiteTransportConfigs(where: { mintEnd_gt: $currentTimestamp }) {
                        id
                    }
                }`,
            { currentTimestamp: Math.floor(Date.now() / 1000) }).then(data => data.finiteTransportConfigs.map(data => data.id))


        const activeChannels = await downlinkClient.customQuery(
            gql`
                    query($activeIDsList: [String!]!) {
                        channels(
                            where: { id_in: $activeIDsList}
                        )
                         {
                            id
                            tokens(first: 1) {
                                ...TokenFragment
                            }
                        }   
                        ${TOKEN_FRAGMENT}
                    }`,
            { activeIDsList })


        const response = await Promise.all(activeChannels.channels.map(async (channel: any) => {

            const [tokens, space] = await Promise.all([
                Promise.all(channel.tokens.map(async (token: any) => {
                    return parseV2Metadata(formatGqlTokens([token])[0])
                })),
                dbGetSpaceByChannelAddress(channel.id)
            ])

            return {
                ...channel,
                space,
                chainId,
                tokens
            }
        }))

        res.send(response.filter(data => data.space != undefined)).status(200)

    } catch (err) {
        next(err)
    }
}



/// insert new channel into db
export const insertSpaceChannel = async (req: ContexedRequest, res: Response, next: NextFunction) => {

    try {

        const user = await authorizationController.getUser(req.context)
        if (!user) throw new AuthorizationError('UNAUTHORIZED')

        const { spaceId, channelType, contractId } = req.body

        const { contractAddress, chainId } = splitContractID(contractId)

        const isAdmin = await dbIsUserSpaceAdmin(user, spaceId);
        if (!isAdmin) throw new AuthorizationError('UNAUTHORIZED')


        await dbInsertChannel(spaceId, contractAddress, chainId, channelType)
        res.send({ success: true }).status(200)
    } catch (err) {
        next(err)
    }
}