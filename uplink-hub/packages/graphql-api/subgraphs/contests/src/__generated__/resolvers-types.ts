import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Decimal: { input: any; output: any; }
  EditorData: { input: any; output: any; }
  ISODateString: { input: any; output: any; }
  IpfsUrl: { input: any; output: any; }
};

export type AdditionalParams = {
  __typename?: 'AdditionalParams';
  anonSubs: Scalars['Boolean']['output'];
  selfVote: Scalars['Boolean']['output'];
  subLimit: Scalars['Int']['output'];
  visibleVotes: Scalars['Boolean']['output'];
};

export type AdditionalParamsInput = {
  anonSubs: Scalars['Boolean']['input'];
  selfVote: Scalars['Boolean']['input'];
  subLimit: Scalars['Int']['input'];
  visibleVotes: Scalars['Boolean']['input'];
};

export type Admin = {
  __typename?: 'Admin';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ArcadeVotingStrategy = {
  __typename?: 'ArcadeVotingStrategy';
  token: Token;
  votingPower: Scalars['String']['output'];
};

export type ArcadeVotingStrategyOption = {
  __typename?: 'ArcadeVotingStrategyOption';
  arcadeVotingStrategy: ArcadeVotingStrategy;
  strategyType: VotingStrategyTypeEnum;
};

export type ConfigureMintBoardResponse = {
  __typename?: 'ConfigureMintBoardResponse';
  success: Scalars['Boolean']['output'];
};

export type Contest = {
  __typename?: 'Contest';
  additionalParams: AdditionalParams;
  chainId: Scalars['Int']['output'];
  created: Scalars['String']['output'];
  deadlines: Deadlines;
  id: Scalars['ID']['output'];
  metadata: Metadata;
  promptUrl: Scalars['IpfsUrl']['output'];
  space: SpaceStub;
  spaceId: Scalars['ID']['output'];
  submitterRestrictions: Array<SubmitterRestriction>;
  submitterRewards: Array<SubmitterReward>;
  tweetId?: Maybe<Scalars['String']['output']>;
  voterRewards: Array<VoterReward>;
  votingPolicy: Array<VotingStrategy>;
};

export enum ContestCategoryEnum {
  Art = 'art',
  Design = 'design',
  Memes = 'memes',
  Music = 'music',
  Other = 'other',
  Photography = 'photography',
  Video = 'video',
  Writing = 'writing'
}

export type ContestMutationResponse = {
  __typename?: 'ContestMutationResponse';
  contestId?: Maybe<Scalars['ID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ContestTweetResponse = {
  __typename?: 'ContestTweetResponse';
  errors?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export enum ContestTypeEnum {
  Standard = 'standard',
  Twitter = 'twitter'
}

export type CreateContestData = {
  additionalParams: AdditionalParamsInput;
  chainId: Scalars['Int']['input'];
  deadlines: DeadlinesInput;
  metadata: MetadataInput;
  prompt: PromptInput;
  submitterRestrictions: Array<SubmitterRestrictionInput>;
  submitterRewards: SubmitterRewardsInput;
  voterRewards: VoterRewardsInput;
  votingPolicy: Array<VotingPolicyInput>;
};

export type Deadlines = {
  __typename?: 'Deadlines';
  endTime: Scalars['ISODateString']['output'];
  snapshot: Scalars['ISODateString']['output'];
  startTime: Scalars['ISODateString']['output'];
  voteTime: Scalars['ISODateString']['output'];
};

export type DeadlinesInput = {
  endTime: Scalars['ISODateString']['input'];
  snapshot: Scalars['ISODateString']['input'];
  startTime: Scalars['ISODateString']['input'];
  voteTime: Scalars['ISODateString']['input'];
};

export type ErcTokenInput = {
  address: Scalars['String']['input'];
  chainId: Scalars['Int']['input'];
  decimals: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['Int']['input']>;
  type: ErcTokenTypeEnum;
};

export enum ErcTokenTypeEnum {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type FungiblePayoutInput = {
  amount: Scalars['String']['input'];
};

export type FungibleReward = {
  __typename?: 'FungibleReward';
  amount: Scalars['String']['output'];
  token: Token;
};

export type Metadata = {
  __typename?: 'Metadata';
  category: ContestCategoryEnum;
  type: ContestTypeEnum;
};

export type MetadataInput = {
  category: ContestCategoryEnum;
  type: ContestTypeEnum;
};

export type MintBoard = {
  __typename?: 'MintBoard';
  boardDescription: Scalars['String']['output'];
  boardTitle: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  created: Scalars['String']['output'];
  description: Scalars['String']['output'];
  editionSize: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  publicSaleEnd: Scalars['String']['output'];
  publicSalePrice: Scalars['String']['output'];
  publicSaleStart: Scalars['String']['output'];
  referrer: Scalars['String']['output'];
  space: SpaceStub;
  spaceId: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
};

export type MintBoardInput = {
  boardDescription: Scalars['String']['input'];
  boardTitle: Scalars['String']['input'];
  chainId: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  editionSize: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  publicSaleEnd: Scalars['String']['input'];
  publicSalePrice: Scalars['String']['input'];
  publicSaleStart: Scalars['String']['input'];
  referrer: Scalars['String']['input'];
  symbol: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  configureMintBoard: ConfigureMintBoardResponse;
  createContest: ContestMutationResponse;
  createContestTweet: ContestTweetResponse;
};


export type MutationConfigureMintBoardArgs = {
  mintBoardData: MintBoardInput;
  spaceName: Scalars['String']['input'];
};


export type MutationCreateContestArgs = {
  contestData: CreateContestData;
  spaceId: Scalars['ID']['input'];
};


export type MutationCreateContestTweetArgs = {
  contestId: Scalars['ID']['input'];
  spaceId: Scalars['ID']['input'];
  tweetThread: Array<ThreadItemInput>;
};

export type NativeTokenInput = {
  chainId: Scalars['Int']['input'];
  decimals: Scalars['Int']['input'];
  symbol: NativeTokenTypeEnum;
  type: NativeTokenTypeEnum;
};

export enum NativeTokenTypeEnum {
  Eth = 'ETH'
}

export type NonFungiblePayoutInput = {
  tokenId: Scalars['Int']['input'];
};

export type NonFungibleReward = {
  __typename?: 'NonFungibleReward';
  token: Token;
  tokenId: Scalars['Int']['output'];
};

export type PayoutInput = {
  ERC20?: InputMaybe<FungiblePayoutInput>;
  ERC721?: InputMaybe<NonFungiblePayoutInput>;
  ERC1155?: InputMaybe<FungiblePayoutInput>;
  ETH?: InputMaybe<FungiblePayoutInput>;
  rank: Scalars['Int']['input'];
};

export type PromptInput = {
  body: Scalars['EditorData']['input'];
  coverUrl?: InputMaybe<Scalars['IpfsUrl']['input']>;
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  activeContests: Array<Contest>;
  contest?: Maybe<Contest>;
  isContestTweetQueued: Scalars['Boolean']['output'];
  mintBoard?: Maybe<MintBoard>;
};


export type QueryContestArgs = {
  contestId: Scalars['ID']['input'];
};


export type QueryIsContestTweetQueuedArgs = {
  contestId: Scalars['ID']['input'];
};


export type QueryMintBoardArgs = {
  spaceName: Scalars['String']['input'];
};

export type RestrictionTokenInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  chainId: Scalars['Int']['input'];
  decimals: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['Int']['input']>;
  type: RestrictionTokenTypeEnum;
};

export enum RestrictionTokenTypeEnum {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Eth = 'ETH'
}

export enum RestrictionType {
  Token = 'token'
}

export type Space = {
  __typename?: 'Space';
  admins: Array<Admin>;
  contests: Array<Contest>;
  id: Scalars['ID']['output'];
};

export type SpaceStub = {
  __typename?: 'SpaceStub';
  id: Scalars['ID']['output'];
};

export type SubmitterRestriction = TokenRestrictionOption;

export type SubmitterRestrictionInput = {
  threshold?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<RestrictionTokenInput>;
};

export type SubmitterReward = {
  __typename?: 'SubmitterReward';
  rank: Scalars['Int']['output'];
  reward: SubmitterRewardOption;
};

export type SubmitterRewardOption = SubmitterTokenReward;

export type SubmitterRewardsInput = {
  ERC20?: InputMaybe<ErcTokenInput>;
  ERC721?: InputMaybe<ErcTokenInput>;
  ERC1155?: InputMaybe<ErcTokenInput>;
  ETH?: InputMaybe<NativeTokenInput>;
  payouts?: InputMaybe<Array<PayoutInput>>;
};

export type SubmitterTokenReward = {
  __typename?: 'SubmitterTokenReward';
  tokenReward: SubmitterTokenRewardOption;
};

export type SubmitterTokenRewardOption = FungibleReward | NonFungibleReward;

export type ThreadItemInput = {
  assetSize?: InputMaybe<Scalars['Int']['input']>;
  assetType?: InputMaybe<Scalars['String']['input']>;
  previewAsset?: InputMaybe<Scalars['IpfsUrl']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  videoAsset?: InputMaybe<Scalars['IpfsUrl']['input']>;
};

export type Token = {
  __typename?: 'Token';
  address?: Maybe<Scalars['String']['output']>;
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  tokenHash: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
};

export type TokenRestriction = {
  __typename?: 'TokenRestriction';
  threshold: Scalars['String']['output'];
  token: Token;
};

export type TokenRestrictionOption = {
  __typename?: 'TokenRestrictionOption';
  restrictionType: RestrictionType;
  tokenRestriction: TokenRestriction;
};

export type VoterReward = {
  __typename?: 'VoterReward';
  rank: Scalars['Int']['output'];
  reward: VoterRewardOption;
};

export type VoterRewardOption = VoterTokenReward;

export type VoterRewardsInput = {
  ERC20?: InputMaybe<ErcTokenInput>;
  ETH?: InputMaybe<NativeTokenInput>;
  payouts?: InputMaybe<Array<PayoutInput>>;
};

export type VoterTokenReward = {
  __typename?: 'VoterTokenReward';
  tokenReward: VoterTokenRewardOption;
};

export type VoterTokenRewardOption = FungibleReward;

export type VotingPolicyInput = {
  strategy: VotingStrategyInput;
  token: RestrictionTokenInput;
};

export type VotingStrategy = ArcadeVotingStrategyOption | WeightedVotingStrategyOption;

export type VotingStrategyInput = {
  type: VotingStrategyTypeEnum;
  votingPower?: InputMaybe<Scalars['String']['input']>;
};

export enum VotingStrategyTypeEnum {
  Arcade = 'arcade',
  Weighted = 'weighted'
}

export type WeightedVotingStrategy = {
  __typename?: 'WeightedVotingStrategy';
  token: Token;
};

export type WeightedVotingStrategyOption = {
  __typename?: 'WeightedVotingStrategyOption';
  strategyType: VotingStrategyTypeEnum;
  weightedVotingStrategy: WeightedVotingStrategy;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  SubmitterRestriction: ( TokenRestrictionOption );
  SubmitterRewardOption: ( Omit<SubmitterTokenReward, 'tokenReward'> & { tokenReward: RefType['SubmitterTokenRewardOption'] } );
  SubmitterTokenRewardOption: ( FungibleReward ) | ( NonFungibleReward );
  VoterRewardOption: ( Omit<VoterTokenReward, 'tokenReward'> & { tokenReward: RefType['VoterTokenRewardOption'] } );
  VoterTokenRewardOption: ( FungibleReward );
  VotingStrategy: ( ArcadeVotingStrategyOption ) | ( WeightedVotingStrategyOption );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AdditionalParams: ResolverTypeWrapper<AdditionalParams>;
  AdditionalParamsInput: AdditionalParamsInput;
  Admin: ResolverTypeWrapper<Admin>;
  ArcadeVotingStrategy: ResolverTypeWrapper<ArcadeVotingStrategy>;
  ArcadeVotingStrategyOption: ResolverTypeWrapper<ArcadeVotingStrategyOption>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ConfigureMintBoardResponse: ResolverTypeWrapper<ConfigureMintBoardResponse>;
  Contest: ResolverTypeWrapper<Omit<Contest, 'submitterRestrictions' | 'votingPolicy'> & { submitterRestrictions: Array<ResolversTypes['SubmitterRestriction']>, votingPolicy: Array<ResolversTypes['VotingStrategy']> }>;
  ContestCategoryEnum: ContestCategoryEnum;
  ContestMutationResponse: ResolverTypeWrapper<ContestMutationResponse>;
  ContestTweetResponse: ResolverTypeWrapper<ContestTweetResponse>;
  ContestTypeEnum: ContestTypeEnum;
  CreateContestData: CreateContestData;
  Deadlines: ResolverTypeWrapper<Deadlines>;
  DeadlinesInput: DeadlinesInput;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  ERCTokenInput: ErcTokenInput;
  ERCTokenTypeEnum: ErcTokenTypeEnum;
  EditorData: ResolverTypeWrapper<Scalars['EditorData']['output']>;
  FungiblePayoutInput: FungiblePayoutInput;
  FungibleReward: ResolverTypeWrapper<FungibleReward>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ISODateString: ResolverTypeWrapper<Scalars['ISODateString']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IpfsUrl: ResolverTypeWrapper<Scalars['IpfsUrl']['output']>;
  Metadata: ResolverTypeWrapper<Metadata>;
  MetadataInput: MetadataInput;
  MintBoard: ResolverTypeWrapper<MintBoard>;
  MintBoardInput: MintBoardInput;
  Mutation: ResolverTypeWrapper<{}>;
  NativeTokenInput: NativeTokenInput;
  NativeTokenTypeEnum: NativeTokenTypeEnum;
  NonFungiblePayoutInput: NonFungiblePayoutInput;
  NonFungibleReward: ResolverTypeWrapper<NonFungibleReward>;
  PayoutInput: PayoutInput;
  PromptInput: PromptInput;
  Query: ResolverTypeWrapper<{}>;
  RestrictionTokenInput: RestrictionTokenInput;
  RestrictionTokenTypeEnum: RestrictionTokenTypeEnum;
  RestrictionType: RestrictionType;
  Space: ResolverTypeWrapper<Space>;
  SpaceStub: ResolverTypeWrapper<SpaceStub>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitterRestriction: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SubmitterRestriction']>;
  SubmitterRestrictionInput: SubmitterRestrictionInput;
  SubmitterReward: ResolverTypeWrapper<Omit<SubmitterReward, 'reward'> & { reward: ResolversTypes['SubmitterRewardOption'] }>;
  SubmitterRewardOption: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SubmitterRewardOption']>;
  SubmitterRewardsInput: SubmitterRewardsInput;
  SubmitterTokenReward: ResolverTypeWrapper<Omit<SubmitterTokenReward, 'tokenReward'> & { tokenReward: ResolversTypes['SubmitterTokenRewardOption'] }>;
  SubmitterTokenRewardOption: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SubmitterTokenRewardOption']>;
  ThreadItemInput: ThreadItemInput;
  Token: ResolverTypeWrapper<Token>;
  TokenRestriction: ResolverTypeWrapper<TokenRestriction>;
  TokenRestrictionOption: ResolverTypeWrapper<TokenRestrictionOption>;
  VoterReward: ResolverTypeWrapper<Omit<VoterReward, 'reward'> & { reward: ResolversTypes['VoterRewardOption'] }>;
  VoterRewardOption: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VoterRewardOption']>;
  VoterRewardsInput: VoterRewardsInput;
  VoterTokenReward: ResolverTypeWrapper<Omit<VoterTokenReward, 'tokenReward'> & { tokenReward: ResolversTypes['VoterTokenRewardOption'] }>;
  VoterTokenRewardOption: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VoterTokenRewardOption']>;
  VotingPolicyInput: VotingPolicyInput;
  VotingStrategy: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VotingStrategy']>;
  VotingStrategyInput: VotingStrategyInput;
  VotingStrategyTypeEnum: VotingStrategyTypeEnum;
  WeightedVotingStrategy: ResolverTypeWrapper<WeightedVotingStrategy>;
  WeightedVotingStrategyOption: ResolverTypeWrapper<WeightedVotingStrategyOption>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AdditionalParams: AdditionalParams;
  AdditionalParamsInput: AdditionalParamsInput;
  Admin: Admin;
  ArcadeVotingStrategy: ArcadeVotingStrategy;
  ArcadeVotingStrategyOption: ArcadeVotingStrategyOption;
  Boolean: Scalars['Boolean']['output'];
  ConfigureMintBoardResponse: ConfigureMintBoardResponse;
  Contest: Omit<Contest, 'submitterRestrictions' | 'votingPolicy'> & { submitterRestrictions: Array<ResolversParentTypes['SubmitterRestriction']>, votingPolicy: Array<ResolversParentTypes['VotingStrategy']> };
  ContestMutationResponse: ContestMutationResponse;
  ContestTweetResponse: ContestTweetResponse;
  CreateContestData: CreateContestData;
  Deadlines: Deadlines;
  DeadlinesInput: DeadlinesInput;
  Decimal: Scalars['Decimal']['output'];
  ERCTokenInput: ErcTokenInput;
  EditorData: Scalars['EditorData']['output'];
  FungiblePayoutInput: FungiblePayoutInput;
  FungibleReward: FungibleReward;
  ID: Scalars['ID']['output'];
  ISODateString: Scalars['ISODateString']['output'];
  Int: Scalars['Int']['output'];
  IpfsUrl: Scalars['IpfsUrl']['output'];
  Metadata: Metadata;
  MetadataInput: MetadataInput;
  MintBoard: MintBoard;
  MintBoardInput: MintBoardInput;
  Mutation: {};
  NativeTokenInput: NativeTokenInput;
  NonFungiblePayoutInput: NonFungiblePayoutInput;
  NonFungibleReward: NonFungibleReward;
  PayoutInput: PayoutInput;
  PromptInput: PromptInput;
  Query: {};
  RestrictionTokenInput: RestrictionTokenInput;
  Space: Space;
  SpaceStub: SpaceStub;
  String: Scalars['String']['output'];
  SubmitterRestriction: ResolversUnionTypes<ResolversParentTypes>['SubmitterRestriction'];
  SubmitterRestrictionInput: SubmitterRestrictionInput;
  SubmitterReward: Omit<SubmitterReward, 'reward'> & { reward: ResolversParentTypes['SubmitterRewardOption'] };
  SubmitterRewardOption: ResolversUnionTypes<ResolversParentTypes>['SubmitterRewardOption'];
  SubmitterRewardsInput: SubmitterRewardsInput;
  SubmitterTokenReward: Omit<SubmitterTokenReward, 'tokenReward'> & { tokenReward: ResolversParentTypes['SubmitterTokenRewardOption'] };
  SubmitterTokenRewardOption: ResolversUnionTypes<ResolversParentTypes>['SubmitterTokenRewardOption'];
  ThreadItemInput: ThreadItemInput;
  Token: Token;
  TokenRestriction: TokenRestriction;
  TokenRestrictionOption: TokenRestrictionOption;
  VoterReward: Omit<VoterReward, 'reward'> & { reward: ResolversParentTypes['VoterRewardOption'] };
  VoterRewardOption: ResolversUnionTypes<ResolversParentTypes>['VoterRewardOption'];
  VoterRewardsInput: VoterRewardsInput;
  VoterTokenReward: Omit<VoterTokenReward, 'tokenReward'> & { tokenReward: ResolversParentTypes['VoterTokenRewardOption'] };
  VoterTokenRewardOption: ResolversUnionTypes<ResolversParentTypes>['VoterTokenRewardOption'];
  VotingPolicyInput: VotingPolicyInput;
  VotingStrategy: ResolversUnionTypes<ResolversParentTypes>['VotingStrategy'];
  VotingStrategyInput: VotingStrategyInput;
  WeightedVotingStrategy: WeightedVotingStrategy;
  WeightedVotingStrategyOption: WeightedVotingStrategyOption;
}>;

export type AdditionalParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdditionalParams'] = ResolversParentTypes['AdditionalParams']> = ResolversObject<{
  anonSubs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  selfVote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subLimit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  visibleVotes?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdminResolvers<ContextType = any, ParentType extends ResolversParentTypes['Admin'] = ResolversParentTypes['Admin']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArcadeVotingStrategyResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArcadeVotingStrategy'] = ResolversParentTypes['ArcadeVotingStrategy']> = ResolversObject<{
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  votingPower?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArcadeVotingStrategyOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArcadeVotingStrategyOption'] = ResolversParentTypes['ArcadeVotingStrategyOption']> = ResolversObject<{
  arcadeVotingStrategy?: Resolver<ResolversTypes['ArcadeVotingStrategy'], ParentType, ContextType>;
  strategyType?: Resolver<ResolversTypes['VotingStrategyTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConfigureMintBoardResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigureMintBoardResponse'] = ResolversParentTypes['ConfigureMintBoardResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contest'] = ResolversParentTypes['Contest']> = ResolversObject<{
  additionalParams?: Resolver<ResolversTypes['AdditionalParams'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deadlines?: Resolver<ResolversTypes['Deadlines'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['Metadata'], ParentType, ContextType>;
  promptUrl?: Resolver<ResolversTypes['IpfsUrl'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['SpaceStub'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submitterRestrictions?: Resolver<Array<ResolversTypes['SubmitterRestriction']>, ParentType, ContextType>;
  submitterRewards?: Resolver<Array<ResolversTypes['SubmitterReward']>, ParentType, ContextType>;
  tweetId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voterRewards?: Resolver<Array<ResolversTypes['VoterReward']>, ParentType, ContextType>;
  votingPolicy?: Resolver<Array<ResolversTypes['VotingStrategy']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContestMutationResponse'] = ResolversParentTypes['ContestMutationResponse']> = ResolversObject<{
  contestId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestTweetResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContestTweetResponse'] = ResolversParentTypes['ContestTweetResponse']> = ResolversObject<{
  errors?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeadlinesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Deadlines'] = ResolversParentTypes['Deadlines']> = ResolversObject<{
  endTime?: Resolver<ResolversTypes['ISODateString'], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes['ISODateString'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['ISODateString'], ParentType, ContextType>;
  voteTime?: Resolver<ResolversTypes['ISODateString'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export interface EditorDataScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EditorData'], any> {
  name: 'EditorData';
}

export type FungibleRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['FungibleReward'] = ResolversParentTypes['FungibleReward']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface IsoDateStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISODateString'], any> {
  name: 'ISODateString';
}

export interface IpfsUrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IpfsUrl'], any> {
  name: 'IpfsUrl';
}

export type MetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']> = ResolversObject<{
  category?: Resolver<ResolversTypes['ContestCategoryEnum'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ContestTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MintBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['MintBoard'] = ResolversParentTypes['MintBoard']> = ResolversObject<{
  boardDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  boardTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  editionSize?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicSaleEnd?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicSalePrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicSaleStart?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referrer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['SpaceStub'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  configureMintBoard?: Resolver<ResolversTypes['ConfigureMintBoardResponse'], ParentType, ContextType, RequireFields<MutationConfigureMintBoardArgs, 'mintBoardData' | 'spaceName'>>;
  createContest?: Resolver<ResolversTypes['ContestMutationResponse'], ParentType, ContextType, RequireFields<MutationCreateContestArgs, 'contestData' | 'spaceId'>>;
  createContestTweet?: Resolver<ResolversTypes['ContestTweetResponse'], ParentType, ContextType, RequireFields<MutationCreateContestTweetArgs, 'contestId' | 'spaceId' | 'tweetThread'>>;
}>;

export type NonFungibleRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['NonFungibleReward'] = ResolversParentTypes['NonFungibleReward']> = ResolversObject<{
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  activeContests?: Resolver<Array<ResolversTypes['Contest']>, ParentType, ContextType>;
  contest?: Resolver<Maybe<ResolversTypes['Contest']>, ParentType, ContextType, RequireFields<QueryContestArgs, 'contestId'>>;
  isContestTweetQueued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIsContestTweetQueuedArgs, 'contestId'>>;
  mintBoard?: Resolver<Maybe<ResolversTypes['MintBoard']>, ParentType, ContextType, RequireFields<QueryMintBoardArgs, 'spaceName'>>;
}>;

export type SpaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Space'] = ResolversParentTypes['Space']> = ResolversObject<{
  admins?: Resolver<Array<ResolversTypes['Admin']>, ParentType, ContextType>;
  contests?: Resolver<Array<ResolversTypes['Contest']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceStubResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceStub'] = ResolversParentTypes['SpaceStub']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmitterRestrictionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterRestriction'] = ResolversParentTypes['SubmitterRestriction']> = ResolversObject<{
  __resolveType: TypeResolveFn<'TokenRestrictionOption', ParentType, ContextType>;
}>;

export type SubmitterRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterReward'] = ResolversParentTypes['SubmitterReward']> = ResolversObject<{
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reward?: Resolver<ResolversTypes['SubmitterRewardOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmitterRewardOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterRewardOption'] = ResolversParentTypes['SubmitterRewardOption']> = ResolversObject<{
  __resolveType: TypeResolveFn<'SubmitterTokenReward', ParentType, ContextType>;
}>;

export type SubmitterTokenRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterTokenReward'] = ResolversParentTypes['SubmitterTokenReward']> = ResolversObject<{
  tokenReward?: Resolver<ResolversTypes['SubmitterTokenRewardOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmitterTokenRewardOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterTokenRewardOption'] = ResolversParentTypes['SubmitterTokenRewardOption']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FungibleReward' | 'NonFungibleReward', ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenRestrictionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenRestriction'] = ResolversParentTypes['TokenRestriction']> = ResolversObject<{
  threshold?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenRestrictionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenRestrictionOption'] = ResolversParentTypes['TokenRestrictionOption']> = ResolversObject<{
  restrictionType?: Resolver<ResolversTypes['RestrictionType'], ParentType, ContextType>;
  tokenRestriction?: Resolver<ResolversTypes['TokenRestriction'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoterRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoterReward'] = ResolversParentTypes['VoterReward']> = ResolversObject<{
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reward?: Resolver<ResolversTypes['VoterRewardOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoterRewardOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoterRewardOption'] = ResolversParentTypes['VoterRewardOption']> = ResolversObject<{
  __resolveType: TypeResolveFn<'VoterTokenReward', ParentType, ContextType>;
}>;

export type VoterTokenRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoterTokenReward'] = ResolversParentTypes['VoterTokenReward']> = ResolversObject<{
  tokenReward?: Resolver<ResolversTypes['VoterTokenRewardOption'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoterTokenRewardOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoterTokenRewardOption'] = ResolversParentTypes['VoterTokenRewardOption']> = ResolversObject<{
  __resolveType: TypeResolveFn<'FungibleReward', ParentType, ContextType>;
}>;

export type VotingStrategyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VotingStrategy'] = ResolversParentTypes['VotingStrategy']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ArcadeVotingStrategyOption' | 'WeightedVotingStrategyOption', ParentType, ContextType>;
}>;

export type WeightedVotingStrategyResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeightedVotingStrategy'] = ResolversParentTypes['WeightedVotingStrategy']> = ResolversObject<{
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WeightedVotingStrategyOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeightedVotingStrategyOption'] = ResolversParentTypes['WeightedVotingStrategyOption']> = ResolversObject<{
  strategyType?: Resolver<ResolversTypes['VotingStrategyTypeEnum'], ParentType, ContextType>;
  weightedVotingStrategy?: Resolver<ResolversTypes['WeightedVotingStrategy'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AdditionalParams?: AdditionalParamsResolvers<ContextType>;
  Admin?: AdminResolvers<ContextType>;
  ArcadeVotingStrategy?: ArcadeVotingStrategyResolvers<ContextType>;
  ArcadeVotingStrategyOption?: ArcadeVotingStrategyOptionResolvers<ContextType>;
  ConfigureMintBoardResponse?: ConfigureMintBoardResponseResolvers<ContextType>;
  Contest?: ContestResolvers<ContextType>;
  ContestMutationResponse?: ContestMutationResponseResolvers<ContextType>;
  ContestTweetResponse?: ContestTweetResponseResolvers<ContextType>;
  Deadlines?: DeadlinesResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  EditorData?: GraphQLScalarType;
  FungibleReward?: FungibleRewardResolvers<ContextType>;
  ISODateString?: GraphQLScalarType;
  IpfsUrl?: GraphQLScalarType;
  Metadata?: MetadataResolvers<ContextType>;
  MintBoard?: MintBoardResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NonFungibleReward?: NonFungibleRewardResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  SpaceStub?: SpaceStubResolvers<ContextType>;
  SubmitterRestriction?: SubmitterRestrictionResolvers<ContextType>;
  SubmitterReward?: SubmitterRewardResolvers<ContextType>;
  SubmitterRewardOption?: SubmitterRewardOptionResolvers<ContextType>;
  SubmitterTokenReward?: SubmitterTokenRewardResolvers<ContextType>;
  SubmitterTokenRewardOption?: SubmitterTokenRewardOptionResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenRestriction?: TokenRestrictionResolvers<ContextType>;
  TokenRestrictionOption?: TokenRestrictionOptionResolvers<ContextType>;
  VoterReward?: VoterRewardResolvers<ContextType>;
  VoterRewardOption?: VoterRewardOptionResolvers<ContextType>;
  VoterTokenReward?: VoterTokenRewardResolvers<ContextType>;
  VoterTokenRewardOption?: VoterTokenRewardOptionResolvers<ContextType>;
  VotingStrategy?: VotingStrategyResolvers<ContextType>;
  WeightedVotingStrategy?: WeightedVotingStrategyResolvers<ContextType>;
  WeightedVotingStrategyOption?: WeightedVotingStrategyOptionResolvers<ContextType>;
}>;

