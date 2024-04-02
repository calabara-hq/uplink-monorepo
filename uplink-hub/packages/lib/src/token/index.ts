import { ethers } from 'ethers';
import EthDater from 'ethereum-block-by-date';
import Decimal from 'decimal.js';
import ERC20ABI from './abi/erc20ABI.js'
import ERC721ABI from './abi/erc721ABI.js';
import ERC1155ABI from './abi/erc1155ABI.js';
import ERC165ABI from './abi/erc165ABI.js';
import { IToken } from '../types/token.js';
import type { Transport, Chain, PublicClient } from 'viem'
import { getAddress } from 'viem';
import { createViemClient } from './viem.js';
import { normalize } from 'viem/ens'

const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';
const ERC1155MetaDataURIInterface = '0xd9b67a26';

const formRpcUrl = (chainId: number, providerKey: string) => {
    switch (chainId) {
        case 1:
            return `https://eth-mainnet.alchemyapi.io/v2/${providerKey}`;
        case 8453:
            return `https://base-mainnet.g.alchemy.com/v2/${providerKey}`;
        case 10:
            return `https://opt-mainnet.g.alchemy.com/v2/${providerKey}`;
        case 7777777:
            return `https://rpc.zora.energy`;

        case 84531:
            return `https://base-goerli.g.alchemy.com/v2/${providerKey}`
        case 420:
            return `https://opt-goerli.g.alchemy.com/v2/${providerKey}`;
        case 999:
            return `https://testnet.rpc.zora.energy`;

        default: return `https://eth-mainnet.alchemyapi.io/v2/${providerKey}`;

    }

}

export class TokenController {
    private provider: ethers.providers.JsonRpcProvider;
    private viemClient: any;
    private dater: EthDater;

    constructor(providerKey: string, chainId: number) {
        const rpc = formRpcUrl(chainId, providerKey);
        this.provider = new ethers.providers.JsonRpcProvider(rpc);
        this.dater = new EthDater(this.provider);
        this.viemClient = createViemClient(providerKey, chainId);
    }

    validateEthAddress = async (address: string): Promise<string | null> => {
        if (!address) return null
        address = address.trim();

        const isEns = address.match(/\.eth$/); // check if address is ens or hex

        if (isEns) {
            const resolvedEns = await this.viemClient.getEnsAddress({
                name: normalize(address),
            })

            return resolvedEns ?? null;
        }

        try {

            return getAddress(address) ?? null

        } catch (error) {
            return null;
        }
    }

    validateERC20 = async (address: string) => {
        try {
            await this.viemClient.readContract({
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

    validateInterface = async (address: string, interfaceId: '0x80ac58cd' | '0xd9b67a26') => {
        try {
            return await this.viemClient.readContract({
                address: address as `0x${string}`,
                abi: ERC165ABI,
                functionName: 'supportsInterface',
                args: [interfaceId],
            })
        } catch (err) {
            return false;
        }
    };

    verifyTokenStandard = async ({ contractAddress, expectedStandard }: { contractAddress: string; expectedStandard: "ERC20" | "ERC721" | "ERC1155" }) => {
        switch (expectedStandard) {
            case "ERC20":
                try {
                    const [isERC20, isERC721] = await Promise.all([
                        this.validateERC20(contractAddress),
                        this.validateInterface(contractAddress, ERC721Interface),
                    ]);
                    return isERC20 && !isERC721;
                } catch (err) {
                    return false;
                }
            case "ERC721":
                return await this.validateInterface(contractAddress, ERC721Interface);
            case "ERC1155":
                return await this.validateInterface(contractAddress, ERC1155Interface);
            default:
                return false;
        }
    };


    tokenGetSymbolAndDecimal = async ({ contractAddress, tokenStandard }: { contractAddress: string, tokenStandard: "ERC20" | "ERC721" | "ERC1155" }) => {

        let symbol: string = '';
        let decimals: number = 0;

        try {
            symbol = await this.viemClient.readContract({
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
                decimals = await this.viemClient.readContract({
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


    isValidERC1155TokenId = async ({ contractAddress, tokenId }: {
        contractAddress: string, tokenId: number
    }) => {
        try {
            const uri = await this.viemClient.readContract({
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


    isERC1155TokenFungible = async ({ contractAddress, tokenId }: {
        contractAddress: string, tokenId: number
    }) => {
        try {
            const isFungible = await this.validateInterface(contractAddress, ERC1155MetaDataURIInterface)
            if (isFungible) return true
            return false
        } catch (err) {
            return false;
        }
    }


    calculateBlockFromTimestamp = async (timestamp: string) => {
        const [daterBlock, latestFinalizedBlock] = await Promise.all([
            this.dater.getDate(timestamp, true, false),
            this.provider.getBlock('finalized')
        ]);

        console.log('dater block', daterBlock.block);
        console.log('latest finalized block', latestFinalizedBlock.number);

        // if provided timestamp produces a non-finalized block, use the latest finalized block
        const finalBlock = Math.min(daterBlock.block, latestFinalizedBlock.number);

        return finalBlock;
    }


    computeUserTokenBalance = async ({ token, blockNum, walletAddress }: {
        token: IToken,
        blockNum: number,
        walletAddress: string
    }) => {

        try {
            if (token.type === "ETH") {
                const balance = await this.viemClient.getBalance({ address: walletAddress, blockNumber: blockNum })
                return new Decimal(balance.toString()).div(new Decimal(10).pow(token.decimals))
            }
            else if (token.type === "ERC1155") {
                const balance = await this.viemClient.readContract({
                    address: token.address,
                    abi: ERC1155ABI,
                    functionName: 'balanceOf',
                    args: [walletAddress, token.tokenId],
                    blockNumber: blockNum
                }) as string;

                return new Decimal(balance.toString()).div(new Decimal(10).pow(token.decimals));
            }
            else { // ERC20 / ERC721

                // if nouns token, check delegations
                if (token.address === "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03") {
                    const balance = await this.viemClient.readContract({
                        address: token.address,
                        abi: ERC721ABI,
                        functionName: 'getPriorVotes',
                        args: [walletAddress, blockNum],
                    }) as string;

                    return new Decimal(balance.toString()).div(new Decimal(10).pow(token.decimals));

                }

                // if lil nouns, check delegations

                if (token.address === "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B") {

                    const balance = await this.viemClient.readContract({
                        address: token.address,
                        abi: ERC721ABI,
                        functionName: 'getPriorVotes',
                        args: [walletAddress, blockNum],
                    }) as string;

                    return new Decimal(balance.toString()).div(new Decimal(10).pow(token.decimals));
                }

                const balance = await this.viemClient.readContract({
                    address: token.address,
                    abi: ERC20ABI,
                    functionName: 'balanceOf',
                    args: [walletAddress],
                    blockNumber: blockNum
                }) as string;

                return new Decimal(balance.toString()).div(new Decimal(10).pow(token.decimals));
            }
        } catch (err) {
            console.error(`Failed to fetch user balance for token with err: ${err}`);
            return new Decimal(0);
        }

    }

    zora721TotalSupply = async ({ contractAddress }: { contractAddress: string }) => {
        try {
            const totalSupply = await this.viemClient.readContract({
                address: contractAddress,
                abi: ERC721ABI,
                functionName: 'totalSupply',
                args: [],
            }).then((res: BigInt) => res.toString())
            return totalSupply
        } catch (err) {
            console.log(err)
            console.log('Failed to fetch totalSupply');
            return "0"
        }
    }


}