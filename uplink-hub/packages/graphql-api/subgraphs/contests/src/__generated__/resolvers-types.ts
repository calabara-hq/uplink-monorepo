import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  anonSubs: Scalars['Boolean']['input'];
  selfVote: Scalars['Boolean']['input'];
  subLimit: Scalars['Int']['input'];
  visibleVotes: Scalars['Boolean']['input'];
};

export type AdditionalParamsType = {
  __typename?: 'AdditionalParamsType';
  anonSubs: Scalars['Boolean']['output'];
  selfVote: Scalars['Boolean']['output'];
  subLimit: Scalars['Int']['output'];
  visibleVotes: Scalars['Boolean']['output'];
};

export type Admin = {
  __typename?: 'Admin';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ArcadeVotingStrategyType = {
  __typename?: 'ArcadeVotingStrategyType';
  token?: Maybe<TokenType>;
  votingPower?: Maybe<Scalars['Decimal']['output']>;
};

export type Contest = {
  __typename?: 'Contest';
  additionalParams: AdditionalParamsType;
  created: Scalars['String']['output'];
  deadlines: DeadlinesType;
  id: Scalars['ID']['output'];
  metadata: MetadataType;
  promptUrl: Scalars['IpfsUrl']['output'];
  space: SpaceStub;
  spaceId: Scalars['ID']['output'];
  submitterRestrictions: Array<SubmitterRestrictionType>;
  submitterRewards: Array<RewardType>;
  tweetId?: Maybe<Scalars['String']['output']>;
  voterRewards: Array<RewardType>;
  votingPolicy: Array<VotingPolicyType>;
};

export type ContestBuilderProps = {
  additionalParams: AdditionalParams;
  deadlines: Deadlines;
  metadata: Metadata;
  prompt: Prompt;
  submitterRestrictions: Array<SubmitterRestriction>;
  submitterRewards: SubmitterRewards;
  voterRewards: VoterRewards;
  votingPolicy: Array<VotingPolicy>;
};

export type ContestErrorData = {
  __typename?: 'ContestErrorData';
  additionalParams?: Maybe<Scalars['String']['output']>;
  deadlines?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  prompt?: Maybe<Scalars['String']['output']>;
  submitterRestrictions?: Maybe<Scalars['String']['output']>;
  submitterRewards?: Maybe<Scalars['String']['output']>;
  voterRewards?: Maybe<Scalars['String']['output']>;
  votingPolicy?: Maybe<Scalars['String']['output']>;
};

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

export enum ContestType {
  Standard = 'standard',
  Twitter = 'twitter'
}

export type Deadlines = {
  endTime: Scalars['ISODateString']['input'];
  snapshot: Scalars['ISODateString']['input'];
  startTime: Scalars['ISODateString']['input'];
  voteTime: Scalars['ISODateString']['input'];
};

export type DeadlinesType = {
  __typename?: 'DeadlinesType';
  endTime: Scalars['String']['output'];
  snapshot: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  voteTime: Scalars['String']['output'];
};

export enum ErcTokenType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type FungiblePayout = {
  amount: Scalars['Decimal']['input'];
};

export type IercToken = {
  address: Scalars['String']['input'];
  decimals: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['Int']['input']>;
  type: ErcTokenType;
};

export type INativeToken = {
  decimals: Scalars['Int']['input'];
  symbol: NativeTokenType;
  type: NativeTokenType;
};

export type IPayout = {
  ERC20?: InputMaybe<FungiblePayout>;
  ERC721?: InputMaybe<NonFungiblePayout>;
  ERC1155?: InputMaybe<FungiblePayout>;
  ETH?: InputMaybe<FungiblePayout>;
  rank: Scalars['Int']['input'];
};

export type Metadata = {
  category: Scalars['String']['input'];
  type: ContestType;
};

export type MetadataType = {
  __typename?: 'MetadataType';
  category: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createContest: ContestMutationResponse;
  createContestTweet: ContestTweetResponse;
};


export type MutationCreateContestArgs = {
  contestData: ContestBuilderProps;
  spaceId: Scalars['ID']['input'];
};


export type MutationCreateContestTweetArgs = {
  contestId: Scalars['ID']['input'];
  spaceId: Scalars['ID']['input'];
  tweetThread: Array<ThreadItem>;
};

export enum NativeTokenType {
  Eth = 'ETH'
}

export type NonFungiblePayout = {
  tokenId: Scalars['Int']['input'];
};

export type Prompt = {
  body: Scalars['EditorData']['input'];
  coverUrl?: InputMaybe<Scalars['IpfsUrl']['input']>;
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  activeContests: Array<Contest>;
  contest?: Maybe<Contest>;
  isContestTweetQueued: Scalars['Boolean']['output'];
};


export type QueryContestArgs = {
  contestId: Scalars['ID']['input'];
};


export type QueryIsContestTweetQueuedArgs = {
  contestId: Scalars['ID']['input'];
};

export type RestrictionToken = {
  address?: InputMaybe<Scalars['String']['input']>;
  decimals: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['Int']['input']>;
  type: RestrictionTokenType;
};

export enum RestrictionTokenType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Eth = 'ETH'
}

