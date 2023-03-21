import { validateEthAddress } from "../utils/ethAddress.js";
import prisma from 'shared-prisma';

export type FieldResponse = {
    value: string;
    error: string;
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

    const isEnsTaken = await prisma.space.findFirst({
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
export const validateSpaceName = async (name: string): Promise<FieldResponse> => {
    const fields: FieldResponse = { value: name, error: null };

    if (!fields.value) {
        fields.error = "Space name cannot be empty"
        return fields
    }


    fields.value = fields.value.trim()


    if (fields.value.length < 3) {
        fields.error = "Space name must be at least 3 characters";
        return fields
    }

    if (fields.value.length > 30) {
        fields.error = "Space name is too long";
        return fields
    }

    return fields;
}

// validate space logo
export const validateSpaceLogo = (logo_url: string): FieldResponse => {
    const fields: FieldResponse = { value: logo_url, error: null };

    if (!fields.value) {
        fields.error = "Space logo cannot be empty"
        return fields
    }

    fields.value = fields.value.trim();
    const isIpfsLogo = fields.value.match(/https:\/\/calabara.mypinata.cloud\/ipfs\/Qm[a-zA-Z0-9]{44}/);

    if (!isIpfsLogo) {
        fields.error = "Space logo is not valid";
    }

    return fields;
}

export const validateSpaceWebsite = (website: string) => {
    const fields: FieldResponse = { value: website, error: null };
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

export const validateSpaceAdmins = async (admins: string[]) => {
    let topLevelAdminsError = null;

    if (!admins) return { topLevelAdminsError: "Admins cannot be empty", errors: [], addresses: [] }

    const promises = admins.map(async (admin) => {
        const field: FieldResponse = { value: admin, error: null };

        if (!field.value || field.value.length === 0) return undefined; // remove empty fields

        const cleanAddress = await validateEthAddress(field.value);

        if (!cleanAddress) {
            field.error = "invalid address";
            topLevelAdminsError = "1 or more admin fields are invalid"
            return field
        }

        field.value = cleanAddress;
        return field;
    })


    // filter out undefined and duplicates from filteredAdmins.
    const filteredAdmins = await (await Promise.all(promises)).filter((value, index, self) => {
        return value !== undefined && self.findIndex(v => v && v.value === value.value) === index;
    });

    // store all errors and addresses in unique arrays
    const errors = filteredAdmins.map(admin => admin.error);
    const addresses = filteredAdmins.map(admin => admin.value);

    if (addresses.length < 1) return { topLevelAdminsError: "Admins cannot be empty", errors: [], addresses: [] }

    return { topLevelAdminsError, errors, addresses }
}
