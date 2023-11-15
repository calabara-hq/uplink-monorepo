import { describe, expect, test } from "@jest/globals";
import {
    ConfigurableZoraEditionSchema,
    ConfigurableZoraEditionInput,
    EditionNameSchema,
    EditionSymbolSchema,
    EditionSizeSchema,
    EditionRoyaltyBPSSchema,
    EditionPublicSalePriceSchema,
    EditionSalesConfigSchema,
} from "@/hooks/useCreateZoraEdition";
import { uint64MaxSafe } from "@/utils/uint64";

const unixRegex = /^\d{10}$/;

describe("validate zora config", () => {

    describe("validate edition name", () => { })
    describe("validate edition symbol", () => { })
    describe("validate edition description", () => { })

    describe("validate edition size", () => {
        test("open edition", () => {
            const size = "open";
            const result = EditionSizeSchema.safeParse(size);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("18446744073709551615");
            }
        })
        test("1/1", () => {
            const size = "one";
            const result = EditionSizeSchema.safeParse(size);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("1");
            }
        })
        test("fixed", () => {
            const size = "100";
            const result = EditionSizeSchema.safeParse(size);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("100");
            }
        })
        test("fail with empty string", () => {
            const size = "";
            const result: any = EditionSizeSchema.safeParse(size);
            const errors = result.error.format();
            expect(result.success).toBe(false);
            expect(errors._errors[0]).toBe("Edition size is required");
        })
    })

    describe("validate edition royaltyBPS", () => {
        test("0%", () => {
            const bps = "zero";
            const result = EditionRoyaltyBPSSchema.safeParse(bps);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(0);
            }
        })
        test("5%", () => {
            const bps = "five";
            const result = EditionRoyaltyBPSSchema.safeParse(bps);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(500);
            }
        })
        test("5.5%", () => {
            const bps = "5.5"
            const result = EditionRoyaltyBPSSchema.safeParse(bps);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(550);
            }
        })
        test("0.05%", () => {
            const bps = "0.05"
            const result = EditionRoyaltyBPSSchema.safeParse(bps);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(5);
            }
        })
        test("integer precision", () => {
            const bps = "5.00005"
            const result = EditionRoyaltyBPSSchema.safeParse(bps);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe(500);
            }
        })
        test("fail with empty string", () => {
            const bps = "";
            const result: any = EditionRoyaltyBPSSchema.safeParse(bps);
            const errors = result.error.format();
            expect(result.success).toBe(false);
            expect(errors._errors[0]).toBe("Royalty % is required");
        })
    })

    describe("validate edition public sale price", () => {
        test("free", () => { })
        test("0.001 eth", () => {
            const price = "0.001";
            const result = EditionPublicSalePriceSchema.safeParse(price);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("1000000000000000");
            }
        })

        test("0.00420", () => {
            const price = "0.00420";
            const result = EditionPublicSalePriceSchema.safeParse(price);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("4200000000000000");
            }
        })

        test("1.5 eth", () => {
            const price = "1.5";
            const result = EditionPublicSalePriceSchema.safeParse(price);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe("1500000000000000000");
            }
        })
        test("fail with empty string", () => {
            const price = "";
            const result: any = EditionPublicSalePriceSchema.safeParse(price);
            const errors = result.error.format();
            expect(result.success).toBe(false);
            expect(errors._errors[0]).toBe("Edition price is required");
        })
    })


    describe("validate public sale datetimes", () => {
        test("startTime = now, endTime = forever", () => {
            const nowUnix = Math.floor(new Date().getTime() / 1000);
            const salesConfig = {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: "forever",
            }

            const result = EditionSalesConfigSchema.safeParse(salesConfig);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.publicSaleStart).toMatch(unixRegex);
                expect(result.data.publicSaleEnd).toBe(uint64MaxSafe.toString());
                expect(nowUnix - parseInt(result.data.publicSaleStart)).toBeLessThan(5); // 5 second tolerance
            }
        })

        test("startTime = now, endTime = week", () => {
            const salesConfig = {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: "week",
            }

            const result = EditionSalesConfigSchema.safeParse(salesConfig);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.publicSaleStart).toMatch(unixRegex);
                expect(result.data.publicSaleEnd).toMatch(unixRegex);
                expect(parseInt(result.data.publicSaleEnd) - parseInt(result.data.publicSaleStart)).toBe(604800);
            }
        })

        test("startTime = custom, endTime = custom", () => {
            const plus1day = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
            const plus2day = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();
            const unixPlus1Day = Math.floor(new Date(plus1day).getTime() / 1000);
            const unixPlus2Day = Math.floor(new Date(plus2day).getTime() / 1000);
            const salesConfig = {
                publicSalePrice: "1",
                publicSaleStart: plus1day,
                publicSaleEnd: plus2day,
            }
            const result = EditionSalesConfigSchema.safeParse(salesConfig);
            expect(result.success).toBe(true);

            if (result.success) {
                expect(result.data.publicSaleStart).toMatch(unixRegex);
                expect(result.data.publicSaleEnd).toMatch(unixRegex);
                expect(parseInt(result.data.publicSaleEnd) - parseInt(result.data.publicSaleStart)).toBe(86400);
                expect(parseInt(result.data.publicSaleStart)).toBe(unixPlus1Day);
                expect(parseInt(result.data.publicSaleEnd)).toBe(unixPlus2Day);
            }
        })

        test("startTime < now", () => {
            const minus1day = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
            const salesConfig = {
                publicSalePrice: "1",
                publicSaleStart: minus1day,
                publicSaleEnd: "forever",
            }
            const result = EditionSalesConfigSchema.safeParse(salesConfig);
            expect(result.success).toBe(false);
            const errrors = result.error.format();
            expect(errrors.publicSaleStart._errors[0]).toBe("Public sale start must be in the future");
        })

        test("endTime < startTime", () => {
            const plus1day = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
            const plus2day = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();

            const salesConfig = {
                publicSalePrice: "1",
                publicSaleStart: plus2day,
                publicSaleEnd: plus1day,
            }
            const result = EditionSalesConfigSchema.safeParse(salesConfig);
            expect(result.success).toBe(false);
            const errrors = result.error.format();
            expect(errrors.publicSaleEnd._errors[0]).toBe("Public sale end must be after public sale start");
        })
    })

    // test("should succeed with valid config", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "test",
    //         symbol: "TST",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "test",
    //         animationURI: "",
    //         imageURI: "https://test.com",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: "now",
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     expect(result.success).toBe(true);
    //     const { salesConfig, ...output } = result.data;
    //     const { salesConfig: sc_in, ...rest } = input;
    //     expect(output).toStrictEqual(rest);
    //     expect(salesConfig.publicSaleStart).toMatch(unixRegex);
    //     expect(salesConfig.publicSaleEnd).toMatch(unixRegex);
    // });

    // test("should fail with invalid text inputs", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "",
    //         symbol: "",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "",
    //         animationURI: "",
    //         imageURI: "https://test.com",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: "now",
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     const errors = result.error.format();
    //     expect(result.success).toBe(false);
    //     expect(errors.name._errors[0]).toBe("Name is required");
    //     expect(errors.symbol._errors[0]).toBe("Symbol is required");
    //     expect(errors.description._errors[0]).toBe("Description is required");
    // })


    // test("should fail without imageURI", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "test",
    //         symbol: "test",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "test",
    //         animationURI: "",
    //         imageURI: "",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: "now",
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     const errors = result.error.format();
    //     expect(result.success).toBe(false);
    //     expect(errors.imageURI._errors[0]).toBe("Image must be set");
    // })

    // test("should fail without video thumbnail", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "test",
    //         symbol: "test",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "test",
    //         animationURI: "https://test",
    //         imageURI: "",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: "now",
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     const errors = result.error.format();
    //     expect(result.success).toBe(false);
    //     expect(errors.animationURI._errors[0]).toBe("Video thumbnail must be set");
    // })

    // test("should fail with sale start > sale end", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "test",
    //         symbol: "test",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "test",
    //         animationURI: "",
    //         imageURI: "https://test",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     const errors = result.error.format();
    //     expect(result.success).toBe(false);
    //     expect(errors.salesConfig.publicSaleStart._errors[0]).toBe("Public sale start must be before public sale end");
    // })

    // test("should fail with sale start in past", () => {
    //     const input: ConfigurableZoraEditionInput = {
    //         name: "test",
    //         symbol: "test",
    //         editionSize: "1",
    //         royaltyBPS: "1000",
    //         description: "test",
    //         animationURI: "",
    //         imageURI: "https://test",
    //         salesConfig: {
    //             publicSalePrice: "1",
    //             publicSaleStart: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    //             publicSaleEnd: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    //         }
    //     }

    //     const result: any = ConfigurableZoraEditionSchema.safeParse(input);
    //     const errors = result.error.format();
    //     expect(result.success).toBe(false);
    //     expect(errors.salesConfig.publicSaleStart._errors[0]).toBe("Public sale start must be in the future");
    // })


})