import { ethers } from 'ethers';
import ERC20ABI from '@/lib/abi/erc20ABI.json';
import ERC721ABI from '@/lib/abi/erc721ABI.json';
import ERC1155ABI from '@/lib/abi/erc1155ABI.json';
import ERC165ABI from '@/lib/abi/erc165ABI.json';

const ERC721Inerface = '0x80ac58cd';
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

const validateInterface = async (address: string, interfaceId: string) => {
    try {
        const erc165Contract = new ethers.Contract(address, ERC165ABI, provider);
        return await erc165Contract.supportsInterface(interfaceId);
    } catch (err) {
        return false;
    }
};

export const verifyTokenStandard = async ({ address, expectedStandard }: {
    address: string;
    expectedStandard: string;
}) => {
    switch (expectedStandard) {
        case "ERC20":
            try {
                const [isERC20, isERC721] = await Promise.all([
                    validateERC20(address),
                    validateInterface(address, ERC721Inerface),
                ]);
                return isERC20 && !isERC721;
            } catch (err) {
                return false;
            }
        case "ERC721":
            return await validateInterface(address, ERC721Inerface);
        case "ERC1155":
            return await validateInterface(address, ERC1155Interface);
        default:
            return false;
    }
};



