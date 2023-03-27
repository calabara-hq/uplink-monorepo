import { _prismaClient } from "lib";

export const createDbSpace = async (spaceData) => {
    const { ens, name, logo_url, website, twitter, admins } = spaceData;

    const newSpace = await _prismaClient.space.create({
        data: {
            id: ens,
            name: name,
            logo_url: logo_url,
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
    return newSpace.id;
}

// editDbSpace should update space by id
export const updateDbSpace = async (id, spaceData) => {
    const { name, logo_url, website, twitter, admins } = spaceData;
    // 1. Get space with admins
    const spaceWithAdmins = await _prismaClient.space.findUnique({
        where: { id: id },
        include: { admins: true },
    });

    // 2. Delete all existing admins
    await Promise.all(
        spaceWithAdmins.admins.map((admin) =>
            _prismaClient.admin.delete({
                where: { id: admin.id },
            })
        )
    );

    // 3. update the space
    const result = await _prismaClient.space.update({
        where: {
            id: id
        },
        data: {
            name: name,
            logo_url: logo_url,
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
    return result.id;
}