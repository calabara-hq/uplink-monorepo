import { getTokenInfo } from "@/lib/tokenInfo";
import { ChainId } from "@/types/chains";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useEffect, useState } from "react";
import { isAddress, zeroAddress } from "viem";

export const useTokenInfo = (tokenContract: string, chainId: ChainId) => {
    const [symbol, setSymbol] = useState<string>();
    const [decimals, setDecimals] = useState<number>();
    const [tokenType, setTokenType] = useState<string>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (isAddress(tokenContract) && tokenContract !== zeroAddress && tokenContract !== NATIVE_TOKEN) {
            getTokenInfo({ contractAddress: tokenContract, chainId }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
                setTokenType(res.type);
            })
        }
    }, [tokenContract, chainId])

    return {
        symbol,
        decimals,
        tokenType,
        error,
        isLoading: !error && !symbol && !decimals,
    }


}