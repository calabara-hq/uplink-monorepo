import { ethers } from 'ethers';
import ERC20ABI from '@/lib/abi/erc20ABI.json';
import ERC721ABI from '@/lib/abi/erc721ABI.json';
import ERC1155ABI from '@/lib/abi/erc1155ABI.json';
import ERC165ABI from '@/lib/abi/erc165ABI.json';

const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.NEXT_PUBLIC_ALCHEMY_KEY);
const validateERC20 = async (address: string) => {
    try {
        const erc20Contract = new ethers.Contract(address, ERC20ABI, provider);
        await erc20Contract.totalSupply();
        return true;
    } catch (err) {
        return false;
    }
};

const validateInterface = async (address: string, interfaceId: '0x80ac58cd' | '0xd9b67a26') => {
    try {
        const erc165Contract = new ethers.Contract(address, ERC165ABI, provider);
        return await erc165Contract.supportsInterface(interfaceId);
    } catch (err) {
        return false;
    }
};

export const verifyTokenStandard = async ({ contractAddress, expectedStandard }: { contractAddress: string; expectedStandard: "ERC20" | "ERC721" | "ERC1155" }) => {
    switch (expectedStandard) {
        case "ERC20":
            try {
                const [isERC20, isERC721] = await Promise.all([
                    validateERC20(contractAddress),
                    validateInterface(contractAddress, ERC721Interface),
                ]);
                return isERC20 && !isERC721;
            } catch (err) {
                return false;
            }
        case "ERC721":
            return await validateInterface(contractAddress, ERC721Interface);
        case "ERC1155":
            return await validateInterface(contractAddress, ERC1155Interface);
        default:
            return false;
    }
};


export const tokenGetSymbolAndDecimal = async ({ contractAddress, tokenStandard }: { contractAddress: string, tokenStandard: "ERC20" | "ERC721" | "ERC1155" }) => {

    // use the erc20 abi since we only want symbol and decimals
    const tokenContract = new ethers.Contract(contractAddress, ERC20ABI, provider);

    let symbol = '';
    let decimals = 0;
    try {
        symbol = await tokenContract.symbol();
    } catch (err) {
        if (tokenStandard !== 'ERC1155') {
            console.log('Failed to fetch symbol');
        }
    }

    if (tokenStandard === 'ERC20') {
        try {
            decimals = await tokenContract.decimals();
        } catch (err) {
            console.log('Failed to fetch decimals');
        }
    }

    return { symbol, decimals };
}


export const isValidERC1155TokenId = async ({ contractAddress, tokenId }: {
    contractAddress: string, tokenId: number
}) => {
    try {
        const tokenContract = new ethers.Contract(contractAddress, ERC1155ABI, provider);
        const uri = await tokenContract.uri(tokenId);

        // Check if the URI is valid
        const uriRegex = new RegExp('^(https?|ipfs):\\/\\/[^\\s/$.?#].[^\\s]*$', 'i');
        return uriRegex.test(uri);
    } catch (err) {
        return false;
    }
}