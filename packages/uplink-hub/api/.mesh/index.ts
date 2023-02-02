// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GrpcHandler from "@graphql-mesh/grpc"
import BareMerger from "@graphql-mesh/merger-bare";
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { AuthorsTypes } from './sources/authors/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: boolean;
  Int: number;
  Float: number;
  authors_v1_ListAuthorsRequest_Input: any;
};

export type Query = {
  authors_v1_AuthorsService_GetAuthor?: Maybe<authors_v1_Author>;
  authors_v1_AuthorsService_ListAuthors?: Maybe<authors_v1_ListAuthorsResponse>;
  authors_v1_AuthorsService_connectivityState?: Maybe<ConnectivityState>;
};


export type Queryauthors_v1_AuthorsService_GetAuthorArgs = {
  input?: InputMaybe<authors_v1_GetAuthorRequest_Input>;
};


export type Queryauthors_v1_AuthorsService_ListAuthorsArgs = {
  input?: InputMaybe<Scalars['authors_v1_ListAuthorsRequest_Input']>;
};


export type Queryauthors_v1_AuthorsService_connectivityStateArgs = {
  tryToConnect?: InputMaybe<Scalars['Boolean']>;
};

export type authors_v1_Author = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  editor?: Maybe<Scalars['String']>;
};

export type authors_v1_GetAuthorRequest_Input = {
  id?: InputMaybe<Scalars['String']>;
};

export type authors_v1_ListAuthorsResponse = {
  items?: Maybe<Array<Maybe<authors_v1_Author>>>;
};

export type ConnectivityState =
  | 'IDLE'
  | 'CONNECTING'
  | 'READY'
  | 'TRANSIENT_FAILURE'
  | 'SHUTDOWN';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
  Query: ResolverTypeWrapper<{}>;
  authors_v1_Author: ResolverTypeWrapper<authors_v1_Author>;
  String: ResolverTypeWrapper<Scalars['String']>;
  authors_v1_GetAuthorRequest_Input: authors_v1_GetAuthorRequest_Input;
  authors_v1_ListAuthorsResponse: ResolverTypeWrapper<authors_v1_ListAuthorsResponse>;
  authors_v1_ListAuthorsRequest_Input: ResolverTypeWrapper<Scalars['authors_v1_ListAuthorsRequest_Input']>;
  ConnectivityState: ConnectivityState;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  authors_v1_Author: authors_v1_Author;
  String: Scalars['String'];
  authors_v1_GetAuthorRequest_Input: authors_v1_GetAuthorRequest_Input;
  authors_v1_ListAuthorsResponse: authors_v1_ListAuthorsResponse;
  authors_v1_ListAuthorsRequest_Input: Scalars['authors_v1_ListAuthorsRequest_Input'];
  Boolean: Scalars['Boolean'];
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authors_v1_AuthorsService_GetAuthor?: Resolver<Maybe<ResolversTypes['authors_v1_Author']>, ParentType, ContextType, Partial<Queryauthors_v1_AuthorsService_GetAuthorArgs>>;
  authors_v1_AuthorsService_ListAuthors?: Resolver<Maybe<ResolversTypes['authors_v1_ListAuthorsResponse']>, ParentType, ContextType, Partial<Queryauthors_v1_AuthorsService_ListAuthorsArgs>>;
  authors_v1_AuthorsService_connectivityState?: Resolver<Maybe<ResolversTypes['ConnectivityState']>, ParentType, ContextType, Partial<Queryauthors_v1_AuthorsService_connectivityStateArgs>>;
}>;

export type authors_v1_AuthorResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['authors_v1_Author'] = ResolversParentTypes['authors_v1_Author']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type authors_v1_ListAuthorsResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['authors_v1_ListAuthorsResponse'] = ResolversParentTypes['authors_v1_ListAuthorsResponse']> = ResolversObject<{
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['authors_v1_Author']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface authors_v1_ListAuthorsRequest_InputScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['authors_v1_ListAuthorsRequest_Input'], any> {
  name: 'authors_v1_ListAuthorsRequest_Input';
}

export type ConnectivityStateResolvers = { IDLE: 0, CONNECTING: 1, READY: 2, TRANSIENT_FAILURE: 3, SHUTDOWN: 4 };

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  authors_v1_Author?: authors_v1_AuthorResolvers<ContextType>;
  authors_v1_ListAuthorsResponse?: authors_v1_ListAuthorsResponseResolvers<ContextType>;
  authors_v1_ListAuthorsRequest_Input?: GraphQLScalarType;
  ConnectivityState?: ConnectivityStateResolvers;
}>;


export type MeshContext = AuthorsTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/authors/rootJsonEntries":
      return import("./sources/authors/rootJsonEntries") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("🕸️  Mesh");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const authorsTransforms = [];
const additionalTypeDefs = [] as any[];
const authorsHandler = new GrpcHandler({
              name: "authors",
              config: {"endpoint":"localhost:3001","source":"../foo-service/src/proto/authors_service.proto"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("authors"),
              logger: logger.child("authors"),
              importFn,
            });
sources[0] = {
          name: 'authors',
          handler: authorsHandler,
          transforms: authorsTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler(): MeshHTTPHandler<MeshContext> {
  return createMeshHTTPHandler<MeshContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));