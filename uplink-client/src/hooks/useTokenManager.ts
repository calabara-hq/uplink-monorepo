import { useEffect, useReducer } from "react";
import { z } from "zod";
import { getTokenInfo } from "@/lib/tokenInfo";
import { isAddress } from "viem";

const managedTokenSchema = z.object({
    chainId: z.union([z.literal(8453), z.literal(84532)]),
    address: z.string(),
    type: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    tokenId: z.string().nullable(),
}).transform((data, ctx) => {
    if (data.type === "ERC1155") {
        if (data.tokenId === null) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Token ID is required",
                path: ["tokenId"],
            });
        }
    }
    return data;
})

type ZodSafeParseErrorFormat = {
    [key: string]: { _errors: string[] };
};

type ManagedTokenInput = z.input<typeof managedTokenSchema>;
type ManagedTokenOutput = z.output<typeof managedTokenSchema>;

export type ManagedTokenState = ManagedTokenInput & { errors?: ZodSafeParseErrorFormat };

const ManagedTokenReducer = (state: ManagedTokenState, action: { type: string; payload: any }): ManagedTokenState => {
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

export const useManagedTokenEditor = (initialState?: ManagedTokenInput) => {
    const [managedToken, dispatch] = useReducer(ManagedTokenReducer, {
        type: "",
        address: "",
        symbol: "",
        decimals: 0,
        tokenId: null,
        ...initialState,
    });



    useEffect(() => {
        if (isAddress(managedToken.address)) {
            getTokenInfo({ contractAddress: managedToken.address, chainId: managedToken.chainId }).then(res => {
                dispatch({
                    type: "SET_FIELD",
                    payload: { field: "symbol", value: res.symbol },
                });
                dispatch({
                    type: "SET_FIELD",
                    payload: { field: "decimals", value: res.decimals },
                });
                dispatch({
                    type: "SET_FIELD",
                    payload: { field: "type", value: res.type },
                })
            })

        }
    }, [managedToken.address, managedToken.chainId])


    const setManagedToken = (field: string, value: any) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field, value },
        });
    }

    const validateManagedToken = () => {
        const { errors, ...rest } = managedToken;
        console.log(rest)
        const result = managedTokenSchema.safeParse(rest);

        if (!result.success) {
            const formattedErrors = (result as z.SafeParseError<typeof managedTokenSchema>).error.format();
            console.log(formattedErrors);
            dispatch({
                type: "SET_ERRORS",
                payload: formattedErrors,
            });
            throw new Error("Failed to validate interaction logic");
        }

        return result;
    }
    return {
        managedToken,
        setManagedToken,
        validateManagedToken,
    };
}