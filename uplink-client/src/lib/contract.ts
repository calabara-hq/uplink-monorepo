import { publicClient } from './viem';
import ERC20ABI from '@/lib/abi/erc20ABI.json';
import ERC721ABI from '@/lib/abi/erc721ABI.json';
import ERC1155ABI from '@/lib/abi/erc1155ABI.json';
import ERC165ABI from '@/lib/abi/erc165ABI.json';


const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';
const ERC1155MetaDataURIInterface = '0xd9b67a26';

const validateERC20 = async (address: string) => {
    try {
        await publicClient.readContract({
            address: address as `0x${string}`,
            abi: ERC20ABI,
            functionName: 'totalSupply',
            args: [],
        })
        return true;
    } catch (err) {
        return false;
    }


};

const validateInterface = async (address: string, interfaceId: '0x80ac58cd' | '0xd9b67a26') => {
    try {
        return await publicClient.readContract({
            address: address as `0x${string}`,
            abi: ERC165ABI,
            functionName: 'supportsInterface',
            args: [interfaceId],
        })
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

    let symbol: string = '';
    let decimals: number = 0;

    try {
        symbol = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC20ABI,
            functionName: 'symbol',
            args: [],
        }) as string;
    } catch (err) {
        if (tokenStandard !== 'ERC1155') {
            console.log('Failed to fetch symbol');
        }
    }

    if (tokenStandard === 'ERC20') {
        try {
            decimals = await publicClient.readContract({
                address: contractAddress as `0x${string}`,
                abi: ERC20ABI,
                functionName: 'decimals',
                args: [],
            }) as number;
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
        const uri = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC1155ABI,
            functionName: 'uri',
            args: [tokenId],
        }) as string;

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
        const isFungible = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC1155ABI,
            functionName: 'supportsInterface',
            args: [ERC1155MetaDataURIInterface],
        }) as boolean;

        return isFungible;
    } catch (err) {
        return false;
    }
}