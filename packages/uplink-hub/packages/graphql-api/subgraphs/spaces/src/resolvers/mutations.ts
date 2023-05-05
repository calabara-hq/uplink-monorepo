import { Authorization } from "lib";
import {
    validateSpaceName,
    validateSpaceLogo,
    validateSpaceTwitter,
    validateSpaceWebsite,
    validateSpaceAdmins
} from "../utils/validateFormData.js";
import { createDbSpace, updateDbSpace } from "../utils/database.js";
import { GraphQLError } from "graphql";


const processSpaceData = async (spaceData, user, spaceId?: string) => {
    const { name, logoUrl, website, twitter, admins } = spaceData;
    const nameResult = await validateSpaceName(name, spaceId);
    const logoResult = validateSpaceLogo(logoUrl);
    const websiteResult = validateSpaceWebsite(website);
    const twitterResult = validateSpaceTwitter(twitter);
    const adminsResult = await validateSpaceAdmins(admins);

    const errors = {
        ...(nameResult.error ? { name: nameResult.error } : {}),
        ...(logoResult.error ? { logoUrl: logoResult.error } : {}),
        ...(websiteResult.error ? { website: websiteResult.error } : {}),
        ...(twitterResult.error ? { twitter: twitterResult.error } : {}),
        ...(adminsResult.error ? { admins: adminsResult.error } : {}),
    };

    const cleanedSpaceData = {
        name: nameResult.value,
        logoUrl: logoResult.value,
        website: websiteResult.value,
        twitter: twitterResult.value,
        admins: adminsResult.addresses,
    };

    return {
        success: Object.keys(errors).length === 0,
        errors: errors,
        cleanedSpaceData: cleanedSpaceData,
    }
}

const mutations = {
    Mutation: {
        createSpace: async (_: any, args: any, context: any) => {

            const user = await Authorization.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            const { spaceData } = args;
            const result = await processSpaceData(spaceData, user);
            const spaceName = result.success ? await createDbSpace(result.cleanedSpaceData) : null;

            return {
                spaceName: spaceName,
                success: result.success,
                errors: result.errors,
            }
        },

        editSpace: async (_: any, args: any, context: any) => {

            const user = await Authorization.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })

            const { spaceId, spaceData } = args;
            const result = await processSpaceData(spaceData, user, spaceId);
            const spaceName = result.success ? await updateDbSpace(spaceId, result.cleanedSpaceData, user) : null;

            return {
                spaceName: spaceName,
                success: result.success,
                errors: result.errors,
            }
        },
    },
};

export default mutations;
