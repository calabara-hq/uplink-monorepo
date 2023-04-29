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


const processSpaceData = async (spaceData, isNewSpace) => {
    const { name, logo_url, website, twitter, admins } = spaceData;
    const nameResult = await validateSpaceName(name);
    const logoResult = validateSpaceLogo(logo_url);
    const websiteResult = validateSpaceWebsite(website);
    const twitterResult = validateSpaceTwitter(twitter);
    const adminsResult = await validateSpaceAdmins(admins);

    const errors = {
        ...(nameResult.error ? { name: nameResult.error } : {}),
        ...(logoResult.error ? { logo_url: logoResult.error } : {}),
        ...(websiteResult.error ? { website: websiteResult.error } : {}),
        ...(twitterResult.error ? { twitter: twitterResult.error } : {}),
        ...(adminsResult.error ? { admins: adminsResult.error } : {}),
    };

    return {
        success: Object.keys(errors).length === 0,
        errors: errors,
    }
}

const mutations = {
    Mutation: {
        createSpace: async (_: any, args: any, context: any) => {
            /*
            const user = await Authorization.getUser(context);
            if (!user) throw new Error('Unauthorized');
            */
            const { spaceData } = args;
            const result = await processSpaceData(spaceData, true);

            // const spaceId = result.success ? await createDbSpace(result.spaceResponse) : null;
            return {
                success: result.success,
                errors: result.errors,
            }
        },

        editSpace: async (_: any, args: any, context: any) => {
            /*
            const user = await Authorization.getUser(context);
            if (!user) throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
            */

            const { spaceData } = args;
            const result = await processSpaceData(spaceData, false);

            // const spaceId = result.success ? await updateDbSpace(spaceData.ens, result.spaceResponse) : null;
            return {
                success: result.success,
                errors: result.errors,
            }
        },
    },
};

export default mutations;
