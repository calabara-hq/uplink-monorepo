import { describe, expect, test } from "@jest/globals";
import { TokenContractApi } from "@/lib/contract";
import { sampleERC1155Token, sampleERC20Token, sampleERC721Token, sampleETHToken } from "./sampleTokens";


const ERC721 = sampleERC721Token.address // nouns
const ERC20 = sampleERC20Token.address // usdc
const ERC1155 = sampleERC1155Token.address // meme seizer
const EOA = "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"


describe("token contract validation ETH mainnet", () => {

    const api = new TokenContractApi(1);

    // erc20

    test("validate erc20 pass", async () => {
        const isERC20 = await api.verifyTokenStandard({ contractAddress: ERC20, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(true);
    });

    test("validate erc20 fail on bad contractAddress", async () => {
        const isERC20 = await api.verifyTokenStandard({ contractAddress: ERC20.slice(0, 30), expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("validate erc20 fail on passed erc721", async () => {
        const isERC20 = await api.verifyTokenStandard({ contractAddress: ERC721, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("validate erc20 fail on passed erc1155", async () => {
        const isERC20 = await api.verifyTokenStandard({ contractAddress: ERC1155, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    // erc721

    test("validate erc721 pass", async () => {
        const isERC721 = await api.verifyTokenStandard({ contractAddress: ERC721, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(true);
    });

    test("validate erc721 fail on bad contractAddress", async () => {
        const isERC721 = await api.verifyTokenStandard({ contractAddress: ERC721.slice(0, 30), expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("validate erc721 fail on passed erc1155", async () => {
        const isERC721 = await api.verifyTokenStandard({ contractAddress: ERC1155, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("validate erc721 fail on passed erc20", async () => {
        const isERC721 = await api.verifyTokenStandard({ contractAddress: ERC20, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    // erc1155

    test("validate erc1155 pass", async () => {
        const isERC1155 = await api.verifyTokenStandard({ contractAddress: ERC1155, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(true);
    });

    test("validate erc721 fail on bad contractAddress", async () => {
        const isERC1155 = await api.verifyTokenStandard({ contractAddress: ERC1155.slice(0, 30), expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });

    test("validate erc721 fail on passed erc721", async () => {
        const isERC1155 = await api.verifyTokenStandard({ contractAddress: ERC721, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });

    test("validate erc721 fail on passed erc20", async () => {
        const isERC1155 = await api.verifyTokenStandard({ contractAddress: ERC20, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });


    test("fail for EOA", async () => {
        const isERC20 = await api.verifyTokenStandard({ contractAddress: EOA, expectedStandard: 'ERC20' });
        expect(isERC20).toBe(false);
    });

    test("fail for EOA", async () => {
        const isERC721 = await api.verifyTokenStandard({ contractAddress: EOA, expectedStandard: 'ERC721' });
        expect(isERC721).toBe(false);
    });

    test("fail for EOA", async () => {
        const isERC1155 = await api.verifyTokenStandard({ contractAddress: EOA, expectedStandard: 'ERC1155' });
        expect(isERC1155).toBe(false);
    });


});