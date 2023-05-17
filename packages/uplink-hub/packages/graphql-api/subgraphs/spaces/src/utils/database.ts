import { db, schema, sqlOps } from "lib";
import { GraphQLError } from "graphql";


export const createDbSpace = async (
    spaceData: {
        name: string;
        logoUrl: string;
        website?: string;
        twitter?: string;
        admins: string[];
    }) => {

    const { name, logoUrl, website, twitter, admins } = spaceData;

    const space: schema.dbNewSpaceType = {
        name: name.replaceAll(' ', '').toLowerCase(),
        displayName: name,
        logoUrl: logoUrl,
        website: website,
        twitter: twitter,
        members: 0,
    }

    try {

        const spaceName = await db.transaction(async (tx) => {
            const newSpace = await tx.insert(schema.spaces).values(space)
            const spaceId = parseInt(newSpace.insertId);
            await tx.insert(schema.admins).values(admins.map(admin => {
                return {
                    address: admin,
                    spaceId: spaceId
                }
            }))
            const result = await tx.select({ name: schema.spaces.name })
                .from(schema.spaces)
                .where(sqlOps.eq(schema.spaces.id, spaceId));
            return result[0].name
        });

        return spaceName
    } catch (e) {
        throw new GraphQLError('something went wrong', {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }

}


export const updateDbSpace = async (
    id: string,
    spaceData: {
        name: string;
        logoUrl: string;
        website?: string;
        twitter?: string;
        admins: string[];
    },
    user: string) => {
    const { name, logoUrl, website, twitter, admins } = spaceData;
    const spaceId = parseInt(id);

    const checkAdminStatus = (spaceAdmins) => {
        const isAdmin = spaceAdmins.some((admin) => admin.address === user);
        if (!isAdmin) {
            throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }
    }

    const updatedSpace: schema.dbNewSpaceType = {
        name: name.replaceAll(' ', '').toLowerCase(),
        displayName: name,
        logoUrl: logoUrl,
        website: website,
        twitter: twitter,
        members: 0,
    }

    try {
        const updatedSpaceName = await db.transaction(async (tx) => {
            // 1. Get space with admins
            const spaceAdmins = await tx.select({ address: schema.admins.address }).from(schema.admins).where(sqlOps.eq(schema.admins.spaceId, spaceId));
            // 2. check that current user is an admin
            checkAdminStatus(spaceAdmins);
            // 3. Delete all existing admins
            await Promise.all(
                spaceAdmins.map((admin) =>
                    tx.delete(schema.admins).where(sqlOps.eq(schema.admins.spaceId, spaceId))
                )
            );
            // 4. update the space
            return await tx.transaction(async (tx2) => {
                await tx2.update(schema.spaces).set(updatedSpace).where(sqlOps.eq(schema.spaces.id, spaceId))
                await tx2.insert(schema.admins).values(admins.map(admin => {
                    return {
                        address: admin,
                        spaceId: spaceId
                    }
                }))
                // return the space name
                const result = await tx2.select({ name: schema.spaces.name })
                    .from(schema.spaces)
                    .where(sqlOps.eq(schema.spaces.id, spaceId));
                return result[0].name
            })
        });

        return updatedSpaceName
    } catch (e) {
        throw new GraphQLError('something went wrong', {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }

}
