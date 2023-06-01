import { schema } from "lib";
import { sqlOps, db } from "../utils/database.js";

const fetchSingleSpaceTopLevel = async ({ spaceId, name }: {
    spaceId?: number,
    name?: string
}) => {
    const where = spaceId
        ? sqlOps.eq(schema.spaces.id, spaceId)
        : name
            ? sqlOps.eq(schema.spaces.name, name)
            : null;

    if (!where) return null;

    const result = await db.select({
        id: schema.spaces.id,
        name: schema.spaces.name,
        displayName: schema.spaces.displayName,
        twitter: schema.spaces.twitter,
        website: schema.spaces.website,
        logoUrl: schema.spaces.logoUrl,
        members: schema.spaces.members,
    }).from(schema.spaces).where(where);
    console.log(result)
    return result;
}

const fetchAdmins = async (spaceId: number) => {
    const result = await db.select({
        id: schema.admins.id,
        spaceId: schema.admins.spaceId,
        address: schema.admins.address,
    }).from(schema.admins).where(sqlOps.eq(schema.admins.spaceId, spaceId));

    return result;
}


const fetchSpaceTokens = async (spaceId: number) => {
    const result = await db.select({
        id: schema.tokens.id,
        tokenHash: schema.tokens.tokenHash,
        address: schema.tokens.address,
        symbol: schema.tokens.symbol,
        decimals: schema.tokens.decimals,
        tokenId: schema.tokens.tokenId,
    }).from(schema.spacesToTokens)
        .leftJoin(schema.tokens, sqlOps.eq(schema.spacesToTokens.tokenLink, schema.tokens.id))
        .where(sqlOps.eq(schema.spacesToTokens.spaceId, spaceId));

    return result;
}



const findSingleSpace = async ({ id, name }: {
    id?: string,
    name?: string
}) => {

    if (id) {
        const spaceId = parseInt(id);
        const [spaceTopLevel, admins, spaceTokens] = await Promise.all([
            fetchSingleSpaceTopLevel({ spaceId: spaceId }).then(space => space[0]),
            fetchAdmins(spaceId),
            fetchSpaceTokens(spaceId)
        ])
        return {
            ...spaceTopLevel,
            admins,
            spaceTokens
        }
    }
    else if (name) {
        const space = await fetchSingleSpaceTopLevel({ name: name }).then((space) => space[0]);
        const [admins, spaceTokens] = await Promise.all([
            fetchAdmins(space.id),
            fetchSpaceTokens(space.id)
        ])
        return {
            ...space,
            admins,
            spaceTokens
        }
    } else return null

}



const findManySpaces = async () => {
    const spaces = await db.select({
        id: schema.spaces.id,
        name: schema.spaces.name,
        displayName: schema.spaces.displayName,
        twitter: schema.spaces.twitter,
        website: schema.spaces.website,
        logoUrl: schema.spaces.logoUrl,
        members: schema.spaces.members,
    }).from(schema.spaces);

    const result = await Promise.all(spaces.map(async (space) => {
        const [admins, spaceTokens] = await Promise.all([
            fetchAdmins(space.id),
            fetchSpaceTokens(space.id)
        ]);
        return {
            ...space,
            admins,
            spaceTokens
        }
    }));

    return result;
}

const queries = {
    Query: {
        async spaces() {
            return findManySpaces();
        },
        async space(parent, { id, name }, contextValue, info) {
            return findSingleSpace({ id: id, name: name });
        },
    },

    Space: {
        async __resolveReference(space) {
            return findSingleSpace({ id: space.id });
        },
    },
};

export default queries