import { IToken } from './token';

export type FungiblePayout = {
    amount: string;
}

export type NonFungiblePayout = {
    tokenId: number | null;
}

export type Deadlines = {
    startTime: string;
    voteTime: string;
    endTime: string;
}

export type Prompt = {
    title: string;
    body: string;
    coverUrl?: string;
}

export type SubmitterRestriction = {
    token?: IToken;
    threshold?: string;
}

export type VotingStrategyType = "arcade" | "weighted";


export type VotingPolicy = {
    token?: IToken;
    strategy?: {
        type: VotingStrategyType;
        votingPower?: string;
        multiplier?: string;
    }
}

export interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts?: IPayout[];
}

export interface VoterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    payouts?: IPayout[];
}

interface IPayout {
    rank: number;
    ETH?: FungiblePayout;
    ERC20?: FungiblePayout;
    ERC721?: NonFungiblePayout;
    ERC1155?: FungiblePayout;
}

export interface SubmitterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    ERC721?: IToken;
    ERC1155?: IToken;
    payouts?: IPayout[];
}

export interface VoterRewards {
    ETH?: IToken;
    ERC20?: IToken;
    payouts?: IPayout[];
}


export interface ContestBuilderProps {
    type: string;
    deadlines: Deadlines;
    prompt: Prompt;
    submitterRewards: SubmitterRewards;
    voterRewards: VoterRewards;
    submitterRestrictions: SubmitterRestriction[] | [];
    votingPolicy: VotingPolicy[] | [];
}