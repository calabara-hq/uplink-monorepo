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
  SubmissionAssetUrl: { input: any; output: any; }
};

export type AdditionalParams = {
  __typename?: 'AdditionalParams';
  anonSubs: Scalars['Boolean']['output'];
  visibleVotes: Scalars['Boolean']['output'];
};

export type Contest = {
  __typename?: 'Contest';
  additionalParams: AdditionalParams;
  deadlines: Deadlines;
  gnosisResults?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  submissions: Array<Submission>;
};

export type Deadlines = {
  __typename?: 'Deadlines';
  endTime: Scalars['ISODateString']['output'];
  snapshot: Scalars['ISODateString']['output'];
  startTime: Scalars['ISODateString']['output'];
  voteTime: Scalars['ISODateString']['output'];
};

export type DropConfig = {
  animationURI: Scalars['String']['input'];
  defaultAdmin: Scalars['String']['input'];
  description: Scalars['String']['input'];
  editionSize: Scalars['String']['input'];
  fundsRecipient: Scalars['String']['input'];
  imageURI: Scalars['String']['input'];
  name: Scalars['String']['input'];
  referrer: Scalars['String']['input'];
  royaltyBPS: Scalars['Int']['input'];
  saleConfig: SaleConfig;
  symbol: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMintBoardSubmission: CreateMintBoardSubmissionResponse;
  createSubmission: CreateSubmissionResponse;
  createTwitterSubmission: CreateSubmissionResponse;
  createUserDrop: CreateUserDropResponse;
  reserveMintBoardSlot: ReserveMintBoardSlotResponse;
};


export type MutationCreateMintBoardSubmissionArgs = {
  chainId: Scalars['Int']['input'];
  contractAddress: Scalars['String']['input'];
  dropConfig: DropConfig;
  spaceName: Scalars['String']['input'];
};


export type MutationCreateSubmissionArgs = {
  contestId: Scalars['ID']['input'];
  submission: SubmissionPayload;
};


export type MutationCreateTwitterSubmissionArgs = {
  contestId: Scalars['ID']['input'];
  submission: TwitterSubmissionPayload;
};


export type MutationCreateUserDropArgs = {
  chainId: Scalars['Int']['input'];
  contestId: Scalars['ID']['input'];
  contractAddress: Scalars['String']['input'];
  dropConfig: DropConfig;
  submissionId: Scalars['ID']['input'];
};


export type MutationReserveMintBoardSlotArgs = {
  spaceName: Scalars['String']['input'];
};

export type NftDrop = {
  __typename?: 'NftDrop';
  chainId: Scalars['Int']['output'];
  contractAddress: Scalars['String']['output'];
  dropConfig: Scalars['String']['output'];
};

export type PopularSubmission = {
  __typename?: 'PopularSubmission';
  author: SubmissionAuthor;
  contestId: Scalars['ID']['output'];
  created: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nftDrop?: Maybe<NftDrop>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getUserSubmissionParams: UserSubmissionParams;
  popularSubmissions: Array<PopularSubmission>;
  submission?: Maybe<Submission>;
};


export type QueryGetUserSubmissionParamsArgs = {
  contestId: Scalars['ID']['input'];
};


export type QuerySubmissionArgs = {
  submissionId: Scalars['ID']['input'];
};

export type RestrictionResult = {
  __typename?: 'RestrictionResult';
  restriction: Submit_Restriction;
  result: Scalars['Boolean']['output'];
};

export type SaleConfig = {
  maxSalePurchasePerAddress: Scalars['Int']['input'];
  presaleEnd: Scalars['String']['input'];
  presaleMerkleRoot: Scalars['String']['input'];
  presaleStart: Scalars['String']['input'];
  publicSaleEnd: Scalars['String']['input'];
  publicSalePrice: Scalars['String']['input'];
  publicSaleStart: Scalars['String']['input'];
};

export type Space = {
  __typename?: 'Space';
  id: Scalars['ID']['output'];
};

