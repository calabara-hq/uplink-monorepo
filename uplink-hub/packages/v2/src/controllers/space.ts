import { Request, Response, NextFunction } from 'express'
import { createDbSpace, updateDbSpace, db, dbGetChannelsBySpaceName, dbIsUserSpaceAdmin, dbSingleSpaceByName, sqlOps } from '../utils/database.js'

import { clientByChainId } from '../utils/transmissions.js';
import { gql } from '@urql/core';
import { NATIVE_TOKEN } from '@tx-kit/sdk';
import { checksumAddress, parseEther } from 'viem';
import { getSpaceChannels } from './channel.js';
import { getMultiV1ContestsBySpaceId } from './contest_v1.js';
import { ContexedRequest, isFiniteChannel, isInfiniteChannel, MutateSpaceData } from '../types.js';
import { validateSpaceAdmins, validateSpaceLogo, validateSpaceName, validateSpaceWebsite } from '../utils/validate.js';
import { AuthorizationController } from 'lib';
import { AuthorizationError } from '../errors.js';

const authorizationController = new AuthorizationController(process.env.REDIS_URL!);


const manySpaces = db.query.spaces.findMany({
  with: {
    admins: true,
    spaceTokens: {
      with: {
        token: true
      }
    }
  },
  orderBy: (spaces) => [sqlOps.asc(spaces.name)],

}).prepare();


export const dbGetV1TokenStatsBySpaceName = async (spaceName: string): Promise<Array<any>> => {

  return db.execute(sqlOps.sql`
        SELECT 
        token.id,
        token.author,
        token.totalMinted,
        token.contractAddress,
        token.chainId
        FROM spaces s
        JOIN contests c ON s.id = c.spaceId
        JOIN submissions sb ON c.id = sb.contestId
        JOIN submissionDrops sd ON sb.id = sd.submissionId
        JOIN zoraTokens token ON sd.editionId = token.id
        WHERE s.name = ${spaceName}

        UNION

        SELECT
        token.id,
        token.author,
        token.totalMinted,
        token.contractAddress,
        token.chainId
        FROM spaces s
        JOIN mintBoards mb ON s.id = mb.spaceId
        JOIN mintBoardPosts mbp ON mb.id = mbp.boardId
        JOIN zoraTokens token ON mbp.editionId = token.id
        WHERE s.name = ${spaceName}


    `)
    .then((data: any) => data.rows)
  //.then(calculateTotalMints)
}


export const getV2Mints = async (
  contracts: Array<string>,
  chainId: number
): Promise<Array<any>> => {
  const { downlinkClient } = clientByChainId(chainId);

  const pageSize = 200;
  let skip = 0;
  let allResults: Array<any> = [];

  while (true) {
    const data = await downlinkClient.customQuery(
      gql`
          query($channels: [String!]!, $pageSize: Int!, $skip: Int!) {
            mints(
              where: { channel_in: $channels }
              first: $pageSize
              skip: $skip
            ) {
              id
              amount
            }
          }
        `,
      { channels: contracts, pageSize, skip }
    );

    const results = data.mints;
    allResults = allResults.concat(results);

    if (results.length < pageSize) {
      // No more data to fetch
      break;
    }

    // Increment skip to fetch the next page
    skip += pageSize;
  }

  return allResults;
};


export const getV2Transfers = async (
  contracts: Array<string>,
  chainId: number
): Promise<Array<any>> => {
  const { downlinkClient } = clientByChainId(chainId);

  const pageSize = 200;
  let skip = 0;
  let allResults: Array<any> = [];

  while (true) {
    const data = await downlinkClient.customQuery(
      gql`
          query($channels: [String!]!, $pageSize: Int!, $skip: Int!) {
            rewardTransferEvents(
              where: { channel_in: $channels }
              first: $pageSize
              skip: $skip
            ) {
              id
              from {
                id
              }
              to {
                id
              }
              token
              amount
            }
          }
        `,
      { channels: contracts, pageSize, skip }
    );

    const results = data.rewardTransferEvents;
    allResults = allResults.concat(results);

    if (results.length < pageSize) {
      // No more data to fetch
      break;
    }

    // Increment skip to fetch the next page
    skip += pageSize;
  }

  return allResults;
};



