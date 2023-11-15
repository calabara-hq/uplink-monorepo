import { createWeb3Client } from './viem';
import ERC20ABI from '@/lib/abi/erc20ABI.json';
import ERC721ABI from '@/lib/abi/erc721ABI.json';
import ERC1155ABI from '@/lib/abi/erc1155ABI.json';
import ERC165ABI from '@/lib/abi/erc165ABI.json';


const ERC721Interface = '0x80ac58cd';
const ERC1155Interface = '0xd9b67a26';


export class TokenContractApi {
    private web3: any;
    constructor(chainId: number) {
        this.web3 = createWeb3Client(chainId);
    }

    public async validateERC20(address: string) {
        try {
            await this.web3.readContract({
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

    public async validateInterface(address: string, interfaceId: '0x80ac58cd' | '0xd9b67a26') {
        try {
            return await this.web3.readContract({
                address: address as `0x${string}`,
                abi: ERC165ABI,
                functionName: 'supportsInterface',
                args: [interfaceId],
            })
        } catch (err) {
            return false;
        }
    };

    public async verifyTokenStandard({ contractAddress, expectedStandard }: { contractAddress: string; expectedStandard: "ERC20" | "ERC721" | "ERC1155" }) {
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

    public async tokenGetSymbolAndDecimal({ contractAddress, tokenStandard }: { contractAddress: string, tokenStandard: "ERC20" | "ERC721" | "ERC1155" }) {

        let symbol: string = '';
        let decimals: number = 0;

        try {
            symbol = await this.web3.readContract({
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
                decimals = await this.web3.readContract({
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

    public async tokenGetTotalSupply({ contractAddress }: { contractAddress: string }) {
        let totalSupply: string = '0';
        try {
            totalSupply = await this.web3.readContract({
                address: contractAddress,
                abi: ERC721ABI,
                functionName: 'totalSupply',
                args: [],
            }) as string;
        } catch (err) {
            console.log(err)
            console.log('Failed to fetch totalSupply');
        }

        return totalSupply;
    }

    public async isValidERC1155TokenId({ contractAddress, tokenId }: {
        contractAddress: string, tokenId: number
    }) {
        try {
            const uri = await this.web3.readContract({
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

}
