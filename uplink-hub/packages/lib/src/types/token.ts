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


export const TokenSchema = z.union([ERCTokenSchema, NativeTokenSchema])

export type IERCToken = z.infer<typeof ERCTokenSchema>;
export type INativeToken = z.infer<typeof NativeTokenSchema>;
export type IToken = z.infer<typeof TokenSchema>;

export const isNativeToken = (token: any): token is INativeToken => {
    return NativeTokenSchema.safeParse(token).success;
}

export const isERCToken = (token: any): token is IERCToken => {
    return ERCTokenSchema.safeParse(token).success;
}