export const getSpaceStats = async (req: Request, res: Response, next: NextFunction) => {
  const chainId = req.query.chainId as string
  const spaceName = req.query.spaceName as string

  try {

    let mintsMap: { [key: string]: number | bigint } = {
      totalMints: 0,
    }

    // space minting stats are derived from 2 sources:
    // v1 editions
    // v2 channel data

    // 1. Get space statistics from v1 editions

    const [tokens, dbChannelsResponse] = await Promise.all([
      dbGetV1TokenStatsBySpaceName(spaceName), // Assuming the correct return type
      dbGetChannelsBySpaceName(spaceName)
    ]);

    mintsMap.totalMints += tokens.reduce((acc: number, token: any) => acc + token.totalMinted, 0); // Accumulate total mints
    mintsMap[NATIVE_TOKEN] = BigInt(mintsMap.totalMints) * parseEther('0.000777') // Store total mints in mintsMap

    const channelIds = dbChannelsResponse.map(channel => channel.channelAddress.toLowerCase())

    const [v2Mints, v2Transfers] = await Promise.all([
      getV2Mints(channelIds, parseInt(chainId)),
      getV2Transfers(channelIds, parseInt(chainId))
    ]);

    mintsMap.totalMints += v2Mints.reduce((acc: number, mint: any) => acc + Number(mint.amount), 0);

    v2Transfers.forEach((transfer: any) => {
      mintsMap[checksumAddress(transfer.token)] = ((mintsMap[checksumAddress(transfer.token)] || BigInt(0)) as bigint) + BigInt(transfer.amount);
    })

    res.send(mintsMap).status(200);

  } catch (err) {
    next(err)
  }
}

export const getChannelsBySpaceName = async (req: Request, res: Response, next: NextFunction) => {
  const spaceName = req.query.spaceName as string
  const chainId = req.query.chainId as string

  try {

    const [space, channels] = await Promise.all([
      dbSingleSpaceByName(spaceName),
      getSpaceChannels(spaceName)
    ]);

    if (!space) {
      return res.send({
        finiteChannels: [],
        infiniteChannels: [],
        legacyContests: []
      }).status(200);
    }

    const contestsV1 = await getMultiV1ContestsBySpaceId(space.id);
    const chainFilteredChannels = channels.filter(channel => channel.chainId === parseInt(chainId));

    res.send({
      finiteChannels: chainFilteredChannels.filter(channel => isFiniteChannel(channel)),
      infiniteChannels: chainFilteredChannels.filter(channel => isInfiniteChannel(channel)),
      legacyContests: contestsV1.filter(contest => contest.chainId === parseInt(chainId))
    })


  } catch (err) {
    next(err)
  }
}

export const getSpace = async (req: Request, res: Response, next: NextFunction) => {
  const spaceName = req.query.spaceName as string

  try {
    const space = await dbSingleSpaceByName(spaceName);

    res.send(space).status(200);

  } catch (err) {
    next(err)
  }
}

export const getSpaces = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const spaces = await manySpaces.execute();

    res.send(spaces).status(200);

  } catch (err) {
    next(err)
  }
}


const processSpaceData = async (args: MutateSpaceData) => {

  const { spaceId, name, logoUrl, website, admins } = args;

  const nameResult = await validateSpaceName(name, spaceId);
  const logoResult = validateSpaceLogo(logoUrl);
  const websiteResult = validateSpaceWebsite(website);
  const adminsResult = await validateSpaceAdmins(admins);

  const cleanedSpaceData = {
    ...args,
    name: nameResult,
    logoUrl: logoResult,
    website: websiteResult,
    admins: adminsResult,
  };

  return cleanedSpaceData;
}

export const createSpace = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const args = req.body as MutateSpaceData;

    await processSpaceData(args).then(createDbSpace);

    res.send({ success: true }).status(200)

  } catch (err) {
    console.log(err)
    next(err)
  }

}

export const editSpace = async (req: ContexedRequest, res: Response, next: NextFunction) => {

  try {
    const args = req.body as MutateSpaceData;

    const user = await authorizationController.getUser(req.context)
    if (!user) throw new AuthorizationError('UNAUTHORIZED')

    const result = await processSpaceData(args);
    await updateDbSpace(result, user);

    res.send({ success: true }).status(200)

  } catch (err) {
    console.log(err)
    next(err)
  }

}