export type RewardType = {
  __typename?: 'RewardType';
  rank: Scalars['Int']['output'];
  tokenReward: TokenRewardType;
};

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

export type SubmitterRestriction = {
  threshold?: InputMaybe<Scalars['Decimal']['input']>;
  token?: InputMaybe<RestrictionToken>;
};

export type SubmitterRestrictionType = {
  __typename?: 'SubmitterRestrictionType';
  restrictionType: Scalars['String']['output'];
  tokenRestriction: TokenRestrictionType;
};

export type SubmitterRewards = {
  ERC20?: InputMaybe<IercToken>;
  ERC721?: InputMaybe<IercToken>;
  ERC1155?: InputMaybe<IercToken>;
  ETH?: InputMaybe<INativeToken>;
  payouts?: InputMaybe<Array<IPayout>>;
};

export type ThreadItem = {
  assetSize?: InputMaybe<Scalars['String']['input']>;
  assetType?: InputMaybe<Scalars['String']['input']>;
  previewAsset?: InputMaybe<Scalars['IpfsUrl']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  videoAsset?: InputMaybe<Scalars['IpfsUrl']['input']>;
};

export type TokenRestrictionType = {
  __typename?: 'TokenRestrictionType';
  threshold: Scalars['Decimal']['output'];
  token: TokenType;
};

export type TokenRewardType = {
  __typename?: 'TokenRewardType';
  amount?: Maybe<Scalars['Decimal']['output']>;
  token: TokenType;
};

export type TokenType = {
  __typename?: 'TokenType';
  address?: Maybe<Scalars['String']['output']>;
  decimals: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  tokenHash: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
};

export type VoterRewards = {
  ERC20?: InputMaybe<IercToken>;
  ETH?: InputMaybe<INativeToken>;
  payouts?: InputMaybe<Array<IPayout>>;
};

export type VotingPolicy = {
  strategy: VotingStrategy;
  token: RestrictionToken;
};

export type VotingPolicyType = {
  __typename?: 'VotingPolicyType';
  arcadeVotingStrategy?: Maybe<ArcadeVotingStrategyType>;
  strategyType: VotingStrategyType;
  weightedVotingStrategy?: Maybe<WeightedVotingStrategyType>;
};

export type VotingStrategy = {
  type: VotingStrategyType;
  votingPower?: InputMaybe<Scalars['Decimal']['input']>;
};

export enum VotingStrategyType {
  Arcade = 'arcade',
  Weighted = 'weighted'
}

