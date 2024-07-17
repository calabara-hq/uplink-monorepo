import { AuthorizationError, InvalidArgumentError, NotFoundError } from "../errors.js";
import { db, dbInsertChannel, dbIsUserSpaceAdmin, dbGetChannel, dbGetChannelsBySpaceName } from "../utils/database.js";
import { AuthorizationController } from "lib";

import { clientByChainId } from "../utils/transmissions.js";
import { getSupportedChains } from "../utils/constants.js";
import { splitContractID } from "../utils/utils.js";

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

            const client = clientByChainId(chainId)
            if (!client) return []

            let chainChannels = await client.getAllChannels({ filters: { where: { id_in: channelIds } } })
            return chainChannels.map(channel => { return { ...channel, chainId } })

        })).then(data => data.flat())

        res.send(channels).status(200)

    } catch (err) {
        next(err)
    }
}

export const getChannel = async (req: Request, res: Response, next: NextFunction) => {
    const contractId = req.query.contractId as string

    try {
        const { contractAddress, chainId } = splitContractID(contractId)
        const txClient = clientByChainId(chainId)

        const [dbChannel, txChannel] = await Promise.all([
            dbGetChannel(contractAddress, chainId),
            txClient.getChannel({ channelAddress: contractAddress })
        ])

        console.log("db channel for contractid", contractId, "is", dbChannel)

        if (!dbChannel) throw new NotFoundError('Channel not found')

        const response = {
            ...txChannel,
            chainId
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