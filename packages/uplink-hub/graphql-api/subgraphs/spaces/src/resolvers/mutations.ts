import { validateEthAddress } from "../utils/ethAddress.js";
import getUser from "../utils/authorize.js";
import { spaces } from './index.js'
import { randomUUID } from "crypto";

export type FieldResponse = {
    value: string;
    error: string;
}

// validate space name
export const validateSpaceName = (name: string): FieldResponse => {
    const fields: FieldResponse = { value: name, error: null };

    if (!fields.value) {
        fields.error = "Space name cannot be empty"
        return fields
    }

    fields.value = fields.value.trim();
    if (fields.value.length < 3) {
        fields.error = "Space name must be at least 3 characters";
    }

    if (fields.value.length > 30) {
        fields.error = "Space name is too long";
    }
    return fields;
}

export const validateSpaceWebsite = (website: string) => {
    const fields: FieldResponse = { value: website, error: null };
    // TODO: check that website is valid
    // valid websites include https://, http://, and no protocol
    if (!fields.value) return fields;
    fields.value = fields.value.trim();

    if (fields.value.length > 50) {
        fields.error = "Website is too long";
        return fields
    }

    if (fields.value.length > 0) {
        const isWebsite = fields.value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
        if (!isWebsite) {
            fields.error = "Website is not valid";
        }
    }

    return fields;
}

export const validateSpaceTwitter = (twitter: string) => {
    const fields: FieldResponse = { value: twitter, error: null };
    if (!fields.value) return fields;
    fields.value = fields.value.trim();

    if (fields.value.length > 15) {
        fields.error = "Twitter handle is too long";
        return fields
    }

    if (fields.value.length > 0) {
        const isTwitter = fields.value.match(/^@(\w){1,15}$/);
        if (!isTwitter) {
            fields.error = "Twitter handle is not valid";
        }
    }
    return fields;
}


export const validateAdmins = async (admins: string[]) => {
    let adminError = null; // top level admin error

    if (!admins) return { adminError: 'admins cannot be empty', filteredAdmins: [] }


    const promises = admins.map(async (admin) => {
        const field: FieldResponse = { value: admin, error: null };

        if (!field.value || field.value.length === 0) return undefined; // remove empty fields

        const cleanAddress = await validateEthAddress(field.value);

        if (!cleanAddress) {
            field.error = "invalid address";
            adminError = "1 or more admin fields are invalid"
            return field
        }

        field.value = cleanAddress;
        return field;
    })

    const filteredAdmins = await (await Promise.all(promises)).filter((value, index, self) => {
        return value !== undefined && self.findIndex(v => v && v.value === value.value) === index;
    });

    return { adminError, filteredAdmins }
}


export const processSpaceData = async (spaceData) => {
    const { name, website, twitter, admins } = spaceData;
    const nameResult = validateSpaceName(name);
    const websiteResult = validateSpaceWebsite(website);
    const twitterResult = validateSpaceTwitter(twitter);
    const { adminError, filteredAdmins: adminsResult } = await validateAdmins(admins);

    // if there are errors, push them to the top level errors array
    const errors = [];
    if (nameResult.error) errors.push(nameResult.error);
    if (websiteResult.error) errors.push(websiteResult.error);
    if (twitterResult.error) errors.push(twitterResult.error);
    if (adminError) errors.push(adminError);



    return {
        success: errors.length === 0,
        errors: errors,
        spaceResponse: {
            name: nameResult,
            website: websiteResult,
            twitter: twitterResult,
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
            const result = await processSpaceData(spaceData);
            // TODO handle the space slug and db writes
            if (result.success) {
                // push the correct fields to the spaces array
                const { name, website, twitter, admins } = result.spaceResponse;
                spaces.push({
                    id: randomUUID().toString(),
                    logo: 'dummy',
                    name: name.value,
                    website: website.value,
                    members: 0,
                    admins: admins.map(admin => admin.value)
                })
            }
            return {
                success: result.success,
                spaceResponse: result.spaceResponse
            }
        }
    },
};

export default mutations;
