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


export const useTokenInfo = (tokenContract: string, chainId: number) => {
    const tokenApi = new TokenContractApi(chainId);
    const [symbol, setSymbol] = useState<string>();
    const [decimals, setDecimals] = useState<number>();
    const [error, setError] = useState<string>();

    // we don't know if the token is ERC20/ERC721 or ERC1155
    // try to get the symbol and decimals from ERC20, if it fails, try ERC1155

    useEffect(() => {
        if (tokenContract && tokenContract !== zeroAddress && tokenContract !== NATIVE_TOKEN) {
            tokenApi.tokenGetSymbolAndDecimal({ contractAddress: tokenContract, tokenStandard: 'ERC20' }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
            }).catch(() => {
                tokenApi.tokenGetSymbolAndDecimal({ contractAddress: tokenContract, tokenStandard: 'ERC1155' }).then((res) => {
                    setSymbol(res.symbol);
                    setDecimals(res.decimals);
                }).catch(() => {
                    console.log("Failed to get token info")
                    setError("Failed to get token info")
                })
            })
        }
    }, [tokenContract, chainId])

    return {
        symbol,
        decimals,
        error,
        isLoading: !error && !symbol && !decimals,
    }


}