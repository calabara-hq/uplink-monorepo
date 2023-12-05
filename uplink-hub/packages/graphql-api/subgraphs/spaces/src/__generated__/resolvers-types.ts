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
  IpfsUrl: { input: any; output: any; }
};

export type Admin = {
  __typename?: 'Admin';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  spaceId: Scalars['ID']['output'];
};

export type ConfigureMintBoardResponse = {
  __typename?: 'ConfigureMintBoardResponse';
  success: Scalars['Boolean']['output'];
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
  spaceId: Scalars['ID']['output'];
  submissions: Array<MintBoardSubmission>;
  symbol: Scalars['String']['output'];
};

export type MintBoardAuthor = {
  __typename?: 'MintBoardAuthor';
  address: Scalars['String']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  profileAvatar?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  userName?: Maybe<Scalars['String']['output']>;
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

export type MintBoardSubmission = {
  __typename?: 'MintBoardSubmission';
  author: MintBoardAuthor;
  chainId: Scalars['Int']['output'];
  contractAddress: Scalars['String']['output'];
  created: Scalars['String']['output'];
  dropConfig: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  spaceId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  configureMintBoard: ConfigureMintBoardResponse;
  createSpace: SpaceMutationResponse;
  editSpace: SpaceMutationResponse;
};


export type MutationConfigureMintBoardArgs = {
  mintBoardData: MintBoardInput;
  spaceName: Scalars['String']['input'];
};


export type MutationCreateSpaceArgs = {
  spaceData: SpaceBuilderInput;
};


export type MutationEditSpaceArgs = {
  spaceData: SpaceBuilderInput;
  spaceId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  space?: Maybe<Space>;
  spaces: Array<Space>;
};


export type QuerySpaceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Space = {
  __typename?: 'Space';
  admins: Array<Admin>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logoUrl: Scalars['String']['output'];
  members: Scalars['Int']['output'];
  mintBoard?: Maybe<MintBoard>;
  name: Scalars['String']['output'];
  spaceTokens: Array<SpaceTokenMap>;
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type SpaceBuilderErrors = {
  __typename?: 'SpaceBuilderErrors';
  admins?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type SpaceBuilderInput = {
  admins: Array<Scalars['String']['input']>;
  logoUrl: Scalars['IpfsUrl']['input'];
  name: Scalars['String']['input'];
  twitter?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type SpaceMutationResponse = {
  __typename?: 'SpaceMutationResponse';
  errors?: Maybe<SpaceBuilderErrors>;
  spaceName?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SpaceStub = {
  __typename?: 'SpaceStub';
  admins: Array<Admin>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logoUrl: Scalars['String']['output'];
  members: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type SpaceToken = {
  __typename?: 'SpaceToken';
  address?: Maybe<Scalars['String']['output']>;
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
  tokenHash: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['Int']['output']>;
  type: TokenStandard;
};

export type SpaceTokenMap = {
  __typename?: 'SpaceTokenMap';
  id: Scalars['ID']['output'];
  spaceId: Scalars['ID']['output'];
  token: SpaceToken;
  tokenLink: Scalars['Int']['output'];
};

export enum TokenStandard {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Eth = 'ETH'
}

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
  Admin: ResolverTypeWrapper<Admin>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ConfigureMintBoardResponse: ResolverTypeWrapper<ConfigureMintBoardResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IpfsUrl: ResolverTypeWrapper<Scalars['IpfsUrl']['output']>;
  MintBoard: ResolverTypeWrapper<MintBoard>;
  MintBoardAuthor: ResolverTypeWrapper<MintBoardAuthor>;
  MintBoardInput: MintBoardInput;
  MintBoardSubmission: ResolverTypeWrapper<MintBoardSubmission>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Space: ResolverTypeWrapper<Space>;
  SpaceBuilderErrors: ResolverTypeWrapper<SpaceBuilderErrors>;
  SpaceBuilderInput: SpaceBuilderInput;
  SpaceMutationResponse: ResolverTypeWrapper<SpaceMutationResponse>;
  SpaceStub: ResolverTypeWrapper<SpaceStub>;
  SpaceToken: ResolverTypeWrapper<SpaceToken>;
  SpaceTokenMap: ResolverTypeWrapper<SpaceTokenMap>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TokenStandard: TokenStandard;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Admin: Admin;
  Boolean: Scalars['Boolean']['output'];
  ConfigureMintBoardResponse: ConfigureMintBoardResponse;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  IpfsUrl: Scalars['IpfsUrl']['output'];
  MintBoard: MintBoard;
  MintBoardAuthor: MintBoardAuthor;
  MintBoardInput: MintBoardInput;
  MintBoardSubmission: MintBoardSubmission;
  Mutation: {};
  Query: {};
  Space: Space;
  SpaceBuilderErrors: SpaceBuilderErrors;
  SpaceBuilderInput: SpaceBuilderInput;
  SpaceMutationResponse: SpaceMutationResponse;
  SpaceStub: SpaceStub;
  SpaceToken: SpaceToken;
  SpaceTokenMap: SpaceTokenMap;
  String: Scalars['String']['output'];
}>;

export type AdminResolvers<ContextType = any, ParentType extends ResolversParentTypes['Admin'] = ResolversParentTypes['Admin']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConfigureMintBoardResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigureMintBoardResponse'] = ResolversParentTypes['ConfigureMintBoardResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface IpfsUrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IpfsUrl'], any> {
  name: 'IpfsUrl';
}

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
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submissions?: Resolver<Array<ResolversTypes['MintBoardSubmission']>, ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MintBoardAuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MintBoardAuthor'] = ResolversParentTypes['MintBoardAuthor']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  profileAvatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MintBoardSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MintBoardSubmission'] = ResolversParentTypes['MintBoardSubmission']> = ResolversObject<{
  author?: Resolver<ResolversTypes['MintBoardAuthor'], ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dropConfig?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  configureMintBoard?: Resolver<ResolversTypes['ConfigureMintBoardResponse'], ParentType, ContextType, RequireFields<MutationConfigureMintBoardArgs, 'mintBoardData' | 'spaceName'>>;
  createSpace?: Resolver<ResolversTypes['SpaceMutationResponse'], ParentType, ContextType, RequireFields<MutationCreateSpaceArgs, 'spaceData'>>;
  editSpace?: Resolver<ResolversTypes['SpaceMutationResponse'], ParentType, ContextType, RequireFields<MutationEditSpaceArgs, 'spaceData' | 'spaceId'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  space?: Resolver<Maybe<ResolversTypes['Space']>, ParentType, ContextType, Partial<QuerySpaceArgs>>;
  spaces?: Resolver<Array<ResolversTypes['Space']>, ParentType, ContextType>;
}>;

export type SpaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Space'] = ResolversParentTypes['Space']> = ResolversObject<{
  admins?: Resolver<Array<ResolversTypes['Admin']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mintBoard?: Resolver<Maybe<ResolversTypes['MintBoard']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  spaceTokens?: Resolver<Array<ResolversTypes['SpaceTokenMap']>, ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceBuilderErrorsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceBuilderErrors'] = ResolversParentTypes['SpaceBuilderErrors']> = ResolversObject<{
  admins?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceMutationResponse'] = ResolversParentTypes['SpaceMutationResponse']> = ResolversObject<{
  errors?: Resolver<Maybe<ResolversTypes['SpaceBuilderErrors']>, ParentType, ContextType>;
  spaceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceStubResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceStub'] = ResolversParentTypes['SpaceStub']> = ResolversObject<{
  admins?: Resolver<Array<ResolversTypes['Admin']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceToken'] = ResolversParentTypes['SpaceToken']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpaceTokenMapResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceTokenMap'] = ResolversParentTypes['SpaceTokenMap']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['SpaceToken'], ParentType, ContextType>;
  tokenLink?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Admin?: AdminResolvers<ContextType>;
  ConfigureMintBoardResponse?: ConfigureMintBoardResponseResolvers<ContextType>;
  IpfsUrl?: GraphQLScalarType;
  MintBoard?: MintBoardResolvers<ContextType>;
  MintBoardAuthor?: MintBoardAuthorResolvers<ContextType>;
  MintBoardSubmission?: MintBoardSubmissionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Space?: SpaceResolvers<ContextType>;
  SpaceBuilderErrors?: SpaceBuilderErrorsResolvers<ContextType>;
  SpaceMutationResponse?: SpaceMutationResponseResolvers<ContextType>;
  SpaceStub?: SpaceStubResolvers<ContextType>;
  SpaceToken?: SpaceTokenResolvers<ContextType>;
  SpaceTokenMap?: SpaceTokenMapResolvers<ContextType>;
}>;

