import prisma from 'shared-prisma';



export const createDbSpace = async (spaceData) => {
    const { ens, name, logo_url, website, twitter, admins } = spaceData;

    const newSpace = await prisma.space.create({
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
    const spaceWithAdmins = await prisma.space.findUnique({
        where: { id: id },
        include: { admins: true },
    });

    // 2. Delete all existing admins
    await Promise.all(
        spaceWithAdmins.admins.map((admin) =>
            prisma.admin.delete({
                where: { id: admin.id },
            })
        )
    );

    // 3. update the space
    const result = await prisma.space.update({
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