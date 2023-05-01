import { _prismaClient } from "lib";
import { GraphQLError } from "graphql";

type SpaceData = {
    name: string;
    logoUrl: string;
    website?: string;
    twitter?: string;
    admins: string[];
}

export const createDbSpace = async (spaceData: SpaceData) => {
    const { name, logoUrl, website, twitter, admins } = spaceData;

    const newSpace = await _prismaClient.space.create({
        data: {
            name: name.replace(' ', '').toLowerCase(),
            displayName: name,
            logoUrl: logoUrl,
            website: website,
            twitter: twitter,
            members: 0,
            admins: {
                create: admins.map(admin => {
                    return {
                        address: admin
                    }
                })

            }

        }
    });
    return newSpace.name;
}

// editDbSpace should update space by id
export const updateDbSpace = async (id: string, spaceData: SpaceData, user) => {
    const { name, logoUrl, website, twitter, admins } = spaceData;
    const spaceId = parseInt(id);

    console.log(admins)


    // 1. Get space with admins
    const spaceWithAdmins = await _prismaClient.space.findUnique({
        where: { id: spaceId },
        include: { admins: true },
    });

    // 2. check that current user is an admin
    const isAdmin = spaceWithAdmins.admins.some((admin) => admin.address === user);

    if (!isAdmin) {
        throw new GraphQLError('Unauthorized', {
            extensions: {
                code: 'UNAUTHORIZED'
            }
        })
    }

    // 3. Delete all existing admins
    await Promise.all(
        spaceWithAdmins.admins.map((admin) =>
            _prismaClient.admin.delete({
                where: { id: admin.id },
            })
        )
    );

    // 4. update the space
    const result = await _prismaClient.space.update({
        where: {
            id: spaceId
        },
        data: {
            name: name.replace(' ', '').toLowerCase(),
            displayName: name,
            logoUrl: logoUrl,
            website: website,
            twitter: twitter,
            admins: {
                create: admins.map(admin => {
                    return {
                        address: admin
                    }
                })
            }
        }
    });
    return result.name;
}