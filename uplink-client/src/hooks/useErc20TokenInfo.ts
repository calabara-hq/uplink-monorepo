import { TokenContractApi } from "@/lib/contract";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";



export const useErc20TokenInfo = (tokenContract: string, chainId: number) => {
    const tokenApi = new TokenContractApi(chainId);
    const [symbol, setSymbol] = useState<string>("ERC20");
    const [decimals, setDecimals] = useState<number>(18);

    useEffect(() => {
        if (tokenContract !== zeroAddress) {
            tokenApi.tokenGetSymbolAndDecimal({ contractAddress: tokenContract, tokenStandard: 'ERC20' }).then((res) => {
                setSymbol(res.symbol);
                setDecimals(res.decimals);
            })
        }
    }, [tokenContract, chainId])


    return { symbol, decimals }
}