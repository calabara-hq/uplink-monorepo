import { TokenContractApi } from "@/lib/contract";
import { NATIVE_TOKEN } from "@tx-kit/sdk";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";



export const useErc20TokenInfo = (tokenContract: string, chainId: number) => {
    const tokenApi = new TokenContractApi(chainId);
    const [symbol, setSymbol] = useState<string>("ERC20");
    const [decimals, setDecimals] = useState<number>(18);

    useEffect(() => {
        if (tokenContract !== zeroAddress && tokenContract !== NATIVE_TOKEN) {
            tokenApi.tokenGetSymbolAndDecimal({ contractAddress: tokenContract, tokenStandard: 'ERC20' }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
            })
        }
    }, [tokenContract, chainId])


    return {
        symbol,
        decimals,
        isLoading: symbol === "ERC20" && decimals === 18,
    }
}

export const useErc1155TokenInfo = (tokenContract: string, chainId: number) => {
    const tokenApi = new TokenContractApi(chainId);
    const [symbol, setSymbol] = useState<string>("ERC1155");
    const [decimals, setDecimals] = useState<number>(18);

    useEffect(() => {
        if (tokenContract !== zeroAddress && tokenContract !== NATIVE_TOKEN) {
            tokenApi.tokenGetSymbolAndDecimal({ contractAddress: tokenContract, tokenStandard: 'ERC1155' }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
            })
        }
    }, [tokenContract, chainId])


    return {
        symbol,
        decimals,
        isLoading: symbol === "ERC20" && decimals === 18,
    }
}