export type WeightedVotingStrategyType = {
  __typename?: 'WeightedVotingStrategyType';
  token?: Maybe<TokenType>;
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



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AdditionalParams: AdditionalParams;
  AdditionalParamsType: ResolverTypeWrapper<AdditionalParamsType>;
  Admin: ResolverTypeWrapper<Admin>;
  ArcadeVotingStrategyType: ResolverTypeWrapper<ArcadeVotingStrategyType>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contest: ResolverTypeWrapper<Contest>;
  ContestBuilderProps: ContestBuilderProps;
  ContestErrorData: ResolverTypeWrapper<ContestErrorData>;
  ContestMutationResponse: ResolverTypeWrapper<ContestMutationResponse>;
  ContestTweetResponse: ResolverTypeWrapper<ContestTweetResponse>;
  ContestType: ContestType;
  Deadlines: Deadlines;
  DeadlinesType: ResolverTypeWrapper<DeadlinesType>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  ERCTokenType: ErcTokenType;
  EditorData: ResolverTypeWrapper<Scalars['EditorData']['output']>;
  FungiblePayout: FungiblePayout;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IERCToken: IercToken;
  INativeToken: INativeToken;
  IPayout: IPayout;
  ISODateString: ResolverTypeWrapper<Scalars['ISODateString']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IpfsUrl: ResolverTypeWrapper<Scalars['IpfsUrl']['output']>;
  Metadata: Metadata;
  MetadataType: ResolverTypeWrapper<MetadataType>;
  Mutation: ResolverTypeWrapper<{}>;
  NativeTokenType: NativeTokenType;
  NonFungiblePayout: NonFungiblePayout;
  Prompt: Prompt;
  Query: ResolverTypeWrapper<{}>;
  RestrictionToken: RestrictionToken;
  RestrictionTokenType: RestrictionTokenType;
  RewardType: ResolverTypeWrapper<RewardType>;
  Space: ResolverTypeWrapper<Space>;
  SpaceStub: ResolverTypeWrapper<SpaceStub>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubmitterRestriction: SubmitterRestriction;
  SubmitterRestrictionType: ResolverTypeWrapper<SubmitterRestrictionType>;
  SubmitterRewards: SubmitterRewards;
  ThreadItem: ThreadItem;
  TokenRestrictionType: ResolverTypeWrapper<TokenRestrictionType>;
  TokenRewardType: ResolverTypeWrapper<TokenRewardType>;
  TokenType: ResolverTypeWrapper<TokenType>;
  VoterRewards: VoterRewards;
  VotingPolicy: VotingPolicy;
  VotingPolicyType: ResolverTypeWrapper<VotingPolicyType>;
  VotingStrategy: VotingStrategy;
  VotingStrategyType: VotingStrategyType;
  WeightedVotingStrategyType: ResolverTypeWrapper<WeightedVotingStrategyType>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AdditionalParams: AdditionalParams;
  AdditionalParamsType: AdditionalParamsType;
  Admin: Admin;
  ArcadeVotingStrategyType: ArcadeVotingStrategyType;
  Boolean: Scalars['Boolean']['output'];
  Contest: Contest;
  ContestBuilderProps: ContestBuilderProps;
  ContestErrorData: ContestErrorData;
  ContestMutationResponse: ContestMutationResponse;
  ContestTweetResponse: ContestTweetResponse;
  Deadlines: Deadlines;
  DeadlinesType: DeadlinesType;
  Decimal: Scalars['Decimal']['output'];
  EditorData: Scalars['EditorData']['output'];
  FungiblePayout: FungiblePayout;
  ID: Scalars['ID']['output'];
  IERCToken: IercToken;
  INativeToken: INativeToken;
  IPayout: IPayout;
  ISODateString: Scalars['ISODateString']['output'];
  Int: Scalars['Int']['output'];
  IpfsUrl: Scalars['IpfsUrl']['output'];
  Metadata: Metadata;
  MetadataType: MetadataType;
  Mutation: {};
  NonFungiblePayout: NonFungiblePayout;
  Prompt: Prompt;
  Query: {};
  RestrictionToken: RestrictionToken;
  RewardType: RewardType;
  Space: Space;
  SpaceStub: SpaceStub;
  String: Scalars['String']['output'];
  SubmitterRestriction: SubmitterRestriction;
  SubmitterRestrictionType: SubmitterRestrictionType;
  SubmitterRewards: SubmitterRewards;
  ThreadItem: ThreadItem;
  TokenRestrictionType: TokenRestrictionType;
  TokenRewardType: TokenRewardType;
  TokenType: TokenType;
  VoterRewards: VoterRewards;
  VotingPolicy: VotingPolicy;
  VotingPolicyType: VotingPolicyType;
  VotingStrategy: VotingStrategy;
  WeightedVotingStrategyType: WeightedVotingStrategyType;
}>;

export type AdditionalParamsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdditionalParamsType'] = ResolversParentTypes['AdditionalParamsType']> = ResolversObject<{
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

export type ArcadeVotingStrategyTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArcadeVotingStrategyType'] = ResolversParentTypes['ArcadeVotingStrategyType']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['TokenType']>, ParentType, ContextType>;
  votingPower?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contest'] = ResolversParentTypes['Contest']> = ResolversObject<{
  additionalParams?: Resolver<ResolversTypes['AdditionalParamsType'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deadlines?: Resolver<ResolversTypes['DeadlinesType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['MetadataType'], ParentType, ContextType>;
  promptUrl?: Resolver<ResolversTypes['IpfsUrl'], ParentType, ContextType>;
  space?: Resolver<ResolversTypes['SpaceStub'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submitterRestrictions?: Resolver<Array<ResolversTypes['SubmitterRestrictionType']>, ParentType, ContextType>;
  submitterRewards?: Resolver<Array<ResolversTypes['RewardType']>, ParentType, ContextType>;
  tweetId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voterRewards?: Resolver<Array<ResolversTypes['RewardType']>, ParentType, ContextType>;
  votingPolicy?: Resolver<Array<ResolversTypes['VotingPolicyType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestErrorDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContestErrorData'] = ResolversParentTypes['ContestErrorData']> = ResolversObject<{
  additionalParams?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deadlines?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prompt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submitterRestrictions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submitterRewards?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voterRewards?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  votingPolicy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type DeadlinesTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeadlinesType'] = ResolversParentTypes['DeadlinesType']> = ResolversObject<{
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  snapshot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  voteTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
  name: 'Decimal';
}

export interface EditorDataScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EditorData'], any> {
  name: 'EditorData';
}

export interface IsoDateStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISODateString'], any> {
  name: 'ISODateString';
}

export interface IpfsUrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IpfsUrl'], any> {
  name: 'IpfsUrl';
}

export type MetadataTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MetadataType'] = ResolversParentTypes['MetadataType']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createContest?: Resolver<ResolversTypes['ContestMutationResponse'], ParentType, ContextType, RequireFields<MutationCreateContestArgs, 'contestData' | 'spaceId'>>;
  createContestTweet?: Resolver<ResolversTypes['ContestTweetResponse'], ParentType, ContextType, RequireFields<MutationCreateContestTweetArgs, 'contestId' | 'spaceId' | 'tweetThread'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  activeContests?: Resolver<Array<ResolversTypes['Contest']>, ParentType, ContextType>;
  contest?: Resolver<Maybe<ResolversTypes['Contest']>, ParentType, ContextType, RequireFields<QueryContestArgs, 'contestId'>>;
  isContestTweetQueued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIsContestTweetQueuedArgs, 'contestId'>>;
}>;

export type RewardTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RewardType'] = ResolversParentTypes['RewardType']> = ResolversObject<{
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tokenReward?: Resolver<ResolversTypes['TokenRewardType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type SubmitterRestrictionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitterRestrictionType'] = ResolversParentTypes['SubmitterRestrictionType']> = ResolversObject<{
  restrictionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenRestriction?: Resolver<ResolversTypes['TokenRestrictionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenRestrictionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenRestrictionType'] = ResolversParentTypes['TokenRestrictionType']> = ResolversObject<{
  threshold?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['TokenType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenRewardTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenRewardType'] = ResolversParentTypes['TokenRewardType']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['TokenType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenType'] = ResolversParentTypes['TokenType']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VotingPolicyTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['VotingPolicyType'] = ResolversParentTypes['VotingPolicyType']> = ResolversObject<{
  arcadeVotingStrategy?: Resolver<Maybe<ResolversTypes['ArcadeVotingStrategyType']>, ParentType, ContextType>;
  strategyType?: Resolver<ResolversTypes['VotingStrategyType'], ParentType, ContextType>;
  weightedVotingStrategy?: Resolver<Maybe<ResolversTypes['WeightedVotingStrategyType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WeightedVotingStrategyTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeightedVotingStrategyType'] = ResolversParentTypes['WeightedVotingStrategyType']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['TokenType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AdditionalParamsType?: AdditionalParamsTypeResolvers<ContextType>;
  Admin?: AdminResolvers<ContextType>;
  ArcadeVotingStrategyType?: ArcadeVotingStrategyTypeResolvers<ContextType>;
  Contest?: ContestResolvers<ContextType>;
  ContestErrorData?: ContestErrorDataResolvers<ContextType>;
  ContestMutationResponse?: ContestMutationResponseResolvers<ContextType>;
  ContestTweetResponse?: ContestTweetResponseResolvers<ContextType>;
  DeadlinesType?: DeadlinesTypeResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  EditorData?: GraphQLScalarType;
  ISODateString?: GraphQLScalarType;
  IpfsUrl?: GraphQLScalarType;
  MetadataType?: MetadataTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RewardType?: RewardTypeResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  SpaceStub?: SpaceStubResolvers<ContextType>;
  SubmitterRestrictionType?: SubmitterRestrictionTypeResolvers<ContextType>;
  TokenRestrictionType?: TokenRestrictionTypeResolvers<ContextType>;
  TokenRewardType?: TokenRewardTypeResolvers<ContextType>;
  TokenType?: TokenTypeResolvers<ContextType>;
  VotingPolicyType?: VotingPolicyTypeResolvers<ContextType>;
  WeightedVotingStrategyType?: WeightedVotingStrategyTypeResolvers<ContextType>;
}>;

