import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from 'graphql-tag';
import { readFileSync } from "fs";
import cookie from 'cookie';
import dotenv from 'dotenv';
import resolvers from "./resolvers/index.js";

import { xor_compare, Context, schema, INativeToken, TokenSchema, IToken } from 'lib';
import { shield } from "graphql-shield";
import { GraphQLError } from "graphql";
import Redis from 'ioredis';
import { createRateLimitRule, RedisStore } from "graphql-rate-limit";
import { applyMiddleware } from "graphql-middleware";

// Initial configurations
dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL!);

const typeDefs = gql(readFileSync("./schema.graphql").toString('utf-8'));

// Helper function to parse headers
const parseHeader = (headerArray: string[] | string) => {
  return Array.isArray(headerArray) ? headerArray[0] : headerArray || '';
};

// Rate limiting rule configuration
const rateLimitRule = createRateLimitRule({
  identifyContext: ctx => ctx.hasApiToken ? Math.random().toString(36).slice(2) : ctx.ip,
  createError: (message: string) => new GraphQLError(message, { extensions: { code: 'RATE_LIMIT_EXCEEDED' } }),
  store: new RedisStore(redisClient)
})

// Setting up GraphQL permissions
const permissions = shield({
  Query: {
    contest: rateLimitRule({ window: '1m', max: 45 }),
    activeContests: rateLimitRule({ window: '1m', max: 15 }),
    isContestTweetQueued: rateLimitRule({ window: '1m', max: 15 }),

  },
  Mutation: {
    createContest: rateLimitRule({ window: '1m', max: 3 }),
    createContestTweet: rateLimitRule({ window: '1m', max: 3 }),
  },
}, { allowExternalErrors: true }
);

// Create Apollo server with applied middleware
const server = new ApolloServer({
  schema: applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: parseInt(process.env.CONTEST_SERVICE_PORT!) },
  context: async ({ req }): Promise<Context> => {
    return {
      token: cookie.parse(parseHeader(req.headers['session-cookie'] || '')),
      csrfToken: parseHeader(req.headers['x-csrf-token'] || ''),
      ip: parseHeader(req.headers['x-forwarded-for'] || '') || (req?.socket?.remoteAddress ?? "localhost"),
      hasApiToken: xor_compare(parseHeader(req.headers['x-api-token'] || ''), process.env.FRONTEND_API_SECRET!)
    };
  }
});



console.log(`🚀  Server ready at: ${url}`);