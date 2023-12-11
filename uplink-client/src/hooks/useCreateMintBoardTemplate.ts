import { uint64MaxSafe } from "@/utils/uint64";
import { useReducer, useState } from "react";
import { z } from "zod";
import { Decimal } from 'decimal.js';
import { handleMutationError } from "@/lib/handleMutationError";
import { Session } from "@/providers/SessionProvider";
import { validateEthAddress } from "@/lib/ethAddress";
import { supportedChains } from "@/lib/chains/supportedChains";

export const MintBoardTemplateSchema = z.object({
    chainId: z.number().refine((n) => supportedChains.map(chain => chain.id).includes(n), { message: "Must be base network" }),
    enabled: z.boolean(),
    boardTitle: z.string().min(1, { message: "Board title is required" }),
    boardDescription: z.string().min(1, { message: "Board description is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    symbol: z.string().min(1, { message: "Symbol is required" }),
    editionSize: z.string(),
    description: z.string().min(1, { message: "Description is required" }),
    publicSalePrice: z.string(),
    publicSaleStart: z.string(),
    publicSaleEnd: z.string(),
    referrer: z.string().min(1, { message: "Referral reward recipient is required" })
}).superRefine(async (data, ctx) => {

    const isEns = data.referrer.endsWith(".eth");
    if (isEns) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["referrer"],
            message: "ENS not supported",
        })
    }

    const cleanAddress = await validateEthAddress(data.referrer);
    if (!Boolean(cleanAddress)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["referrer"],
            message: "Invalid Address",
        })
    }
})


export type MintBoardTemplate = z.infer<typeof MintBoardTemplateSchema>;


type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};
export const EditionWizardReducer = (state: MintBoardTemplate & { errors?: ZodSafeParseErrorFormat }, action: any) => {
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



export const configureMintBoard = async (url,
    {
        arg,
    }: {
        url: string;
        arg: {
            csrfToken: string;
            spaceName: string;
            mintBoardData: MintBoardTemplate;
        }
    }
) => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": arg.csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation ConfigureMintBoard($spaceName: String!, $mintBoardData: MintBoardInput!){
                    configureMintBoard(spaceName: $spaceName, mintBoardData: $mintBoardData){
                        success
                    }
                }`,
            variables: {
                csrfToken: arg.csrfToken,
                spaceName: arg.spaceName,
                mintBoardData: arg.mintBoardData,
            },
        }),
    })
        .then((res) => res.json())
        .then(handleMutationError)
        .then((res) => res.data.configureMintBoard);
}



export default function useCreateMintBoardTemplate(templateConfig?: MintBoardTemplate) {

    const baseConfig = {
        chainId: supportedChains[0].id,
        enabled: false,
        boardTitle: "",
        boardDescription: "",
        name: "",
        symbol: "",
        editionSize: "open",
        description: "",
        publicSalePrice: "free",
        publicSaleStart: "now",
        publicSaleEnd: "3 days",
        referrer: "",
        errors: {},
    }

    const initState = templateConfig ? { ...baseConfig, ...templateConfig } : baseConfig;

    const [state, dispatch] = useReducer(EditionWizardReducer, initState)


    const setField = (field: string, value: string | boolean | number) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }


    const validate = async () => {
        const { errors, ...rest } = state;
        const result = await MintBoardTemplateSchema.safeParseAsync(rest);
        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof MintBoardTemplateSchema>).error.format();
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
        validate,
    }
}
