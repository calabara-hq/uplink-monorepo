"use client"
import { useVoteCart } from "@/hooks/useVoteCart";
import { parseIpfsUrl } from "@/lib/ipfs";
import UplinkImage from "@/lib/UplinkImage";
import { ContractID, ChannelTokenWithUserBalance } from "@/types/channel";
import { HiTrash } from "react-icons/hi2";
import { Input } from "../DesignKit/Input";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { useEffect, useMemo } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { useChannel } from "@/hooks/useChannel";
import { RenderStatefulChildAndRemainingTime } from "./SidebarUtils";

const CartMedia = ({ token }: { token: ChannelTokenWithUserBalance }) => {
    return (
        <div className="relative w-full h-full m-auto p-2">
            <figure className="absolute inset-0 overflow-hidden">
                <UplinkImage
                    src={parseIpfsUrl(token.metadata.image).gateway}
                    alt="token media"
                    fill
                    className="object-contain aspect-square m-auto"
                    sizes="30vw"
                />
            </figure>
        </div>
    );
};

const ProposedVoteInput = ({
    proposedVote,
    updateProposedVote
}: {
    proposedVote: ChannelTokenWithUserBalance;
    updateProposedVote: (tokenId: string, votes: string) => void;
}) => {
    if (proposedVote.metadata.image) return (
        <Input
            type="number"
            placeholder="votes"
            // className="input input-bordered rounded-none rounded-br-lg focus:ring-transparent text-center w-full text-sm bg-base-200 "
            className="h-full rounded-none rounded-br-lg bg-base-100 ring-inset ring-base-200 border border-border text-center"
            variant="outline"
            value={proposedVote.balance}
            onWheel={(e: React.WheelEvent<HTMLElement>) => {
                (e.target as HTMLElement).blur();
            }}
            onChange={(e) => { updateProposedVote(proposedVote.tokenId, e.target.value) }
            }
        />
    );

    return <div /> // return an empty div if no image
};

const ProposedVoteCard = ({ proposedVote, updateProposedVote, removeProposedVote }) => {

    return (
        <div className="grid grid-cols-[70%_30%] w-full h-24 max-h-24 bg-base-100 rounded-xl">
            <div className="flex gap-2">
                <div className="flex flex-col justify-center w-full p-2">
                    <p className="text-base line-clamp-3 text-t2 font-bold">
                        {proposedVote.metadata.name}
                    </p>
                </div>
                <CartMedia token={proposedVote} />
            </div>
            <div className="grid grid-rows-[49.5%_1%_49.5%] bg-base">
                <button
                    className="btn btn-ghost btn-active w-full ml-auto text-error rounded-none rounded-tr-lg"
                    onClick={() => { removeProposedVote(proposedVote.tokenId) }}
                >
                    <HiTrash className="w-4 h-4" />
                </button>
                <div className="h-0.5 bg-black w-full rounded-lg" />
                <div className="rounded-br-xl">
                    <ProposedVoteInput proposedVote={proposedVote} updateProposedVote={updateProposedVote} />
                </div>
            </div>
        </div>
    )

}

const RenderStateRemainingTime = ({ contractId }: { contractId: ContractID }) => {
    const { stateRemainingTime } = useFiniteTransportLayerState(contractId);

    return (
        <div className="bg-base-100 h-full rounded-xl p-2 flex items-center justify-center">
            <p className="text-center text-t1 ">{stateRemainingTime}</p>
        </div>
    );
}

const VoteButton = ({ contractId, submitVotes, transactionStatus }: { contractId, submitVotes: () => void, transactionStatus: string }) => {

    const isTxPending = transactionStatus === "pendingApproval" || transactionStatus === "txInProgress";

    return (
        <div className="w-full p-2 ">
            <WalletConnectButton>
                <RenderStatefulChildAndRemainingTime contractId={contractId} childStateWindow="voting">
                    <button className="btn btn-primary w-full normal-case" disabled={isTxPending} onClick={submitVotes}>
                        {isTxPending ? (
                            <div className="flex gap-2 items-center">
                                {transactionStatus === "pendingApproval" && "Pending approval"}
                                {transactionStatus === "txInProgress" && "Casting votes"}
                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                            </div>
                        )
                            : "Cast votes"
                        }
                    </button>
                </RenderStatefulChildAndRemainingTime>
            </WalletConnectButton >
        </div >
    );
};


