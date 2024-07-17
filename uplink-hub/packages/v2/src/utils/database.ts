import { DatabaseController, schema } from "lib";
import dotenv from 'dotenv';

dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;


/* -------------------------------------------------------------------------- */
/*                                   MISC                                     */
/* -------------------------------------------------------------------------- */

const prepared_dbUserSpaceAdmin = db.query.admins.findFirst({
    where: (admin: schema.dbAdminType) => sqlOps.and(
        sqlOps.eq(admin.address, sqlOps.placeholder('address')),
        sqlOps.eq(admin.spaceId, sqlOps.placeholder('spaceId'))
    )

}).prepare();

/* -------------------------------------------------------------------------- */
/*                                   CHANNEL                                  */
/* -------------------------------------------------------------------------- */


export const dbGetChannel = async (
    contractAddress: string,
    chainId: number
): Promise<schema.dbChannelType> => {

    return db.execute(sqlOps.sql`SELECT * FROM channels WHERE channelAddress = ${contractAddress} AND chainId = ${chainId}`)
        .then(data => data.rows[0])
}


export const dbGetChannelsBySpaceName = async (spaceName: string): Promise<Array<schema.dbChannelType>> => {
    return db.execute(sqlOps.sql`
        SELECT channels.* from spaces LEFT JOIN channels ON spaces.id = channels.spaceId WHERE spaces.name = ${spaceName}
    `).then(data => data.rows)
}



export const dbIsUserSpaceAdmin = async (user: any, spaceId: number) => {
    const isAdmin = await prepared_dbUserSpaceAdmin.execute({ address: user.address, spaceId: spaceId })
    return isAdmin
}

export const dbInsertChannel = async (spaceId: string, contractAddress: string, chainId: number, channelType: string) => {

    const channel: schema.dbNewChannelType = {
        spaceId: parseInt(spaceId),
        createdAt: Math.floor(Date.now() / 1000).toString(),
        channelAddress: contractAddress,
        channelType,
        chainId
    }

    await db.insert(schema.channels).values(channel)
}


/* -------------------------------------------------------------------------- */
/*                                   TOKENS V1                                */
/* -------------------------------------------------------------------------- */

export const dbGetV1TokensByChannelAddress = async ({
    channelAddress,
    chainId,
    orderByMints,
    where,
    limit,
    offset
}: {
    channelAddress: string
    chainId: number
    orderByMints: boolean
    where?: string
    limit?: number
    offset?: number
}): Promise<Array<schema.dbZoraTokenType>> => {

    // Base query
    let query = sqlOps.sql`
      SELECT * FROM zoraTokens
      WHERE channelAddress = ${channelAddress} AND chainId = ${chainId}
    `

    if (orderByMints) {
        query = sqlOps.sql`${query} ORDER BY totalMinted DESC`;
    } else {
        query = sqlOps.sql`${query} ORDER BY id desc`;
    }

    if (limit !== undefined) {
        query = sqlOps.sql`${query} LIMIT ${limit}`;
    }

    if (offset !== undefined) {
        query = sqlOps.sql`${query} OFFSET ${offset}`;
    }

    return db.execute(query)
        .then(data => data.rows);
}

/* -------------------------------------------------------------------------- */
/*                                   TOKENS V2                                */
/* -------------------------------------------------------------------------- */

export const dbBanTokenV2 = async ({ channelAddress, chainId, tokenId }: { channelAddress: string, chainId: number, tokenId: string }) => {
    const newBannedTokenV2: schema.dbNewBannedOnchainTokenType = {
        channelAddress,
        chainId,
        tokenId
    }

    await db.insert(schema.bannedOnchainTokens).values(newBannedTokenV2);
}

export const prepared_bannedTokensV2 = db.query.bannedOnchainTokens.findMany({
    where: (bannedToken: schema.dbBannedOnchainTokenType) => sqlOps.and(
        sqlOps.eq(bannedToken.channelAddress, sqlOps.placeholder('channelAddress')),
        sqlOps.eq(bannedToken.chainId, sqlOps.placeholder('chainId'))
    )
}).prepare();

