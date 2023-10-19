import { isERC1155TokenFungible, isValidERC1155TokenId, verifyTokenStandard } from "@/lib/contract";
import { z } from "zod";

export const ERCTokenSchema = z.object({
    type: z.enum(["ERC20", "ERC721", "ERC1155"]),
    address: z.string().length(42),
    decimals: z.number(),
    symbol: z.string(),
    tokenId: z.number().nullable(),
})

export const NativeTokenSchema = z.object({
    type: z.literal("ETH"),
    symbol: z.literal("ETH"),
    decimals: z.literal(18),
});



const validateTokenStandard = async (token: IToken): Promise<boolean> => {
    if (isERCToken(token)) {
        return verifyTokenStandard({
            contractAddress: token.address,
            expectedStandard: token.type,
        })
    }
    return true;
}

// verify that the token id is valid and fungible

const validateERC1155TokenId = async (token: IToken): Promise<boolean> => {
    if (isERCToken(token)) {
        if (token.type === "ERC1155") {
            if (!token.tokenId) return false;

            const [isValidId, isFungible] = await Promise.all([
                isValidERC1155TokenId({
                    contractAddress: token.address,
                    tokenId: token.tokenId
                }),
                isERC1155TokenFungible({
                    contractAddress: token.address,
                    tokenId: token.tokenId
                })
            ])
            return isValidId && isFungible;
        }
        return true;
    }
    return true;
}

const validateToken = async (token: IToken): Promise<boolean> => {
    const [isValidStandard, isValidTokenId] = await Promise.all([
        validateTokenStandard(token),
        validateERC1155TokenId(token),
    ])
    return isValidStandard && isValidTokenId;
}

export const TokenSchema = z.union([ERCTokenSchema, NativeTokenSchema]).readonly()
export const WritableTokenSchema = z.union([ERCTokenSchema, NativeTokenSchema]).refine(async (token) => { return token ? await validateToken(token) : true; }, { message: "Invalid token data" })

export type IERCToken = z.infer<typeof ERCTokenSchema>;
export type INativeToken = z.infer<typeof NativeTokenSchema>;
export type IToken = z.infer<typeof TokenSchema>;
export type WritableToken = z.infer<typeof WritableTokenSchema>;

export const isNativeToken = (token: any): token is INativeToken => {
    return NativeTokenSchema.safeParse(token).success;
}

export const isERCToken = (token: any): token is IERCToken => {
    return ERCTokenSchema.safeParse(token).success;
}
