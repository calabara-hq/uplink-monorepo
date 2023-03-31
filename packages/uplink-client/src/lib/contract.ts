import { ethers } from 'ethers';
import ERC20ABI from '@/lib/abi/erc20ABI.json';
import ERC721ABI from '@/lib/abi/erc721ABI.json';
import ERC1155ABI from '@/lib/abi/erc1155ABI.json';
import ERC165ABI from '@/lib/abi/erc165ABI.json';
import { IToken } from '@/app/contestbuilder/contestHandler';

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

export const verifyTokenStandard = async ({ address, expectedStandard }: { address: string; expectedStandard: string; }) => {
    switch (expectedStandard) {
        case "ERC20":
            try {
                const [isERC20, isERC721] = await Promise.all([
                    validateERC20(address),
                    validateInterface(address, ERC721Interface),
                ]);
                return isERC20 && !isERC721;
            } catch (err) {
                return false;
            }
        case "ERC721":
            return await validateInterface(address, ERC721Interface);
        case "ERC1155":
            return await validateInterface(address, ERC1155Interface);
        default:
            return false;
    }
};


export const tokenGetSymbolAndDecimal = async ({ contractAddress, tokenStandard }: { contractAddress: string, tokenStandard: string }) => {
    let tokenAbi: any[];

    switch (tokenStandard) {
        case 'ERC20':
            tokenAbi = ERC20ABI;
            break;
        case 'ERC721':
            tokenAbi = ERC721ABI;
            break;
        case 'ERC1155':
            tokenAbi = ERC1155ABI;
            break;
        default:
            throw new Error('Invalid token standard');
    }

    const tokenContract = new ethers.Contract(contractAddress, tokenAbi, provider);

    let symbol = '';
    let decimals = 0;
    try {
        symbol = await tokenContract.functions.symbol().then(res => res[0]);
    } catch (err) {
        if (tokenStandard !== 'ERC1155') {
            throw new Error('Failed to fetch symbol');
        }
    }

    if (tokenStandard === 'ERC20') {
        try {
            decimals = await tokenContract.functions.decimals();
        } catch (err) {
            throw new Error('Failed to fetch decimals');
        }
    }

    return [symbol, Number(decimals)];
}