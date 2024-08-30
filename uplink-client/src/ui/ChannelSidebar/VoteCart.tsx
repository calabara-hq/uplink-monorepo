"use client"
import { useVoteCart } from "@/hooks/useVoteCart";
import { parseIpfsUrl } from "@/lib/ipfs";
import UplinkImage from "@/lib/UplinkImage";
import { ContractID, ChannelTokenWithUserBalance } from "@/types/channel";
import { HiPhoto, HiPlus, HiSparkles, HiTrash } from "react-icons/hi2";
import { Input } from "../DesignKit/Input";
import WalletConnectButton from "../ConnectButton/WalletConnectButton";
import { useEffect, useMemo } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useFiniteTransportLayerState } from "@/hooks/useFiniteTransportLayerState";
import { useChannel } from "@/hooks/useChannel";
import { RenderStatefulChildAndRemainingTime } from "./SidebarUtils";
import { Button } from "../DesignKit/Button";
import { maxUint64 } from "viem";
import { PiInfinity, PiInfinityBold } from "react-icons/pi";
import { BiInfinite } from "react-icons/bi";

const CartMedia = ({ token }: { token: ChannelTokenWithUserBalance }) => {
    return (
        <div className="relative w-full h-full m-auto p-2">
            <figure className="absolute inset-0 overflow-hidden ">
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
            className="h-full rounded-none rounded-br-lg text-center"
            variant="default"
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
        <div className="flex flex-row w-full h-24 max-h-24 bg-base-200 rounded-xl">
            <div className="flex gap-2 w-[70%] h-24">
                <div className="flex flex-col justify-center w-full p-2">
                    <p className="text-base line-clamp-3 text-t2 font-bold">
                        {proposedVote.metadata.name}
                    </p>
                </div>
                <div className="w-full ">
                    <div className="w-10/12 h-full ">
                        <CartMedia token={proposedVote} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-base-100 w-[30%]">
                <Button
                    //className="btn btn-ghost btn-active w-full ml-auto text-error rounded-none rounded-tr-lg"
                    variant="destructive"
                    className="rounded-none rounded-tr-lg h-[50%]"
                    onClick={() => { removeProposedVote(proposedVote.tokenId) }}
                >
                    <HiTrash className="w-4 h-4" />
                </Button>
                <div className="rounded-br-xl h-[50%]">
                    <ProposedVoteInput proposedVote={proposedVote} updateProposedVote={updateProposedVote} />
                </div>
            </div>
        </div>
    )

}


const VoteButton = ({
    votingPower,
    votesCast,
    votesRemaining,
    contractId,
    submitVotes,
    transactionStatus
}: {
    votingPower: bigint,
    votesCast: bigint,
    votesRemaining: bigint,
    contractId,
    submitVotes: () => void,
    transactionStatus: string
}) => {

    const isTxPending = transactionStatus === "pendingApproval" || transactionStatus === "txInProgress";

    return (
        <div className="w-full p-2 flex flex-col gap-2">

            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-base-200 rounded-lg text-center">
                    <p className="">Votes Cast</p>
                    <p className="text-t2">{votesCast.toString()}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-base-200 rounded-lg text-center">
                    <p className="">Votes Remaining</p>
                    {
                        votesRemaining > maxUint64 ?
                            <BiInfinite className="w-6 h-6 text-t2" />
                            : <p className="text-t2">{votesRemaining.toString()}</p>
                    }
                </div>
            </div>


            <WalletConnectButton>
                <RenderStatefulChildAndRemainingTime contractId={contractId} childStateWindow="voting">
                    <Button size="lg" disabled={isTxPending} onClick={submitVotes}>
                        {isTxPending ? (
                            <div className="flex gap-2 items-center">
                                {transactionStatus === "pendingApproval" && "Pending approval"}
                                {transactionStatus === "txInProgress" && "Casting votes"}
                                <TbLoader2 className="w-4 h-4 text-t2 animate-spin" />
                            </div>
                        )
                            : "Cast votes"
                        }
                    </Button>
                </RenderStatefulChildAndRemainingTime>
            </WalletConnectButton >
        </div >
    );
};


const LockedVoteCard = ({ lockedVote }: { lockedVote: ChannelTokenWithUserBalance }) => {
    return (
        <div className="flex flex-col gap-2 h-20 w-full bg-base-100 rounded-xl p-2 relative text-center">
            <p className="line-clamp-1 text-t2 text-sm font-bold pb-4">
                {lockedVote.metadata.name}
            </p>
            <CartMedia token={lockedVote} />
            <span className="absolute -top-2 -right-2 flex pr-2 pl-2 bg-base-200 rounded-full border border-border">
                <p className="text-t2 text-sm">{lockedVote.balance}</p>
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
            <div className="flex flex-col">
                <h2 className="p-2 font-bold">Already voted</h2>
                <div className="grid grid-cols-3 gap-2 p-2 max-h-[30vh] overflow-y-auto bg-base-300 rounded-lg">
                    {currentHoldings.map((token: ChannelTokenWithUserBalance, idx: number) => (
                        <LockedVoteCard key={idx} lockedVote={token} />
                    ))}
                </div>
            </div>
        )
    }
}

const ProposedVotes = ({ proposedVotes, updateProposedVote, removeProposedVote }) => {
    if (proposedVotes.length > 0) return (
        <div className="flex flex-col">
            <h2 className="font-lg font-bold p-2">In progress</h2>
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
    )
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
        submitVotesTransactionStatus,
        votingPower,
        votesCast,
        votesRemaining
    } = useVoteCart(contractId);

    if (currentHoldings.length === 0 && proposedVotes.length === 0) return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-10"></div>
            <div className="relative flex flex-col items-center justify-center w-full">
                <div className="w-1/4 ml-auto">
                    <HiSparkles className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-center text-t2">No entries selected.</h1>
                <p className="text-center text-t2 px-8">
                    Select entries by hovering a submission and clicking the plus sign
                    in the bottom right corner.
                </p>
                <div className="p-4"></div>
                <div className="w-1/4 mr-auto flex justify-end">
                    <HiSparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="p-4"></div>
            </div>
        </div>
    )
    return (
        <div className="flex flex-col gap-2 animate-fadeIn">
            <LockedVotes currentHoldings={currentHoldings} isLoading={areCurrentHoldingsLoading} />
            <ProposedVotes proposedVotes={proposedVotes} updateProposedVote={updateProposedVote} removeProposedVote={removeProposedVote} />
            <div className="w-full h-0.5 bg-base-200" />
            <VoteButton
                votingPower={votingPower}
                votesCast={votesCast}
                votesRemaining={votesRemaining}
                contractId={contractId}
                submitVotes={submitVotes}
                transactionStatus={submitVotesTransactionStatus}
            />
        </div>
    )

}

const SidebarVote = ({ contractId }: { contractId: ContractID }) => {
    // const { contestState } = useContestState();
    // const voteActions = useVote(contestId)

    return (
        <div className="hidden w-1/3 xl:w-1/4 flex-shrink-0 lg:flex lg:flex-col items-center gap-4 overflow-hidden">
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