import { uint64MaxSafe } from "@/utils/uint64";
import { useReducer } from "react";
import { SafeParseReturnType, z } from "zod";

export const EditionConfig = z.object({
    name: z.string(),
    symbol: z.string(),
    editionSize: z.string(),
    royaltyBPS: z.string(),
    fundsRecipient: z.string(),
    defaultAdmin: z.string(),
    saleConfig: z.object({
        publicSalePrice: z.string(),
        maxSalePurchasePerAddress: z.number(),
        publicSaleStart: z.string(),
        publicSaleEnd: z.string(),
        presaleStart: z.string(),
        presaleEnd: z.string(),
        presaleMerkleRoot: z.string(),
    }),
    description: z.string(),
    animationURI: z.string(),
    imageURI: z.string(),
})

export const ZoraEdition = z.object({
    chainId: z.number().refine((n) => n === 8453, { message: "Must be base network" }),
    address: z.string(),
    config: EditionConfig,
});

export const ConfigurableZoraEditionSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    symbol: z.string().min(1, { message: "Symbol is required" }),
    editionSize: z.string(),
    royaltyBPS: z.string(),
    description: z.string().min(1, { message: "Description is required" }),
    animationURI: z.string(),
    imageURI: z.string(),
    salesConfig: z.object({
        publicSalePrice: z.string(),
        publicSaleStart: z.union([z.string().datetime(), z.literal("now")]),
        publicSaleEnd: z.string().datetime(),
    }),
}).transform((val, ctx) => {

    const unixInS = (str: string | number | Date) => Math.floor(new Date(str).getTime() / 1000);
    const { publicSalePrice, publicSaleStart, publicSaleEnd } = val.salesConfig;
    const now = unixInS(new Date(Date.now()));
    const unixSaleStart = publicSaleStart === "now" ? now : unixInS(publicSaleStart);
    const unixSaleEnd = unixInS(publicSaleEnd);

    if (val.animationURI && !val.imageURI) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Video thumbnail must be set",
            path: ['animationURI'],
        })
        return z.NEVER;
    }

    if (!val.imageURI) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image must be set",
            path: ['imageURI'],
        })
        return z.NEVER;
    }

    if (unixSaleStart < now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Public sale start must be in the future",
            path: ['salesConfig', 'publicSaleStart'],
        })
        return z.NEVER;
    }

    if (unixSaleStart > unixSaleEnd) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Public sale start must be before public sale end",
            path: ['salesConfig', 'publicSaleStart'],
        })
        return z.NEVER;
    }

    const newSalesConfig = {
        publicSalePrice,
        publicSaleStart: unixSaleStart.toString(),
        publicSaleEnd: unixSaleEnd.toString(),
    }

    return {
        ...val,
        salesConfig: newSalesConfig,
    }

});

export type ZoraEdition = z.infer<typeof ZoraEdition>;
export type ZoraEditionConfig = z.infer<typeof EditionConfig>;
export type ConfigurableZoraEdition = z.infer<typeof ConfigurableZoraEditionSchema>;
export type ConfigurableZoraEditionInput = z.input<typeof ConfigurableZoraEditionSchema>;
export type ConfigurableZoraEditionOutput = z.output<typeof ConfigurableZoraEditionSchema>;


type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};
export const EditionWizardReducer = (state: ConfigurableZoraEditionInput & { errors?: ZodSafeParseErrorFormat }, action: any) => {
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

export default function useCreateZoraEdition(init_name?: string, init_imageURI?: string, init_animationURI?: string) {

    const [state, dispatch] = useReducer(EditionWizardReducer, {
        name: init_name ?? "",
        symbol: "",
        editionSize: uint64MaxSafe.toString(),
        royaltyBPS: "",
        description: "",
        animationURI: init_animationURI ?? "",
        imageURI: init_imageURI ?? "",
        salesConfig: {
            publicSalePrice: "",
            publicSaleStart: "now",
            publicSaleEnd: "forever",
        },
        errors: {},
    });


    const setField = (field: string, value: string) => {
        const keys = field.split('.');
        const lastKey = keys.pop();
        const lastObj = keys.reduce((stateObj, key) => stateObj[key] = stateObj[key] || {}, state);

        if (lastKey) {
            lastObj[lastKey] = value;
        }

        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    };

    const validate = () => {
        const { errors, ...rest } = state;
        const result = ConfigurableZoraEditionSchema.safeParse(rest);

        if (!result.success) {
            // Formatting errors and dispatching
            const formattedErrors = (result as z.SafeParseError<typeof ConfigurableZoraEditionSchema>).error.format();
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors, // Pass the formatted errors directly
            });
            console.log('invalid')
        } else {
            console.log('valid')
        }

    }


    // user writes to ConfigurableZoraEditionInput
    // we validate it
    // if it fails we set the errors in the form
    // if successful we translate it into a valid zora edition
    // then we prepare the contract query


    return {
        state,
        setField,
        validate,
    }

}