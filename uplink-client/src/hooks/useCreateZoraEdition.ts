import { z } from "zod";

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

export default function useCreateZoraEdition() {


}