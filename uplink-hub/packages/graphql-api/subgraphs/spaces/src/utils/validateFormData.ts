import { validateEthAddress } from "../utils/ethAddress.js";
import { SpaceProps, schema, isIpfsUrl } from "lib";
import { db, sqlOps } from './database.js'

// validate space name
export const validateSpaceName = async (name: SpaceProps["name"], spaceId?: string) => {
    const response: {
        error?: string;
        value: string;
    } = {
        value: name?.trim(),
    };

    const isNewSpace = !spaceId;

    if (!response.value) {
        response.error = "Name is required";
        return response;
    }

    const nameLength = response.value.length;

    if (nameLength < 3) {
        response.error = "Name must be at least 3 characters";
    } else if (nameLength > 30) {
        response.error = "Name must be less than 30 characters";
    } else if (!response.value.match(/^[a-zA-Z0-9_ ]+$/)) {
        response.error = "Name must only contain alphanumeric characters and underscores";
    }

    const dbFormattedName = response.value.replace(' ', '').toLowerCase();

    const where = isNewSpace ?
        sqlOps.eq(schema.spaces.name, dbFormattedName)
        :
        sqlOps.and(sqlOps.eq(schema.spaces.name, dbFormattedName), sqlOps.ne(schema.spaces.id, parseInt(spaceId)))



    // check if the name is already taken
    const spaces = await db.select({ id: schema.spaces.id }).from(schema.spaces).where(where);



    if (spaces.length > 0) {
        response.error = "Name is already taken";
        return response;
    }

    return response;
};

// validate space logo
export const validateSpaceLogo = (logoUrl: SpaceProps["logoUrl"]) => {
    const response: {
        error?: string;
        value: string;
    } = {
        value: logoUrl?.trim(),
    };

    if (!response.value) {
        response.error = "Logo is required";
        return response;
    }

    return response;
};

export const validateSpaceWebsite = (website: SpaceProps["website"]) => {

    const response: {
        value?: string;
        error?: string;
    } = {}

    if (!website) return response;

    const trimmedWebsite = website.trim();

    const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.([a-z]{2,})(\.[a-z]{2,})?$/;

    if (!pattern.test(trimmedWebsite)) {
        response.error = "Website is not valid"
        return response
    }

    response.value = trimmedWebsite;
    return response

}

export const validateSpaceTwitter = (twitter: SpaceProps["twitter"]) => {

    const response: {
        value?: string;
        error?: string;
    } = {}

    if (!twitter) return response;

    const trimmedTwitter = twitter.trim();

    const pattern = /^@(\w){1,15}$/;
    if (!pattern.test(trimmedTwitter)) {
        response.error = "Twitter handle is not valid"
        return response
    }

    response.value = trimmedTwitter;
    return response

}

export const validateSpaceAdmins = async (admins: SpaceProps["admins"]) => {
    const response: {
        addresses: string[];
        error?: string;
    } = {
        addresses: [],
    };

    type adminField = {
        value: string,
        error: string | null
    };

    if (!admins || admins.length === 0) {
        response.error = "Admins are required";
        return response;
    }

    const adminFields = await Promise.all(
        admins.map(async (admin, index) => {
            if (!admin || admin.length === 0) {
                return null;
            }

            const cleanAddress = await validateEthAddress(admin);

            if (!cleanAddress) {
                return { value: admin, error: `invalid address at index ${index}` };
            }

            return { value: cleanAddress, error: null };
        })
    );

    // store errors first so that indexes match with the passed values before cleaning
    // Accumulate error messages into a single string

    const errors = adminFields.reduce((acc, field) => {
        if (field && field.error) {
            acc += (acc ? ", " : "") + field.error;
        }
        return acc;
    }, "");

    if (errors) {
        response.error = errors;
    }

    const uniqueAdminFields = adminFields.reduce((acc: adminField[], field) => {
        if (field && !acc.some(item => item.value === field.value)) {
            acc.push(field);
        }
        return acc;
    }, []);

    response.addresses = uniqueAdminFields
        .filter((field): field is adminField => field && field.error === null)
        .map(field => field.value);

    return response;
};


/*
export const validateSpaceEns = async (ens: string): Promise<FieldResponse> => {
    const fields: FieldResponse = { value: ens, error: null };
    if (!fields.value) {
        fields.error = "Space ens cannot be empty"
        return fields
    }


    const isValidEns = await validateEthAddress(fields.value);

    if (!isValidEns) {
        fields.error = "Invalid ens";
        return fields
    }

    const isEnsTaken = await _prismaClient.space.findFirst({
        where: {
            id: fields.value,
        }
    })

    if (isEnsTaken) {
        fields.error = "Ens is already taken";
        return fields
    }

    return fields;
}
*/