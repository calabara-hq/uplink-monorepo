import { Address, getAddress } from "viem";
import { schema } from "lib";
import { db, sqlOps } from './database.js'
import { createWeb3Client } from "./viem.js";
import { normalize } from "viem/ens";
import { SpaceMutationError } from "../errors.js";
import { MutateSpaceData } from "../types.js";

// validate space name
export const validateSpaceName = async (name: MutateSpaceData["name"], spaceId?: string) => {

    const isNewSpace = !spaceId;

    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new SpaceMutationError("Name is required");
    }

    const nameLength = trimmedName.length;

    if (nameLength < 3) {
        throw new SpaceMutationError("Name must be at least 3 characters");
    } else if (nameLength > 30) {
        throw new SpaceMutationError("Name must be less than 30 characters");
    } else if (!trimmedName.match(/^[a-zA-Z0-9_ ]+$/)) {
        throw new SpaceMutationError("Name must only contain alphanumeric characters and underscores");
    }

    const dbFormattedName = trimmedName.replace(' ', '').toLowerCase();

    const where = isNewSpace ?
        sqlOps.eq(schema.spaces.name, dbFormattedName)
        :
        sqlOps.and(sqlOps.eq(schema.spaces.name, dbFormattedName), sqlOps.ne(schema.spaces.id, parseInt(spaceId)))

    // check if the name is already taken
    const spaces = await db.select({ id: schema.spaces.id }).from(schema.spaces).where(where);

    if (spaces.length > 0) {
        throw new SpaceMutationError("Name is already taken");
    }

    return trimmedName;
};

// validate space logo
export const validateSpaceLogo = (logoUrl: MutateSpaceData["logoUrl"]) => {

    if (!logoUrl) {
        throw new SpaceMutationError("Logo is required")
    }

    return logoUrl;
};

export const validateSpaceWebsite = (website: MutateSpaceData["website"]) => {
    if (!website) return null;
    return website.trim();
}

export const validateEthAddress = async (address: string) => {

    const publicClient = createWeb3Client(1);

    if (!address) return null;

    address = address.trim();

    if (address.match(/\.eth$/)) {
        // resolvedAddress = await provider.resolveName(address);
        const resolvedAddress = await publicClient.getEnsAddress({
            name: normalize(address),
        });
        if (!resolvedAddress) throw new SpaceMutationError("Invalid ens");
        return resolvedAddress;
    }

    return getAddress(address);

}

export const validateSpaceAdmins = async (admins: MutateSpaceData["admins"]): Promise<Array<Address>> => {

    if (!admins || admins.length === 0) {
        throw new SpaceMutationError("At least one admin is required");
    }

    const adminFields = await Promise.all(
        admins.map(async (admin, index) => {
            if (!admin || admin.length === 0) {
                return null;
            }

            const cleanAddress = await validateEthAddress(admin);

            if (!cleanAddress) {
                throw new SpaceMutationError("Invalid address");
            }

            return cleanAddress;
        })
    );

    // store errors first so that indexes match with the passed values before cleaning
    // Accumulate error messages into a single string

    return adminFields
};
