"use client"
import { getTokenInfo } from "@/lib/tokenInfo";
import { ChainId } from "@/types/chains";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useEffect, useState } from "react";
import { Address, checksumAddress, getAddress, isAddress, zeroAddress } from "viem";
import { useMemo } from "react";

export const useTokenInfo = (tokenContract: string, chainId: ChainId) => {
    const [symbol, setSymbol] = useState<string>();
    const [decimals, setDecimals] = useState<number>();
    const [tokenType, setTokenType] = useState<string>();
    const [error, setError] = useState<string>();

    const checksummedAddress = checksumAddress(tokenContract as Address);

    useMemo(() => {
        if (isAddress(checksummedAddress) && checksummedAddress !== zeroAddress && checksummedAddress !== NATIVE_TOKEN) {
            getTokenInfo({ contractAddress: checksummedAddress, chainId }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
                setTokenType(res.type);
            })
        }
    }, [checksummedAddress, chainId])

    return {
        symbol,
        decimals,
        tokenType,
        error,
        isLoading: !error && !tokenType,
    }


}