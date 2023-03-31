import { describe, expect, test } from "@jest/globals";
import { verifyTokenStandard } from "@/lib/contract";


const ERC721 = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03" // nouns
const ERC20 = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" // usdc
const ERC1155 = "0xab0ab2fc1c498942B24278Bbd86bD171a3406A5E" // meme seizer
const EOA = "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"
describe("token contract validation", () => {

    // erc20

    test("validate erc20 pass", async () => {
        const isERC20 = await verifyTokenStandard({ address: ERC20, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(true);
    });

    test("validate erc20 fail on bad address", async () => {
        const isERC20 = await verifyTokenStandard({ address: ERC20.slice(0, 30), expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("validate erc20 fail on passed erc721", async () => {
        const isERC20 = await verifyTokenStandard({ address: ERC721, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("validate erc20 fail on passed erc1155", async () => {
        const isERC20 = await verifyTokenStandard({ address: ERC1155, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    // erc721

    test("validate erc721 pass", async () => {
        const isERC721 = await verifyTokenStandard({ address: ERC721, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(true);
    });

    test("validate erc721 fail on bad address", async () => {
        const isERC721 = await verifyTokenStandard({ address: ERC721.slice(0, 30), expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("validate erc721 fail on passed erc1155", async () => {
        const isERC721 = await verifyTokenStandard({ address: ERC1155, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("validate erc721 fail on passed erc20", async () => {
        const isERC721 = await verifyTokenStandard({ address: ERC20, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    // erc1155

    test("validate erc1155 pass", async () => {
        const isERC1155 = await verifyTokenStandard({ address: ERC1155, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(true);
    });

    test("validate erc721 fail on bad address", async () => {
        const isERC1155 = await verifyTokenStandard({ address: ERC1155.slice(0, 30), expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });

    test("validate erc721 fail on passed erc721", async () => {
        const isERC1155 = await verifyTokenStandard({ address: ERC721, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });

    test("validate erc721 fail on passed erc20", async () => {
        const isERC1155 = await verifyTokenStandard({ address: ERC20, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });


    test("fail for EOA", async () => {
        const isERC20 = await verifyTokenStandard({ address: EOA, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("fail for EOA", async () => {
        const isERC721 = await verifyTokenStandard({ address: EOA, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("fail for EOA", async () => {
        const isERC1155 = await verifyTokenStandard({ address: EOA, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });


});