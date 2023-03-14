//import {validateAddress} from 'lib'


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


export const validateAdmins = (admins: string[]) => {
    let adminError = null; // top level admin error

    if (!admins) return { adminError: 'admins cannot be empty', filteredAdmins: [] }


    const filteredAdmins = admins.reduce((result, value, index) => {
        const field: FieldResponse = { value: value, error: null };

        // TODO convert ens to hex


        // trim whitespace
        // TODO this can be handled by my ethers library
        field.value = value.trim();

        if (field.value.length === 0 || result.some((item) => item.value === field.value)) {
            // remove admin from array if it is empty or if it is a duplicate
            return result;
        }

        const isEns = field.value.match(/\.eth$/); // check if address is ens or hex

        if (isEns) {

            // check if ens is valid
            const isValidEns = field.value.match(
                /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
            );
            if (!isValidEns) {
                adminError = true;
                field.error = "Invalid ENS";
                adminError = "1 or more admin fields are invalid"
            }
        } else {
            // check if hex address is valid
            const isValidHex = field.value.match(
                /^0x[a-fA-F0-9]{40}$/
            );
            if (!isValidHex) {
                adminError = true;
                field.error = "Invalid address";
                adminError = "1 or more admin fields are invalid"
            }
        }
        result.push(field);

        return result;
    }, []);

    return { adminError, filteredAdmins }
}


export const processSpaceData = async (spaceData) => {
    const { name, website, twitter, admins } = spaceData;
    const nameResult = validateSpaceName(name);
    const websiteResult = validateSpaceWebsite(website);
    const twitterResult = validateSpaceTwitter(twitter);
    const { adminError, filteredAdmins: adminsResult } = validateAdmins(admins);

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
