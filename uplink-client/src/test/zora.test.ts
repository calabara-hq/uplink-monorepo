import { describe, expect, test } from "@jest/globals";
import { ConfigurableZoraEditionSchema, ConfigurableZoraEditionInput } from "@/hooks/useCreateZoraEdition";

const unixRegex = /^\d{10}$/;

describe("validate zora config", () => {
    test("should succeed with valid config", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "test",
            symbol: "TST",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "test",
            animationURI: "",
            imageURI: "https://test.com",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        expect(result.success).toBe(true);
        const { salesConfig, ...output } = result.data;
        const { salesConfig: sc_in, ...rest } = input;
        expect(output).toStrictEqual(rest);
        expect(salesConfig.publicSaleStart).toMatch(unixRegex);
        expect(salesConfig.publicSaleEnd).toMatch(unixRegex);
    });

    test("should fail with invalid text inputs", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "",
            symbol: "",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "",
            animationURI: "",
            imageURI: "https://test.com",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        const errors = result.error.format();
        expect(result.success).toBe(false);
        expect(errors.name._errors[0]).toBe("Name is required");
        expect(errors.symbol._errors[0]).toBe("Symbol is required");
        expect(errors.description._errors[0]).toBe("Description is required");
    })


    test("should fail without imageURI", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "test",
            symbol: "test",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "test",
            animationURI: "",
            imageURI: "",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        const errors = result.error.format();
        expect(result.success).toBe(false);
        expect(errors.imageURI._errors[0]).toBe("Image must be set");
    })

    test("should fail without video thumbnail", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "test",
            symbol: "test",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "test",
            animationURI: "https://test",
            imageURI: "",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: "now",
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        const errors = result.error.format();
        expect(result.success).toBe(false);
        expect(errors.animationURI._errors[0]).toBe("Video thumbnail must be set");
    })

    test("should fail with sale start > sale end", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "test",
            symbol: "test",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "test",
            animationURI: "",
            imageURI: "https://test",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        const errors = result.error.format();
        expect(result.success).toBe(false);
        expect(errors.salesConfig.publicSaleStart._errors[0]).toBe("Public sale start must be before public sale end");
    })

    test("should fail with sale start in past", () => {
        const input: ConfigurableZoraEditionInput = {
            name: "test",
            symbol: "test",
            editionSize: "1",
            royaltyBPS: "1000",
            description: "test",
            animationURI: "",
            imageURI: "https://test",
            salesConfig: {
                publicSalePrice: "1",
                publicSaleStart: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                publicSaleEnd: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
            }
        }

        const result: any = ConfigurableZoraEditionSchema.safeParse(input);
        const errors = result.error.format();
        expect(result.success).toBe(false);
        expect(errors.salesConfig.publicSaleStart._errors[0]).toBe("Public sale start must be in the future");
    })


})