export type Submission = {
  __typename?: 'Submission';
  author?: Maybe<SubmissionAuthor>;
  contestId: Scalars['ID']['output'];
  created: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nftDrop?: Maybe<NftDrop>;
  rank?: Maybe<Scalars['Int']['output']>;
  totalVotes?: Maybe<Scalars['Decimal']['output']>;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type SubmissionAuthor = {
  __typename?: 'SubmissionAuthor';
  address: Scalars['String']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  profileAvatar?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type SubmissionPayload = {
  body?: InputMaybe<Scalars['EditorData']['input']>;
  previewAsset?: InputMaybe<Scalars['SubmissionAssetUrl']['input']>;
  title: Scalars['String']['input'];
  videoAsset?: InputMaybe<Scalars['SubmissionAssetUrl']['input']>;
};

export type Submit_Restriction = {
  __typename?: 'Submit_Restriction';
  restrictionType: Scalars['String']['output'];
  tokenRestriction?: Maybe<Submit_TokenRestriction>;
};

export type Submit_Token = {
  __typename?: 'Submit_Token';
  address?: Maybe<Scalars['String']['output']>;
  decimals: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type Submit_TokenRestriction = {
  __typename?: 'Submit_TokenRestriction';
  threshold: Scalars['Decimal']['output'];
  token: Submit_Token;
};

export type ThreadPayload = {
  assetSize?: InputMaybe<Scalars['Int']['input']>;
  assetType?: InputMaybe<Scalars['String']['input']>;
  previewAsset?: InputMaybe<Scalars['SubmissionAssetUrl']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  videoAsset?: InputMaybe<Scalars['SubmissionAssetUrl']['input']>;
};

export type TwitterSubmissionPayload = {
  thread: Array<ThreadPayload>;
  title: Scalars['String']['input'];
};

export type UserSubmissionParams = {
  __typename?: 'UserSubmissionParams';
  maxSubPower: Scalars['Int']['output'];
  remainingSubPower: Scalars['Int']['output'];
  restrictionResults: Array<RestrictionResult>;
  userSubmissions: Array<Submission>;
};

export type CreateMintBoardSubmissionResponse = {
  __typename?: 'createMintBoardSubmissionResponse';
  success: Scalars['Boolean']['output'];
};

export type CreateSubmissionResponse = {
  __typename?: 'createSubmissionResponse';
  submissionId?: Maybe<Scalars['ID']['output']>;
  success: Scalars['Boolean']['output'];
  userSubmissionParams: UserSubmissionParams;
};

export type CreateUserDropResponse = {
  __typename?: 'createUserDropResponse';
  success: Scalars['Boolean']['output'];
};

export type ReserveMintBoardSlotResponse = {
  __typename?: 'reserveMintBoardSlotResponse';
  slot?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
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
  AdditionalParams: ResolverTypeWrapper<AdditionalParams>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Contest: ResolverTypeWrapper<Contest>;
  Deadlines: ResolverTypeWrapper<Deadlines>;
  Decimal: ResolverTypeWrapper<Scalars['Decimal']['output']>;
  DropConfig: DropConfig;
  EditorData: ResolverTypeWrapper<Scalars['EditorData']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ISODateString: ResolverTypeWrapper<Scalars['ISODateString']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NftDrop: ResolverTypeWrapper<NftDrop>;
  PopularSubmission: ResolverTypeWrapper<PopularSubmission>;
  Query: ResolverTypeWrapper<{}>;
  RestrictionResult: ResolverTypeWrapper<RestrictionResult>;
  SaleConfig: SaleConfig;
  Space: ResolverTypeWrapper<Space>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Submission: ResolverTypeWrapper<Submission>;
  SubmissionAssetUrl: ResolverTypeWrapper<Scalars['SubmissionAssetUrl']['output']>;
  SubmissionAuthor: ResolverTypeWrapper<SubmissionAuthor>;
  SubmissionPayload: SubmissionPayload;
  Submit_Restriction: ResolverTypeWrapper<Submit_Restriction>;
  Submit_Token: ResolverTypeWrapper<Submit_Token>;
  Submit_TokenRestriction: ResolverTypeWrapper<Submit_TokenRestriction>;
  ThreadPayload: ThreadPayload;
  TwitterSubmissionPayload: TwitterSubmissionPayload;
  UserSubmissionParams: ResolverTypeWrapper<UserSubmissionParams>;
  createMintBoardSubmissionResponse: ResolverTypeWrapper<CreateMintBoardSubmissionResponse>;
  createSubmissionResponse: ResolverTypeWrapper<CreateSubmissionResponse>;
  createUserDropResponse: ResolverTypeWrapper<CreateUserDropResponse>;
  reserveMintBoardSlotResponse: ResolverTypeWrapper<ReserveMintBoardSlotResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AdditionalParams: AdditionalParams;
  Boolean: Scalars['Boolean']['output'];
  Contest: Contest;
  Deadlines: Deadlines;
  Decimal: Scalars['Decimal']['output'];
  DropConfig: DropConfig;
  EditorData: Scalars['EditorData']['output'];
  ID: Scalars['ID']['output'];
  ISODateString: Scalars['ISODateString']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  NftDrop: NftDrop;
  PopularSubmission: PopularSubmission;
  Query: {};
  RestrictionResult: RestrictionResult;
  SaleConfig: SaleConfig;
  Space: Space;
  String: Scalars['String']['output'];
  Submission: Submission;
  SubmissionAssetUrl: Scalars['SubmissionAssetUrl']['output'];
  SubmissionAuthor: SubmissionAuthor;
  SubmissionPayload: SubmissionPayload;
  Submit_Restriction: Submit_Restriction;
  Submit_Token: Submit_Token;
  Submit_TokenRestriction: Submit_TokenRestriction;
  ThreadPayload: ThreadPayload;
  TwitterSubmissionPayload: TwitterSubmissionPayload;
  UserSubmissionParams: UserSubmissionParams;
  createMintBoardSubmissionResponse: CreateMintBoardSubmissionResponse;
  createSubmissionResponse: CreateSubmissionResponse;
  createUserDropResponse: CreateUserDropResponse;
  reserveMintBoardSlotResponse: ReserveMintBoardSlotResponse;
}>;

export type AdditionalParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdditionalParams'] = ResolversParentTypes['AdditionalParams']> = ResolversObject<{
  anonSubs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  visibleVotes?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contest'] = ResolversParentTypes['Contest']> = ResolversObject<{
  additionalParams?: Resolver<ResolversTypes['AdditionalParams'], ParentType, ContextType>;
  deadlines?: Resolver<ResolversTypes['Deadlines'], ParentType, ContextType>;
  gnosisResults?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submissions?: Resolver<Array<ResolversTypes['Submission']>, ParentType, ContextType>;
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

export interface IsoDateStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISODateString'], any> {
  name: 'ISODateString';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createMintBoardSubmission?: Resolver<ResolversTypes['createMintBoardSubmissionResponse'], ParentType, ContextType, RequireFields<MutationCreateMintBoardSubmissionArgs, 'chainId' | 'contractAddress' | 'dropConfig' | 'spaceName'>>;
  createSubmission?: Resolver<ResolversTypes['createSubmissionResponse'], ParentType, ContextType, RequireFields<MutationCreateSubmissionArgs, 'contestId' | 'submission'>>;
  createTwitterSubmission?: Resolver<ResolversTypes['createSubmissionResponse'], ParentType, ContextType, RequireFields<MutationCreateTwitterSubmissionArgs, 'contestId' | 'submission'>>;
  createUserDrop?: Resolver<ResolversTypes['createUserDropResponse'], ParentType, ContextType, RequireFields<MutationCreateUserDropArgs, 'chainId' | 'contestId' | 'contractAddress' | 'dropConfig' | 'submissionId'>>;
  reserveMintBoardSlot?: Resolver<ResolversTypes['reserveMintBoardSlotResponse'], ParentType, ContextType, RequireFields<MutationReserveMintBoardSlotArgs, 'spaceName'>>;
}>;

export type NftDropResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftDrop'] = ResolversParentTypes['NftDrop']> = ResolversObject<{
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dropConfig?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PopularSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PopularSubmission'] = ResolversParentTypes['PopularSubmission']> = ResolversObject<{
  author?: Resolver<ResolversTypes['SubmissionAuthor'], ParentType, ContextType>;
  contestId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftDrop?: Resolver<Maybe<ResolversTypes['NftDrop']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getUserSubmissionParams?: Resolver<ResolversTypes['UserSubmissionParams'], ParentType, ContextType, RequireFields<QueryGetUserSubmissionParamsArgs, 'contestId'>>;
  popularSubmissions?: Resolver<Array<ResolversTypes['PopularSubmission']>, ParentType, ContextType>;
  submission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<QuerySubmissionArgs, 'submissionId'>>;
}>;

export type RestrictionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RestrictionResult'] = ResolversParentTypes['RestrictionResult']> = ResolversObject<{
  restriction?: Resolver<ResolversTypes['Submit_Restriction'], ParentType, ContextType>;
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Space'] = ResolversParentTypes['Space']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['SubmissionAuthor']>, ParentType, ContextType>;
  contestId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftDrop?: Resolver<Maybe<ResolversTypes['NftDrop']>, ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalVotes?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface SubmissionAssetUrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SubmissionAssetUrl'], any> {
  name: 'SubmissionAssetUrl';
}

