import { ethers } from 'ethers';

import ERC20ABI from './abi/erc20ABI.js'
import ERC721ABI from './abi/erc721ABI.js';
import ERC1155ABI from './abi/erc1155ABI.js';
import ERC165ABI from './abi/erc165ABI.js';


import dotenv from 'dotenv';
dotenv.config();

const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';
const ERC1155MetaDataURIInterface = '0xd9b67a26';

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_KEY);
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


export const isERC1155TokenFungible = async ({ contractAddress, tokenId }: {
    contractAddress: string, tokenId: number
}) => {
    try {
        const tokenContract = new ethers.Contract(contractAddress, ERC1155ABI, provider);
        const isFungible = await tokenContract.supportsInterface(ERC1155MetaDataURIInterface);
        if (isFungible) return true;
        return false;
    } catch (err) {
        return false;
    }
}