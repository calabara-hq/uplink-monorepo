import { sqlOps, schema, db } from "lib";

const findSpace = async (id?: string, name?: string) => {
    const where = id
        ? sqlOps.eq(schema.spaces.id, parseInt(id))
        : name
            ? sqlOps.eq(schema.spaces.name, name)
            : null;

    if (!where) {
        return null;
    }
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
            return findSpace(id, name);
        },
    },

    Space: {
        async __resolveReference(space) {
            return findSpace(space.id);
        },
    },
};

export default queries