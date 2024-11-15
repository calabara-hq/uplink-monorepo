"use client";;
import { validateEthAddress } from '@/lib/ethAddress';
import { createWeb3Client } from '@/lib/viem';
import { normalize } from 'path';
import { useReducer } from 'react';
import { Address, getAddress } from 'viem';
import { z } from 'zod';

const mainnetClient = createWeb3Client(1);

export const SpaceSettingsSchema = z.object({
    name: z.string().min(3, { message: "Name must contain at least 3 characters" }).max(30).regex(/^[a-zA-Z0-9_ ]+$/, { message: "Name must only contain alphanumeric characters and underscores" }),
    logoUrl: z.string().min(1, { message: "Logo is required" }),
    website: z.string().optional(),
    admins: z.array(z.string()),
}).transform(async (data, ctx) => {

    const name = data.name.trim();
    const logoUrl = data.logoUrl.trim();
    const website = data.website?.trim();
    const admins = await Promise.all(data.admins.map(validateEthAddress));

    //const anyNulls = admins.some((admin) => !admin);
    const adminErrs = admins.map(admin => !admin ? true : false)
    const hasErrs = adminErrs.some((err) => err);

    if (hasErrs) {
        const firstErrIdx = adminErrs.findIndex((err) => err);

        ctx.addIssue({
            path: ["admins", firstErrIdx],
            code: z.ZodIssueCode.custom,
            "message": "Invalid Ethereum address",
        })
    }

    return {
        name,
        logoUrl,
        website,
        admins
    }

});

export type SpaceSettingsInput = z.infer<typeof SpaceSettingsSchema>;
export type SpaceSettingsOutput = z.output<typeof SpaceSettingsSchema>;

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

export type SpaceSettingsStateT = SpaceSettingsInput & { errors: ZodSafeParseErrorFormat }

export const baseConfig: SpaceSettingsStateT = {
    name: "",
    logoUrl: "",
    website: "",
    admins: [],
    errors: {}
}

export const StateReducer = (state: SpaceSettingsStateT, action: { type: string, payload: any }) => {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: undefined }, // Clear error when field is set
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        default:
            return state;
    }
}

export const useSpaceSettings = (priorState: SpaceSettingsStateT) => {

    const initialState = { ...baseConfig, ...priorState };
    const [state, dispatch] = useReducer(StateReducer, initialState);

    const setField = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }


    const validateSettings = async () => {
        const { errors, ...rest } = state;
        const result = await SpaceSettingsSchema.safeParseAsync({
            ...rest,
            admins: state.admins.filter((admin) => admin !== "")
        });
        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof SpaceSettingsSchema>).error.format();
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
        }

        return result;
    }

    return {
        state,
        setField,
        validateSettings
    }

}

// export const NewSpaceSettingsSchema = SpaceSettingsSchema.transform(async (data, ctx) => {

// })

// export const EditSpaceSettingsSchema = SpaceSettingsSchema.transform(async (data, ctx) => {

// })

