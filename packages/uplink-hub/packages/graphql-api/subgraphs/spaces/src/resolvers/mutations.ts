import getUser from "../utils/authorize.js";
import prisma from 'shared-prisma';
import {
    validateSpaceEns,
    validateSpaceName,
    validateSpaceLogo,
    validateSpaceTwitter,
    validateSpaceWebsite,
    validateSpaceAdmins
} from "../utils/validateFormData.js";

const createDbSpace = async (spaceData) => {
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
const updateDbSpace = async (id, spaceData) => {
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

const processSpaceData = async (spaceData, isNewSpace) => {
    const { ens, name, logo_url, website, twitter, admins } = spaceData;
    const ensResult = isNewSpace ? await validateSpaceEns(ens) : { value: ens, error: null };
    const nameResult = await validateSpaceName(name);
    const logoResult = validateSpaceLogo(logo_url);
    const websiteResult = validateSpaceWebsite(website);
    const twitterResult = validateSpaceTwitter(twitter);
    const { topLevelAdminsError, addresses: adminsResult, errors: adminErrors } = await validateSpaceAdmins(admins);

    const errors = {
        ens: ensResult.error,
        name: nameResult.error,
        logo_url: logoResult.error,
        website: websiteResult.error,
        twitter: twitterResult.error,
        topLevelAdminsError: topLevelAdminsError,
        admins: adminErrors
    };

    const isSuccess = !ensResult.error && !nameResult.error && !logoResult.error && !websiteResult.error && !twitterResult.error && !topLevelAdminsError;

    return {
        success: isSuccess,
        errors: errors,
        spaceResponse: {
            ens: ensResult.value,
            name: nameResult.value,
            logo_url: logoResult.value,
            website: websiteResult.value,
            twitter: twitterResult.value,
            admins: adminsResult
        }
    }
}

const mutations = {
    Mutation: {
        createSpace: async (_: any, args: any, context: any) => {
            const user = await getUser(context);
            if (!user) throw new Error('Unauthorized');

            const { spaceData } = args;
            const result = await processSpaceData(spaceData, true);

            const spaceId = result.success ? await createDbSpace(result.spaceResponse) : null;
            return {
                success: result.success,
                spaceResponse: {
                    ...(spaceId ? { id: spaceId } : {}),
                    ...result.spaceResponse
                },
                errors: result.errors,
            }
        },

        editSpace: async (_: any, args: any, context: any) => {
            const user = await getUser(context);
            if (!user) throw new Error('Unauthorized');
            const { spaceData } = args;
            const result = await processSpaceData(spaceData, false);

            const spaceId = result.success ? await updateDbSpace(spaceData.ens, result.spaceResponse) : null;
            return {
                success: result.success,
                spaceResponse: {
                    ...(spaceId ? { id: spaceId } : {}),
                    ...result.spaceResponse
                },
                errors: result.errors,
            }
        },
    },
};

export default mutations;
