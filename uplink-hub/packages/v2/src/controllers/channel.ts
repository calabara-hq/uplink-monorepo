import { AuthorizationError, InvalidArgumentError, NotFoundError } from "../errors.js";
import { db, dbInsertChannel, dbIsUserSpaceAdmin, dbGetChannel, dbGetChannelsBySpaceName } from "../utils/database.js";
import { AuthorizationController } from "lib";

import { clientByChainId } from "../utils/transmissions.js";
import { getSupportedChains } from "../utils/constants.js";
import { parseV2Metadata, splitContractID } from "../utils/utils.js";

import { Request, Response, NextFunction } from 'express'
import { ContexedRequest } from "../types.js";

const authorizationController = new AuthorizationController(process.env.REDIS_URL!);

/// query db for channels associated with space
export const getSpaceChannels = async (req: Request, res: Response, next: NextFunction) => {
    const spaceName = req.query.spaceName as string

    try {

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

        res.send(channels).status(200)

    } catch (err) {
        next(err)
    }
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