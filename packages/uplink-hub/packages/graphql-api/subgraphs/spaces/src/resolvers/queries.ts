import { sqlOps, schema, db } from "lib";




const fetchSpaceTopLevel = async (spaceId?: number, name?: string) => {
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



const findSpace2 = async (id?: string, name?: string) => {


    if (id) {
        const spaceId = parseInt(id);
        const [spaceTopLevel, admins, spaceTokens] = await Promise.all([
            fetchSpaceTopLevel(spaceId, null).then(space => space[0]),
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
        const space = await fetchSpaceTopLevel(null, name).then((space) => space[0]);
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





const findSpace = async (id?: string, name?: string) => {
    const where = id
        ? sqlOps.eq(schema.spaces.id, parseInt(id))
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
        admins: schema.admins
    }).from(schema.spaces).leftJoin(schema.admins, sqlOps.eq(schema.spaces.id, schema.admins.spaceId)).where(where).limit(1);

    const aggregatedData = result.reduce((acc, row) => {
        const spaceId = row.id;
        const admin = {
            id: row.admins.id,
            spaceId: row.admins.spaceId,
            address: row.admins.address,
        };

        if (acc[spaceId]) {
            acc[spaceId].admins.push(admin);
        } else {
            acc[spaceId] = {
                ...row,
                admins: [admin],
            };
        }

        return acc;
    }, {});

    return Object.values(aggregatedData)[0];
}

const allSpaces = async () => {

    const rows = await db.select({
        id: schema.spaces.id,
        name: schema.spaces.name,
        displayName: schema.spaces.displayName,
        twitter: schema.spaces.twitter,
        website: schema.spaces.website,
        logoUrl: schema.spaces.logoUrl,
        members: schema.spaces.members,
        admins: schema.admins
    }).from(schema.spaces).leftJoin(schema.admins, sqlOps.eq(schema.spaces.id, schema.admins.spaceId))

    const aggregatedData = rows.reduce((acc, row) => {
        const spaceId = row.id;
        const admin = {
            id: row.admins.id,
            spaceId: row.admins.spaceId,
            address: row.admins.address,
        };

        if (acc[spaceId]) {
            acc[spaceId].admins.push(admin);
        } else {
            acc[spaceId] = {
                ...row,
                admins: [admin],
            };
        }

        return acc;
    }, {});

    return Object.values(aggregatedData);
}

const queries = {
    Query: {
        async spaces() {
            return allSpaces();
        },
        async space(parent, { id, name }, contextValue, info) {
            return findSpace2(id, name);
        },
    },

    Space: {
        async __resolveReference(space) {
            return findSpace(space.id);
        },
    },
};

export default queries