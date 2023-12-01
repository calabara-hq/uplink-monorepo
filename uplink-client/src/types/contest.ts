import { IToken } from "./token";
import type { OutputData } from "@editorjs/editorjs";

export type ContestCategory =
  | 'art'
  | 'design'
  | 'memes'
  | 'music'
  | 'other'
  | 'photography'
  | 'video'
  | 'writing'


export type ContestType = "standard" | "twitter"

export type Metadata = {
  category: ContestCategory;
  type: ContestType;
};


type AdditionalParams = {
  anonSubs: boolean;
  selfVote: boolean;
  subLimit: number;
  visibleVotes: boolean;
};

export type Deadlines = {
  startTime: string;
  voteTime: string;
  endTime: string;
  snapshot: string;
}

// sub restrictions

export type TokenRestriction = {
  threshold: string;
  token: IToken;
};

type RestrictionType = "token"

type TokenRestrictionOption = {
  restrictionType: RestrictionType;
  tokenRestriction: TokenRestriction;
}

type SubmitterRestriction = TokenRestrictionOption

export const isTokenSubmitterRestriction = (restriction: SubmitterRestriction): restriction is TokenRestrictionOption => {
  return restriction.restrictionType === 'token';
}

// reward generics 

export type FungibleReward = {
  amount: string;
  token: IToken;
};

export type NonFungibleReward = {
  tokenId: string;
  token: IToken;
};

// sub rewards

export type SubmitterTokenRewardOption = FungibleReward | NonFungibleReward;

type SubmitterTokenReward = {
  tokenReward: SubmitterTokenRewardOption
}

type SubmitterRewardOption = SubmitterTokenReward

type SubmitterReward = {
  rank: number;
  reward: SubmitterRewardOption;
};



export const isFungibleReward = (reward: SubmitterTokenRewardOption): reward is FungibleReward => {
  // If there's no tokenId, then it's a FungibleReward
  return !(reward as NonFungibleReward).tokenId;
}

export const isNonFungibleReward = (reward: SubmitterTokenRewardOption): reward is NonFungibleReward => {
  // If there's no amount, then it's a NonFungibleReward
  return !(reward as FungibleReward).amount;
}

export const isSubmitterTokenReward = (reward: SubmitterRewardOption): reward is SubmitterTokenReward => {
  return Boolean(reward.tokenReward);
}

// voter rewards

type VoterTokenRewardOption = FungibleReward;

type VoterTokenReward = {
  tokenReward: VoterTokenRewardOption;
};

type VoterRewardOption = VoterTokenReward;


type VoterReward = {
  rank: number;
  reward: VoterRewardOption;
};

export const isVoterTokenReward = (reward: VoterRewardOption): reward is VoterTokenReward => {
  return Boolean(reward.tokenReward);
}


// voting policy

type WeightedVotingStrategy = {
  token: IToken;
};

type ArcadeVotingStrategy = {
  token: IToken;
  votingPower: string
};

type VotingStrategyType = 'arcade' | 'weighted';

type WeightedVotingStrategyOption = {
  strategyType: VotingStrategyType;
  weightedVotingStrategy: WeightedVotingStrategy;
};

type ArcadeVotingStrategyOption = {
  strategyType: VotingStrategyType;
  arcadeVotingStrategy: ArcadeVotingStrategy;
};

type VotingStrategy = ArcadeVotingStrategyOption | WeightedVotingStrategyOption;


export const isArcadeVotingStrategy = (votingStrategy: VotingStrategy): votingStrategy is ArcadeVotingStrategyOption => {
  return votingStrategy.strategyType === 'arcade';
}

export const isWeightedVotingStrategy = (votingStrategy: VotingStrategy): votingStrategy is WeightedVotingStrategyOption => {
  return votingStrategy.strategyType === 'weighted';
}

//

export type ContestState = "pending" | "submitting" | "voting" | "closed";

export type ContestPromptData = {
  title: string;
  coverUrl?: string | null;
  body: OutputData;
}

export type ReadableContest = {
  id: string;
  chainId: number;
  spaceId: string;
  created: string;
  promptUrl: string;
  tweetId: string | null;
  metadata: Metadata;
  deadlines: Deadlines;
  additionalParams: AdditionalParams;
  submitterRestrictions: Array<SubmitterRestriction>;
  submitterRewards: Array<SubmitterReward>;
  voterRewards: Array<VoterReward>;
  votingPolicy: Array<VotingStrategy>;
};
