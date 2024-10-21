import { channelAbi } from "@tx-kit/sdk/abi"
import { erc165Abi } from '@/lib/abi/erc165Abi';
import wagmiConfig from './wagmi';
import { readContracts } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';
import { ChainId } from '@/types/chains';


const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';


export const getTokenInfo = async ({ contractAddress, chainId }: { contractAddress: Address, chainId: ChainId }) => {
    let symbol: string = '';
    let decimals: number = 0;
    let type: string = 'ERC20';  // Default to ERC20

    // @ts-ignore
    const results = await readContracts(wagmiConfig, {
        // @ts-ignore
        contracts: [
            // @ts-ignore
            {
                address: contractAddress,
                abi: erc20Abi,
                functionName: 'symbol',
                args: [],
                chainId
            },
            {
                address: contractAddress,
                abi: erc20Abi,
                functionName: 'decimals',
                args: [],
                chainId
            },
            {
                address: contractAddress,
                abi: erc165Abi,
                functionName: 'supportsInterface',
                args: [ERC721Interface],  // Check for ERC721 support
                chainId
            },
            {
                address: contractAddress,
                abi: erc165Abi,
                functionName: 'supportsInterface',
                args: [ERC1155Interface],  // Check for ERC1155 support
                chainId
            },
            {
                address: contractAddress,
                abi: channelAbi,
                functionName: 'name',
                args: [],
                chainId
            },

        ]
    }).catch(err => {
        console.log(err);
    });

    if (results) {
        symbol = results[0].error ? '' : results[0].result as string;
        decimals = results[1].error ? 0 : results[1].result as number;
        const name = results[4].error ? '' : results[4].result as string;

        const isERC721 = results[2].result as boolean;
        const isERC1155 = results[3].result as boolean;

        if (isERC721) {
            type = 'ERC721';
        } else if (isERC1155) {
            type = 'ERC1155';
            if (symbol === '') {
                symbol = name;
            }
        }
    }

    return { symbol, decimals, type };
}