/* -------------------------------------------------------------------------- */
/*                                   TOKEN INTENTS                            */
/* -------------------------------------------------------------------------- */

export const dbGetChannelTokenIntents = async ({
    channelAddress,
    chainId,
    onlyActive,
    includeBanned,
    includeFulfilled,
    findFirst,
    findMany
}: {
    channelAddress: string,
    chainId: number,
    onlyActive?: boolean
    includeBanned?: boolean
    includeFulfilled?: boolean
    findFirst?: {
        id?: number
        tokenId?: string
    }
    findMany?: {
        limit?: number
        skip?: number
    }
}): Promise<Array<schema.dbTokenIntentType>> => {
    let query = sqlOps.sql`
      SELECT 
        id,
        spaceId,
        author,
        chainId,
        channelId,
        channelAddress,
        tokenIntent,
        deadline,
        createdAt,
        tokenId,
        banned
      FROM tokenIntents
      WHERE channelAddress = ${channelAddress} AND chainId = ${chainId} 
    `

    if (onlyActive) {
        query = sqlOps.sql`${query} AND deadline > ${Math.floor(Date.now() / 1000).toString()}`
    }

    if (!includeBanned) {
        query = sqlOps.sql`${query} AND banned = 0`
    }

    if (!includeFulfilled) {
        query = sqlOps.sql`${query} AND tokenId = '0'`
    }

    if (findFirst) {
        if (findFirst.id) {
            query = sqlOps.sql`${query} AND id = ${findFirst.id}`
        }

        if (findFirst.tokenId) {
            query = sqlOps.sql`${query} AND tokenId = ${findFirst.tokenId}`
        }
    }

    if (findMany) {
        if (findMany.limit) {
            query = sqlOps.sql`${query} LIMIT ${findMany.limit}`;
        }

        if (findMany.skip) {
            query = sqlOps.sql`${query} OFFSET ${findMany.skip}`;
        }
    }

    return db.execute(query)
        .then((data: any) => data.rows);

}


export const dbInsertTokenIntent = async ({
    spaceId,
    author,
    channelId,
    chainId,
    channelAddress,
    tokenIntent,
    deadline
}: {
    spaceId: number,
    author: string,
    channelId: number,
    chainId: number,
    channelAddress: string,
    tokenIntent: string,
    deadline: string
}) => {

    const newTokenIntent: schema.dbNewTokenIntentType = {
        spaceId,
        author,
        channelId,
        chainId,
        channelAddress,
        tokenIntent: tokenIntent,
        deadline: deadline,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        tokenId: "0",
        banned: 0
    }

    await db.insert(schema.tokenIntents).values(newTokenIntent)
}

export const dbBanTokenIntent = async ({ channelAddress, chainId, tokenIntentId }: { channelAddress: string, chainId: number, tokenIntentId: string }) => {
    await db.update(schema.tokenIntents).set({ banned: 1 }).where(
        sqlOps.and(
            sqlOps.eq(schema.tokenIntents.channelAddress, channelAddress),
            sqlOps.eq(schema.tokenIntents.chainId, chainId),
            sqlOps.eq(schema.tokenIntents.id, tokenIntentId)

        ));
}
export const dbFulfillTokenIntent = async ({ channelAddress, chainId, tokenIntentId, tokenId }: { channelAddress: string, chainId: number, tokenIntentId: string, tokenId: string }) => {
    await db.update(schema.tokenIntents).set({ tokenId }).where(
        sqlOps.and(
            sqlOps.eq(schema.tokenIntents.channelAddress, channelAddress),
            sqlOps.eq(schema.tokenIntents.chainId, chainId),
            sqlOps.eq(schema.tokenIntents.id, tokenIntentId)
        ));
}


