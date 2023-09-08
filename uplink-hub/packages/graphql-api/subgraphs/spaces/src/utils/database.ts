import { DatabaseController, schema, revalidateClientCache } from "lib";
import { GraphQLError } from "graphql";
import dotenv from 'dotenv';

dotenv.config();

const databaseController = new DatabaseController(process.env.DATABASE_HOST, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
export const db = databaseController.db;
export const sqlOps = databaseController.sqlOps;



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
        created: new Date().toISOString(),
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

        await revalidateClientCache({
            host: process.env.FRONTEND_HOST,
            secret: process.env.FRONTEND_API_SECRET,
            tags: ['spaces']
        })

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

    const updatedSpace: Partial<schema.dbNewSpaceType> = {
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

                await revalidateClientCache({
                    host: process.env.FRONTEND_HOST,
                    secret: process.env.FRONTEND_API_SECRET,
                    tags: ['spaces', `space/${spaceId}`]
                })

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
