import { Address, formatUnits, parseUnits } from "viem";
import { getTokenInfo } from "./tokenInfo";
import { ChainId } from "@/types/chains";

export const parseErc20MintPrice = async (erc20Contract: string, erc20Price: string | bigint, chainId: ChainId): Promise<{ humanReadable: string, contractReadable: bigint }> => {
    if (erc20Price === "0") return { humanReadable: '0', contractReadable: BigInt(0) };

    const token = await getTokenInfo({ contractAddress: erc20Contract as Address, chainId });

    if (!token) {
        throw new Error("Invalid erc20 contract")
    }

    if (typeof erc20Price === "bigint") return {
        /// if the price is already in contract readable format
        humanReadable: formatUnits(erc20Price, token.decimals),
        contractReadable: erc20Price
    }

    else return {
        /// if the price is in human readable format
        humanReadable: erc20Price,
        contractReadable: parseUnits(erc20Price, token.decimals)
    }
}