export type SubmissionAuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmissionAuthor'] = ResolversParentTypes['SubmissionAuthor']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  profileAvatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Submit_RestrictionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submit_Restriction'] = ResolversParentTypes['Submit_Restriction']> = ResolversObject<{
  restrictionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenRestriction?: Resolver<Maybe<ResolversTypes['Submit_TokenRestriction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Submit_TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submit_Token'] = ResolversParentTypes['Submit_Token']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Submit_TokenRestrictionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submit_TokenRestriction'] = ResolversParentTypes['Submit_TokenRestriction']> = ResolversObject<{
  threshold?: Resolver<ResolversTypes['Decimal'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Submit_Token'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSubmissionParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSubmissionParams'] = ResolversParentTypes['UserSubmissionParams']> = ResolversObject<{
  maxSubPower?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  remainingSubPower?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  restrictionResults?: Resolver<Array<ResolversTypes['RestrictionResult']>, ParentType, ContextType>;
  userSubmissions?: Resolver<Array<ResolversTypes['Submission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateMintBoardSubmissionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['createMintBoardSubmissionResponse'] = ResolversParentTypes['createMintBoardSubmissionResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateSubmissionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['createSubmissionResponse'] = ResolversParentTypes['createSubmissionResponse']> = ResolversObject<{
  submissionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userSubmissionParams?: Resolver<ResolversTypes['UserSubmissionParams'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserDropResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['createUserDropResponse'] = ResolversParentTypes['createUserDropResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReserveMintBoardSlotResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['reserveMintBoardSlotResponse'] = ResolversParentTypes['reserveMintBoardSlotResponse']> = ResolversObject<{
  slot?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AdditionalParams?: AdditionalParamsResolvers<ContextType>;
  Contest?: ContestResolvers<ContextType>;
  Deadlines?: DeadlinesResolvers<ContextType>;
  Decimal?: GraphQLScalarType;
  EditorData?: GraphQLScalarType;
  ISODateString?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NftDrop?: NftDropResolvers<ContextType>;
  PopularSubmission?: PopularSubmissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RestrictionResult?: RestrictionResultResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
  SubmissionAssetUrl?: GraphQLScalarType;
  SubmissionAuthor?: SubmissionAuthorResolvers<ContextType>;
  Submit_Restriction?: Submit_RestrictionResolvers<ContextType>;
  Submit_Token?: Submit_TokenResolvers<ContextType>;
  Submit_TokenRestriction?: Submit_TokenRestrictionResolvers<ContextType>;
  UserSubmissionParams?: UserSubmissionParamsResolvers<ContextType>;
  createMintBoardSubmissionResponse?: CreateMintBoardSubmissionResponseResolvers<ContextType>;
  createSubmissionResponse?: CreateSubmissionResponseResolvers<ContextType>;
  createUserDropResponse?: CreateUserDropResponseResolvers<ContextType>;
  reserveMintBoardSlotResponse?: ReserveMintBoardSlotResponseResolvers<ContextType>;
}>;

