import { validateEthAddress } from "../utils/ethAddress.js";
import { _prismaClient } from "lib";
export type FieldResponse = {
    value: string;
    error: string;
}

type FieldResponse2 = {
    error?: string;
}

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


// validate space name
export const validateSpaceName = async (name: string) => {

    const response: FieldResponse2 = {};

    if (!name) {
        response.error = "Name is required"
        return response
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
        response.error = "Name must be at least 3 characters long";
        return response
    }

    if (trimmedName.length > 30) {
        response.error = "Name must be less than 30 characters long";
        return response
    }

    if (!trimmedName.match(/^[a-zA-Z0-9_ ]+$/)) {
        response.error = "Name must only contain alphanumeric characters, spaces, and underscores";
        return response
    }

    return response
}

// validate space logo
export const validateSpaceLogo = (logo_url: string) => {

    const response: FieldResponse2 = {};

    if (!logo_url) {
        response.error = "Logo is required"
        return response
    }

    const trimmedLogo = logo_url.trim();

    const pattern = /^(https:\/\/(?:[a-z0-9]+\.(?:ipfs|ipns)\.[a-z]+|cloudflare-ipfs\.com\/ipfs\/[a-zA-Z0-9]+|cloud\.ipfs\.io\/ipfs\/[a-zA-Z0-9]+|ipfs\.infura\.io\/ipfs\/[a-zA-Z0-9]+|dweb\.link\/ipfs\/[a-zA-Z0-9]+|ipfs\.fsi\.cloud\/ipfs\/[a-zA-Z0-9]+|ipfs\.runfission\.com\/ipfs\/[a-zA-Z0-9]+|calabara\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+)|ipfs:\/\/[a-zA-Z0-9]+)/;
    if (!pattern.test(trimmedLogo)) {
        response.error = "Logo is not valid"
        return response
    }

    return response
}

export const validateSpaceWebsite = (website: string) => {

    const response: FieldResponse2 = {};

    if (!website) return response;

    const trimmedWebsite = website.trim();

    const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.([a-z]{2,})(\.[a-z]{2,})?$/;
    if (!pattern.test(trimmedWebsite)) {
        response.error = "Website is not valid"
        return response
    }

    return response
}

export const validateSpaceTwitter = (twitter: string) => {

    const response: FieldResponse2 = {};

    if (!twitter) return response;

    const trimmedTwitter = twitter.trim();

    const pattern = /^@(\w){1,15}$/;
    if (!pattern.test(trimmedTwitter)) {
        response.error = "Twitter handle is not valid"
        return response
    }

    return response

}

// return cleaned admins and errors
export const validateSpaceAdmins = async (admins: string[]) => {

    const response: {
        addresses: string[];
        error?: string;
    } = {
        addresses: [],
    }


    if (!admins || admins.length === 0) {
        response.error = "Admins are required";
        return response;
    }


    const promises = admins.map(async (admin, index) => {

        if (!admin) {
            return null;
        }

        const cleanAddress = await validateEthAddress(admin);

        if (!cleanAddress) {
            response.error = `invalid address at index ${index}`;
            return null
        }

        response.addresses.push(cleanAddress);
        return;
    })

    await Promise.all(promises);

    // remove duplicates from response.addresses
    response.addresses = [...new Set(response.addresses)];

    return response;
}
