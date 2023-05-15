import { sqlOps } from "lib";
import { schema } from "lib";
import { _prismaClient, db } from "lib";

const findSpace = async (id?: string, name?: string) => {
    const where = id
        ? { id: parseInt(id) }
        : name
            ? { name }
            : undefined;

    if (!where) {
        return null;
    }
    return await _prismaClient.space.findUnique({
        where,
        include: {
            admins: true,
        },
    });
};

const findSpace2 = async (id?: string, name?: string) => {
    const where = id
        ? { id: parseInt(id) }
        : name
            ? { name }
            : undefined;

    if (!where) {
        return null;
    }
    return await db.select().from(schema.spaces).limit(1)
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
                id: row.id,
                name: row.name,
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
            return await findSpace(id, name);
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpace(space.id);
        },
    },
};




export default queries