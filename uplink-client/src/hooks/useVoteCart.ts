
import { ChannelTokenWithUserBalance, ContractID, splitContractID } from "@/types/channel";
import { useWalletClient } from "wagmi";
import { useSessionStorage } from "./useSessionStorage";
import { ChannelToken } from "@/types/channel";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import useSWR from "swr";
import { Address } from "viem";
import { handleV2Error } from "@/lib/fetch/handleV2Errors";
import { useMintTokenBatchWithETH } from "@tx-kit/hooks";
import { useChannel } from "./useChannel";
import toast from "react-hot-toast";
import { useTransmissionsErrorHandler } from "./useTransmissionsErrorHandler";
/**
 * requirements
 * cast votes are displayed
 * cast votes can not be removed
 * proposed votes can be added -- done
 * proposed votes can be removed -- done
 * proposed votes accept vote inputs -- done
 * cast proposed votes
 * get votes cast for a user
 */


type PageInfo = {
    endCursor: number;
    hasNextPage: boolean;
}

type FetchUserChannelTokenHoldingsResponse = {
    data: Array<ChannelTokenWithUserBalance>
    pageInfo: PageInfo
}

const fetchUserChannelTokenHoldings = async (userAddress: Address, contractId: ContractID, pageSize: number, skip: number): Promise<FetchUserChannelTokenHoldingsResponse> => {
    const { chainId, contractAddress } = splitContractID(contractId);

    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/v2/userOwnedTokens?userAddress=${userAddress}&contractAddress=${contractAddress}&chainId=${chainId}&pageSize=${pageSize}&skip=${skip}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(handleV2Error)

    return data;
}

const useUserChannelTokenHoldings = (userAddress: Address | undefined, contractId: ContractID, refreshInterval?: number) => {
    const swrKey = userAddress
        ? [`/swrUserChannelTokenHoldings/${contractId}`, userAddress]
        : null;

    const {
        data: currentHoldings,
        isLoading = true,
        error,
        mutate,
    }: { data: FetchUserChannelTokenHoldingsResponse; isLoading: boolean; error: any; mutate: any } = useSWR(
        swrKey,
        () => fetchUserChannelTokenHoldings(userAddress, contractId, 50, 0),
        { refreshInterval: refreshInterval ?? 0 }
    );

    return {
        currentHoldings: currentHoldings?.data ?? [],
        isLoading,
        error,
        mutate
    }
}

export const useVoteCart = (contractId: ContractID) => {
    const { data: walletClient } = useWalletClient();

    const [proposedVotes, setProposedVotes] = useLocalStorage<Array<ChannelTokenWithUserBalance>>(`proposedVotes-${contractId.toLowerCase()}`, []);
    const { currentHoldings, isLoading, mutate: mutateCurrentHoldings } = useUserChannelTokenHoldings(walletClient?.account.address, contractId);
    const { mintTokenBatchWithETH, status: ethTxStatus, txHash: ethTxHash, error: ethTxError } = useMintTokenBatchWithETH()

    const { contractAddress, chainId } = splitContractID(contractId);
    const { channel } = useChannel(contractId);

    useTransmissionsErrorHandler(ethTxError);

    useEffect(() => {
        console.log(ethTxError)
    }, [ethTxError])

    useEffect(() => {
        if (ethTxStatus === "complete") {
            setProposedVotes([])
            mutateCurrentHoldings()
            toast.success("Votes cast successfully")
        }
    }, [ethTxStatus])

    const addProposedVote = useCallback((token: ChannelToken) => {
        const proposedVote = { ...token, balance: '' };
        if (proposedVotes.some((proposedVote) => proposedVote.tokenId === token.tokenId)) return; // prevent duplicates
        setProposedVotes([...proposedVotes, proposedVote]);
    }, [proposedVotes, setProposedVotes]);


    const removeProposedVote = useCallback((toRemoveTokenId: string) => {
        setProposedVotes(proposedVotes.filter((proposedVote) => proposedVote.tokenId !== toRemoveTokenId));
    }, [proposedVotes, setProposedVotes]);

    const updateProposedVote = useCallback((toUpdateTokenId: string, userVotes: string) => {
        const updatedProposedVotes = proposedVotes.map((proposedVote) => {
            if (proposedVote.tokenId === toUpdateTokenId) {
                return { ...proposedVote, balance: userVotes };
            }
            return proposedVote;
        });
        setProposedVotes(updatedProposedVotes);
    }, [proposedVotes, setProposedVotes]);


    const submitVotes = useCallback(async () => {

        const toMintTokenIds = proposedVotes.map((proposedVote) => BigInt(proposedVote.tokenId));
        const toMintTokenBalances = proposedVotes.map((proposedVote) => BigInt(proposedVote.balance));

        const totalQuantity = toMintTokenBalances.reduce((acc, balance) => acc + balance, BigInt(0));
        const totalValueRequired = channel.fees ? totalQuantity * BigInt(channel.fees.fees.ethMintPrice) : null;


        await mintTokenBatchWithETH({
            channelAddress: contractAddress,
            to: walletClient.account.address,
            tokenIds: toMintTokenIds,
            amounts: toMintTokenBalances,
            mintReferral: chainId === 8453 ? "0x81c13C64B8742270b993b3E08eD8aFA9501180a2" : "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C",
            data: "",
            ...(totalValueRequired ? { transactionOverrides: { value: totalValueRequired } } : {})
        })
    }, [channel, walletClient, proposedVotes, mintTokenBatchWithETH])

    const isTokenAlreadyProposed = useCallback((token: ChannelToken) => {
        return proposedVotes.some((proposedVote) => proposedVote.tokenId === token.tokenId);
    }, [proposedVotes]);

    return {
        proposedVotes,
        currentHoldings,
        areCurrentHoldingsLoading: isLoading,
        addProposedVote,
        removeProposedVote,
        updateProposedVote,
        submitVotes,
        submitVotesTransactionStatus: ethTxStatus,
        isTokenAlreadyProposed
    }

}