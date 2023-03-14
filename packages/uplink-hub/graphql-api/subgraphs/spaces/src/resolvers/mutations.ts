import { validateEthAddress } from "../utils/ethAddress.js";

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
    return fields;
}

export const validateSpaceTwitter = (twitter: string) => {
    const fields: FieldResponse = { value: twitter, error: null };
    fields.value = fields.value.trim();
    if (fields.value.length > 0) {
        const isTwitter = fields.value.match(/^@/);
        if (!isTwitter) {
            fields.error = "Twitter handle must start with @";
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
            const { spaceData } = args;
            const result = await processSpaceData(spaceData);
            return {
                success: result.success,
                spaceResponse: result.spaceResponse
            }
        }
    },
};

export default mutations;