const LockedVoteCard = ({ lockedVote }: { lockedVote: ChannelTokenWithUserBalance }) => {
    return (
        <div className="flex flex-col gap-2 h-20 w-full bg-base-100 rounded-xl p-2 relative text-center">
            <p className="text-base text-t2 font-bold">
                {lockedVote.metadata.name}
            </p>
            <CartMedia token={lockedVote} />
            <span className="absolute -top-2 -right-2 badge badge-sm bg-base-200 rounded-full ">
                <p className="">{lockedVote.balance}</p>
            </span>
        </div>
    )
}


const LockedVotes = ({ currentHoldings, isLoading }: { currentHoldings: Array<ChannelTokenWithUserBalance>, isLoading: boolean }) => {

    if (isLoading)
        return (
            <div className="grid grid-cols-3 gap-2 p-2 max-h-[30vh] overflow-y-auto">
                <div className="bg-base-200 w-full h-20 shimmer rounded-xl" />
                <div className="bg-base-200 w-full h-20 shimmer rounded-xl" />
                <div className="bg-base-200 w-full h-20 shimmer rounded-xl" />
            </div>
        )

    if (currentHoldings.length > 0) {
        return (
            <div className="grid grid-cols-3 gap-2 p-2 max-h-[30vh] overflow-y-auto">
                {currentHoldings.map((token: ChannelTokenWithUserBalance, idx: number) => (
                    <LockedVoteCard key={idx} lockedVote={token} />
                ))}
            </div>
        )
    }
}


export const VoteCart = ({ contractId }: { contractId: ContractID }) => {
    const {
        proposedVotes,
        currentHoldings,
        areCurrentHoldingsLoading,
        addProposedVote,
        removeProposedVote,
        updateProposedVote,
        submitVotes,
        submitVotesTransactionStatus
    } = useVoteCart(contractId);

    return (
        <div className="flex flex-col gap-2">

            <LockedVotes currentHoldings={currentHoldings} isLoading={areCurrentHoldingsLoading} />

            {proposedVotes.length > 0 && (
                <div>
                    {/* {currentHoldings.length > 0 && (
                        <div className="flex flex-row w-full justify-start items-center p-2 text-t2">
                        <p className="">+ Your proposed additions</p>
                        </div>
                    )} */}
                    <div className="flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto">
                        {proposedVotes.map((proposedVote: ChannelTokenWithUserBalance, idx: number) => (
                            <ProposedVoteCard
                                key={idx}
                                proposedVote={proposedVote}
                                updateProposedVote={updateProposedVote}
                                removeProposedVote={removeProposedVote}
                            />
                        ))}
                    </div>
                </div>
            )}
            <VoteButton contractId={contractId} submitVotes={submitVotes} transactionStatus={submitVotesTransactionStatus} />
        </div>
    )

}

const SidebarVote = ({ contractId }: { contractId: ContractID }) => {
    // const { contestState } = useContestState();
    // const voteActions = useVote(contestId)

    return (
        <div className="hidden w-1/3 xl:w-1/4 flex-shrink-0 lg:flex lg:flex-col items-center gap-4">
            <div className="sticky top-3 right-0 flex flex-col justify-center gap-4 w-full rounded-xl mt-2">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="text-t1 text-lg font-semibold">My Selections </h2>
                    {/* {voteActions.proposedVotes.length > 0 && (
                        <span className="badge badge-sm text-sm badge-warning font-bold">
                        {voteActions.proposedVotes.length}
                        </span>
                    )} */}
                </div>
                <div className="flex flex-col bg-transparent border-2 border-border rounded-lg w-full h-full ">
                    <VoteCart contractId={contractId} />
                </div>
            </div>
        </div>
    );


};

export default SidebarVote;