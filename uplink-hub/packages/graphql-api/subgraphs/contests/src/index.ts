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


// const signalData = [
//   {
//     author: '0xD433BB220A696E9CDc2e534f0127eC115DaEf18A',
//     title: 'Based Management intern ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XU1h6a3BqdTN1SGJLQUtqNFl3V2dBZkVSZEFSUU52a3dTVlNkb0RIVjRTaA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWSXzkpju3uHbKAKj4YwWgAfERdARQNvkwSVSdoDHV4Sh',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmXRtME926tFb7ebMG7zfJbVd6PECchPpndE1s2mnFrEAo'
//   },
//   {
//     author: '0xfCDD256267ade068babfB94F526A47aADf143a55',
//     title: 'Based Stoic',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mNGJ6N2tvQmtnUEdETHF1VmFIbnpvUW1EUFl5OTRjVUNadTVYNTM4UXlGeg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmf4bz7koBkgPGDLquVaHnzoQmDPYy94cUCZu5X538QyFz',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmeNCXDH2XeM61WyLZYxXEvrRXKk3FF1JbP3yiATkCStXD'
//   },
//   {
//     author: '0xD59c3b026E9AbeF3f744491462D369e4C27040b3',
//     title: 'Onchain Stories #003',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1SNTNlcmlncDFKSHB0WjZvdWJ1QjJRajNYQXJ6YmpkQUNBWWFtejk1UWpocQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmR53erigp1JHptZ6oubuB2Qj3XArzbjdACAYamz95Qjhq',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmNMMdEK4sZcNPoctyhagy6tjkPEi2VMfvNkbaMG21toFs'
//   },
//   {
//     author: '0xfCDD256267ade068babfB94F526A47aADf143a55',
//     title: 'BASED PEPE ISLAND',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1iOEVtTlZjcDRnOGhOcllUZXZKWGRFVGFSMk04VHJkRzE3Sm1nclZNNW44bg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmb8EmNVcp4g8hNrYTevJXdETaR2M8TrdG17JmgrVM5n8n',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmVy6NLD1VNa8ZsaQVBUTsiE3p5wsFDgQ3keuaMaE5vYQ6'
//   },
//   {
//     author: '0xD59c3b026E9AbeF3f744491462D369e4C27040b3',
//     title: 'based.management',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jWnhxWDV1VHFnWHltd2VSeVo5Q1NndWY2emRkRkJSQW9WM2FvektVRTh5bg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmcZxqX5uTqgXymweRyZ9CSguf6zddFBRAoV3aozKUE8yn',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmSdq68p4jVzTvvPTMPXzQJZugCBrij6N4ovBFd2rw5gAw'
//   },
//   {
//     author: '0x411c91Abf1133eD9CaB8b92D6768eb34aa53faA3',
//     title: 'People Unite Based on Love',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XZFhkcVlZcEFnTmtZaU5zSHhRQzFFSjRxRzQ5N01ONVRkcGF2Z0ZZNnJQOA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWdXdqYYpAgNkYiNsHxQC1EJ4qG497MN5TdpavgFY6rP8',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmT25wnv3QZBVftM1tEeEt8qRkPUFaHt1gChZ5qpNUNF3V'
//   },
//   {
//     author: '0xD433BB220A696E9CDc2e534f0127eC115DaEf18A',
//     title: 'Based Management',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1aYjJjeWhxNlVtNzFNbWo3WVNCREFFcVI1OVVMblNpTEdqSERYTHY2aDFDWg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmZb2cyhq6Um71Mmj7YSBDAEqR59ULnSiLGjHDXLv6h1CZ',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmT84TBpMLjrNbTarxZrfk6vdDR37cwk8EDxNEWHe9SeQY'
//   },
//   {
//     author: '0xd095E0f8C72E22319846b643c4bac0caC1f67006',
//     title: 'ABSTRACT BASED MANAGEMNT',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1ZYVBodVNtSExUZGZLSDZmekhGMkdNb3dkYWZLWTJ6U2dvZTQ0SjhGYnJTRg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmYaPhuSmHLTdfKH6fzHF2GMowdafKY2zSgoe44J8FbrSF',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPRAZrQTDqAHiv63PrzFmR7MVNUsXyTasqGa8wEX5h8ua'
//   },
//   {
//     author: '0x16571A6E792066762a5924F822aadB1fE6802D33',
//     title: 'Based mountain ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XUUg0RmJSeXhnQ3l3YUJCenUxSjU5aGs4blNYeXUyU1hieTQ5Q1VhY1Axeg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWQH4FbRyxgCywaBBzu1J59hk8nSXyu2SXby49CUacP1z',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmVnzVXJBjusgsQq97rabizkg23dRjrEW88jVdchpedUYn'
//   },
//   {
//     author: '0x16571A6E792066762a5924F822aadB1fE6802D33',
//     title: 'based city',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1RSG1ocDRkcUx3RVVOMWZMaXFrdmtUNzVQWkRVWlhiNWplbjVWQ0Q5NGtuVg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmQHmhp4dqLwEUN1fLiqkvkT75PZDUZXb5jen5VCD94knV',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/Qmcw6x6hFAg8EEVRaACoAnEU9c74XdkDkyE9Msz54PUT57'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Cloudbasting',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1QVFZ3WjFUMkQ4M1BMRjUzODZMWXdxUGZKV0VEZ2s2Qjl5VFA0bjdYRjdKbw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmPTVwZ1T2D83PLF5386LYwqPfJWEDgk6B9yTP4n7XF7Jo',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmWErmmELa8bjQYsgCnQ2NfLyUfZAc3yxKE4aNiWGeVaqr'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Pepe by Jean Michel Basequiat',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lNXVEYUJyTXg0U0hiZFhoazZMRDhmTEp5UWVxcFVjQnUzYkxHUDJGUEhVZw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qme5uDaBrMx4SHbdXhk6LD8fLJyQeqpUcBu3bLGP2FPHUg',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRkcjZwDmLafvJorYcGG25gF9PiHvaDrHW1Y5ofx7dNyi'
//   },
//   {
//     author: '0xF628F7d3337191619499D3E313ccd7FE0F69cbf2',
//     title: 'Night ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lVzNMWWhNY3k1SFB0Nlh5c2tuSzFXMUdvVlJFRDI4bzdNM1FtODRHRHFNdA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmeW3LYhMcy5HPt6XysknK1W1GoVRED28o7M3Qm84GDqMt',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmWZGchwpp7A78pYaUPo8Fwr6oXfFCa5zpuQF6T7wMxehC'
//   },
//   {
//     author: '0x27e121bFB21f631496Ad5b9783D049FaCbdd411E',
//     title: 'Unnamed based Pepe ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1TdHM0TWMxUndkWnhNVWpqcmVhUER4a2tlU1JkS0tTV2F3a3FjVEtYWHJ1RA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmSts4Mc1RwdZxMUjjreaPDxkkeSRdKKSWawkqcTKXXruD',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmShgJfZpVSoqXh9euEX2tUbuz98xXJnU1PYdsbr4VbTkf'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: 'Based Empire',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WR3I5VlZONmRneTdBZ21QaWRXeFlMem1oQ2dkZ1NORGtFU01HdGlXR0J4eQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVGr9VVN6dgy7AgmPidWxYLzmhCgdgSNDkESMGtiWGBxy',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPCbLicm19B99U9y7aVVuGNX2kkQMY71kH5w4mDyYTS3J'
//   },
//   {
//     author: '0xF628F7d3337191619499D3E313ccd7FE0F69cbf2',
//     title: 'Art',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1iZXdESzRrTnNrYjZLOUw0Y2kzMlhMd3RXRWM5c2RpbkRaUGUyM2hmQXVVbw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmbewDK4kNskb6K9L4ci32XLwtWEc9sdinDZPe23hfAuUo',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmUeXPL1KPz3Azh87VNcN26cgPPmyLk2wLfeQYV6g8HxyJ'
//   },
//   {
//     author: '0xB70399fc376c1B3Cf3493556d2f14942323eF44f',
//     title: 'based heaven ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kVjhnQWc4SnY2azRjTDlmZVRURzNLUHF3dFc0czd0cmROS25pWEFaQUh6OA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdV8gAg8Jv6k4cL9feTTG3KPqwtW4s7trdNKniXAZAHz8',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmYAFVaTkF3nJWGkFy368rsdwdbGvLneXgJWK3MGP5DA1P'
//   },
//   {
//     author: '0xc7A0D765C3aF6E2710bA05A56c5E2cA190C2E11e',
//     title: 'Billions on Base',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kYXRaTmZDSzV6VUYzOWZ4MmFVQnlOOEdDTTZGZGVYV3I0cm5BeHhlR3hzeA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdatZNfCK5zUF39fx2aUByN8GCM6FdeXWr4rnAxxeGxsx',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmcTU2nggStoC5zS6rg9Uu1a6R3D9e1355J4iVu5p8JPyG'
//   },
//   {
//     author: '0xB70399fc376c1B3Cf3493556d2f14942323eF44f',
//     title: 'pepe heaven',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kVUF6cjZFV0JESEVNbXk1ajV4bThBQVJ0YnJtakJtZVNzRVJzV2RZaTRtTA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdUAzr6EWBDHEMmy5j5xm8AARtbrmjBmeSsERsWdYi4mL',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRJRuyXhs7WxdNf481xXZALvePQ677sF4oxQc4QHA85ug'
//   },
//   {
//     author: '0xB70399fc376c1B3Cf3493556d2f14942323eF44f',
//     title: 'intern heaven',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1hMWNlamFON2JTZzF5NUVCS2tIaVp0OVluV0NxQlpkazlwZ2lUNG1Iajh5cw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qma1cejaN7bSg1y5EBKkHiZt9YnWCqBZdk9pgiT4mHj8ys',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmXuBrwkJ8Qu9F9kSUM3ePaXTULTA6djotXsDWt4w4B7JD'
//   },
//   {
//     author: '0xB70399fc376c1B3Cf3493556d2f14942323eF44f',
//     title: 'manager heaven',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WajhYYjhtdDJVTE0xMlhSa2szVlNvM0EzOFRGbjRFZXppbXZ2QmJYc0xmeQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVj8Xb8mt2ULM12XRkk3VSo3A38TFn4EezimvvBbXsLfy',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmUHc9a49q4pWyrabVayKPLRMvWSFvfoZy8N7BdqMJxQtF'
//   },
//   {
//     author: '0xd7B7A3AB29B3282dc76419Bd57776e0E90DE8A41',
//     title: 'Based Bluebird Pepe',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mV0dHa3FBRHd6VVdGeUdvN2U2R216WWlrNlc1VjlUM3FSWWVXRnBLM2Y5Rg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmfWGGkqADwzUWFyGo7e6GmzYik6W5V9T3qRYeWFpK3f9F',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmeGV5JqyZG2XBMYbgJcdVnNWozr53HEux1wRtBvEbLWrp'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Based Intern: Day 2',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1VTVVCejRTYXBiYW5HMmY0bkNKeHN2cnh5N3pLRERGRXR6ZDY4TTM2R3pZVA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmUMUBz4SapbanG2f4nCJxsvrxy7zKDDFEtzd68M36GzYT',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmdeA6PRSJ23fN1MZ3euwyvLntMZc3nEtKGJ736A6hct3q'
//   },
//   {
//     author: '0x9b776f682C03Ca462ceE8607a2ad7471DF015e13',
//     title: 'Lost In Base',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1RMmJKaEw5ZEZmdjFiOFNBN2E1b2YxUVNZU0RKMWZtSG1jclRmQU5wWXV2Vg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmQ2bJhL9dFfv1b8SA7a5of1QSYSDJ1fmHmcrTfANpYuvV',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmVYuQf1VFukhCxf13z5eikUUb3ZejZJYtpD9CmFjxWZ37'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Oil Based Pepe',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1ZaHdMVkhWZUU0aFZmaDVBbmZ4QXp5bnNRaGZxdFgyekpzU3l0bzJpQXhTTg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmYhwLVHVeE4hVfh5AnfxAzynsQhfqtX2zJsSyto2iAxSN',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmNbFroVE6rjAJDUo1YRHwFcaqVgishx8F55RbYXyNvxnh'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Blue Watcher ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WYjhrNlA1clNGaXNGYWZYSEdpSnhCcEV3amtZdnROa01aWnlkb01CZTZROQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVb8k6P5rSFisFafXHGiJxBpEwjkYvtNkMZZydoMBe6Q9',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmU2wri8DGP79FqJ8gfQotB4JaiQMzPUN1FX7TJcpXk5ct'
//   },
//   {
//     author: '0x82D746d7d53515B22Ad058937EE4D139bA09Ff07',
//     title: 'Shower Thpughts ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jTmJpeEVlcXdpcmcxNWJxZjdQTW4xNWNHQTE3cWF2cHJDRm1IVDZxckYxbQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmcNbixEeqwirg15bqf7PMn15cGA17qavprCFmHT6qrF1m',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmYryQWghJNGxgaPQQk79xtiSAcWuVyutNWqax3SkwUut5'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: 'Based Array',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1QMzlMWk5mUEFRekV6c0tjbWZiYmdGYm43WDExR0NIc01hYjdCU21RNmc3NQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmP39LZNfPAQzEzsKcmfbbgFbn7X11GCHsMab7BSmQ6g75',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmNYpXTjkdgYsTc3YkGR1fMyetp29dD5iFNmXwifKgigYj'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: '☕️ Baseduccino',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WOUVpcEVDTEJ3dEw5V2p2ajFEUXI2NnhnSnV6czh3MWh4TnQ4eG8yc05UcA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmV9EipECLBwtL9Wjvj1DQr66xgJuzs8w1hxNt8xo2sNTp',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmbcrDVANVr7FRzfTySnBSWg9Ms53iSr9azvna7TVzU9qZ'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: '🎨 Based Pollock',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kUGZwVzE3dDNMaldER2RENmtralIxR2h1VjNvRDRhZUVRTW1FTURSVGhlcw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdPfpW17t3LjWDGdD6kkjR1GhuV3oD4aeEQMmEMDRThes',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmR9ETnbXrFdnGFEP8xicBjQ6VpaVWKxZdSWVSewBhXM6h'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: 'Midnight Mint',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WTXFic3Nid3NRamVMOHpyOVNpMksxUDJjMlVoYm82ZERwdGZabncxTUdpZA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVMqbssbwsQjeL8zr9Si2K1P2c2Uhbo6dDptfZnw1MGid',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmTPAsQ3vZqCzr8jaygVCZuToUNoVySe3ouH9Tnw5cHTQA'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Base Monalisa',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1Wc1EzUXZkR1ZDUTVxb1BXanp0akVLVDQ4bWFjdGNaamRUUVY2S1RGaFI1Zg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVsQ3QvdGVCQ5qoPWjztjEKT48mactcZjdTQV6KTFhR5f',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmcJDKbQoePbMvCJxokcn4Gq3A344Fy5axyzJyFrpH8R4M'
//   },
//   {
//     author: '0xC6fc505cAfE212a57c97a98B208a80e532010686',
//     title: 'Internship Management',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1ad0Z5QUtNaXBzejQxUm5SVGNxbUxiTUozanNXRVp6dWlCbWkxTGlNbXpnRA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmZwFyAKMipsz41RnRTcqmLbMJ3jsWEZzuiBmi1LiMmzgD',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmaGYUCGfGJYqGK8tJAFvdBQuPKHokNu5QRZjiyYmdYwFG'
//   },
//   {
//     author: '0xC6fc505cAfE212a57c97a98B208a80e532010686',
//     title: 'The Mummy Pepe',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1iNHM3MlRicmoxRHpFMmV6OFVhU2FOSmlVNzNGWWpqeTZuRUFrcGk5bXc2cg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmb4s72Tbrj1DzE2ez8UaSaNJiU73FYjjy6nEAkpi9mw6r',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPCMQkaZNcprMpduK8zkpPYt7WakSh8uuFASFEh4H7V4g'
//   },
//   {
//     author: '0xD433BB220A696E9CDc2e534f0127eC115DaEf18A',
//     title: 'Based At The Beach ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lTWlFOVFtS0JYZUpXNjRvWVJTU2lNcjZkWUFhUU1iNXk1RzIzZ0d2TmJ0Yg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmeMiE9QmKBXeJW64oYRSSiMr6dYAaQMb5y5G23gGvNbtb',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmU966RM2MJWefxR1m8dCeyYQKZHFEA3cTUrHEhnmfQAWk'
//   },
//   {
//     author: '0x888c1B86000BbBDb2223A0b89E3c82AEc9D94297',
//     title: 'Based Management Island (BMI)',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1aNmdUREFDU0cxM2d2YkpjRmdyNWEyQnJHVTZBVWJ1TEZIVkR2dm5nOUNyeA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmZ6gTDACSG13gvbJcFgr5a2BrGU6AUbuLFHVDvvng9Crx',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRnHLcWBkBzTGCbXuLEmE9R5Y3ipDJVoPxr5p6aef3YJi'
//   },
//   {
//     author: '0x4718ce007293bCe1E514887E6F55ea71d9A992d6',
//     title: 'Don’t Spill The Coffee Next Time',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mUVM1d28zNnFjYlNpemNSc3ZDeUZRdUg2akhLTUQxN25ZemJhdUdzYWRkUQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmfQS5wo36qcbSizcRsvCyFQuH6jHKMD17nYzbauGsaddQ',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmUwUAgfDeAMdX3wkPXpcm3BsyqPzpYG7HMe2qLqVxZ1A7'
//   },
//   {
//     author: '0xC56F9F2f95007Af03277B6b75C7775C0123AfEe6',
//     title: 'Based Panda',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1UbjFtWjZLQ2tNaGdQQm5OSnNWeHZMVG9SNndaeGNucFlhb1pRRnFRRWpNUw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmTn1mZ6KCkMhgPBnNJsVxvLToR6wZxcnpYaoZQFqQEjMS',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmamPHH5QVBEyMZNefSpx75D5VCU48NwXNeGDcMYPmVGmM'
//   },
//   {
//     author: '0x0fd6054D71277817896e56c7209B6Ad1c40922d5',
//     title: 'Based MGMT',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1ZS1FWRFBackd6ejRxcERSTjg3TDhDQ202RG9OU1p1aThlOVVzeVM2QVp6aA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmYKQVDPZrGzz4qpDRN87L8CCm6DoNSZui8e9UsyS6AZzh',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmQButntiUvALg7AFVXDBSWF3MNcy35oypUGT6iQXPC4jq'
//   },
//   {
//     author: '0xa260CF1726a6a5e0B7079f708823FC8E884611CB',
//     title: 'Based',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1ld0dZYlpjM2hGa3ZGRndXREVlTEVVcHY5Q1JFV1VHbWh5bmZBa1hNYzY3SA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmewGYbZc3hFkvFFwWDEeLEUpv9CREWUGmhynfAkXMc67H',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmeL1CtMpRU5j3KRJYpgykQM2Ed7FjnY54P9c8YFsVzxc7'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: 'Swirl',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jckM3d3hUZ3JNclVtdXQzVjJzcTdWazZYR21CUk5ONzN0WUdLQnZKRUF1Ng==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmcrC7wxTgrMrUmut3V2sq7Vk6XGmBRNN73tYGKBvJEAu6',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPwd5mFcR6HkxhNF8kR8fjNstwRkHMrpVcK4RVErma7VX'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Vintage: Marilyn Effect',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1Tb1pndFRWR3NTYVNHMUJjclRLUHhoRkRuYm9UdGhleE5ZN2plOE1FUXJ5NQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmSoZgtTVGsSaSG1BcrTKPxhFDnboTthexNY7je8MEQry5',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRRJztoN3om8PGChmHbs3StA7f6j5Xkmt2XYHThefrpy6'
//   },
//   {
//     author: '0x589FFBbdA0EaCD5A9C2BA208b379c886B2630503',
//     title: 'Home Base City View ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1SQmV0S3VMRXhZZndMVWNpaWRTZkd6aXBRRGtvUUJHWGM2ZlBIaWtEM0dnMg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmRBetKuLExYfwLUciidSfGzipQDkoQBGXc6fPHikD3Gg2',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmSLMWMj6KhLUA1wocnCyskYWXSs6ig3F6gRY4XCDjzVxv'
//   },
//   {
//     author: '0x7Eb4655fdA4e8Cbc716af595BB961C29dDEA58F1',
//     title: 'Seek peacefully, you will find.',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XR3VTV3Z3UUNpYTI2UURXUmp6QnFKSDlTNFVMV0xrbWJqd2ozaHR0VUhjWQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWGuSWvwQCia26QDWRjzBqJH9S4ULWLkmbjwj3httUHcY',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmUwwPwSVZn9VozNCeLtEM3WwgBCZBakg4YWc2tt3vAcpf'
//   },
//   {
//     author: '0x82D746d7d53515B22Ad058937EE4D139bA09Ff07',
//     title: 'PePe Warhol',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1SSkZoUHpWdGVraW1vTjRaYVZXd3NnNTV0SEhuNHhNM2o5ZFFuUUNqR29nYw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmRJFhPzVtekimoN4ZaVWwsg55tHHn4xM3j9dQnQCjGogc',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmReSzrbJ9J4xCAHk1DpSeZWZUG6m2hY4cR5aRLFYcbdUe'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Vintage: Use Scarf Woman',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1hQnh5VkV4c0ptWWVtdURTY3Zad2l5YW9vV1pEWnJ1OHhDeDlhU0d4MW9IdA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmaBxyVExsJmYemuDScvZwiyaooWZDZru8xCx9aSGx1oHt',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/Qmd9mPJGiy3Z6jsFhuDV1K8fZw4t4AFYAMXXkFAPDYbAtg'
//   },
//   {
//     author: '0x82D746d7d53515B22Ad058937EE4D139bA09Ff07',
//     title: 'Norm',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lemU4M2RjdVRHeDF0ZE1IVlpaRTRyWDNMQnozc1VzUDFCQ2dKbVoza1d6Yw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmeze83dcuTGx1tdMHVZZE4rX3LBz3sUsP1BCgJmZ3kWzc',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmWrt5XVTq2pegC1nGP4PeU2LGQJ83zUvhiTMUAXEqgUW4'
//   },
//   {
//     author: '0xd5272277ceeC9963b3f95A07DA11508FBc06589d',
//     title: 'Lonely Man',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kaEhaQXQya2c3dTd4QUJTdkcyZGduN3JEWXp4UWlrNHdNeWdrbkhrSjU0dQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdhHZAt2kg7u7xABSvG2dgn7rDYzxQik4wMygknHkJ54u',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmXGVxv7mVaZkDCjBf1KJfagS8XPHzVoQNvuGn8xDN54EH'
//   },
//   {
//     author: '0x589FFBbdA0EaCD5A9C2BA208b379c886B2630503',
//     title: 'Soba Is Based',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jaVIyM2h5dzl2S25mYUZkUTFibVZkQTJlNTRuWE5aNnJvaFFxdnZLdFIyYQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmciR23hyw9vKnfaFdQ1bmVdA2e54nXNZ6rohQqvvKtR2a',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmdsRHND3CTpk3F16ZLMsXX3BpD3ty1YdbQA1gJf2co9ES'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Land Of Purity',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1hWldOUmJXM3lzTmZkU293OUdKdzdzRUZKOVNRWU5jWjJOWm95YnBXN3RaRw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmaZWNRbW3ysNfdSow9GJw7sEFJ9SQYNcZ2NZoybpW7tZG',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmT6RCNj9iRNHBSb75Zw6JVvbAAqYUPDCu2zvhu9iuGG87'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Touch Grass',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1UOFhHbW9hb2VuNEoxRDl5Q1BocG80ZlE5cHlGQ296V2hEWFFYcnNOblQ3Ng==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmT8XGmoaoen4J1D9yCPhpo4fQ9pyFCozWhDXQXrsNnT76',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmcNfprFg9ASGnyg8AEn6QTMqkoZhPaCxYpdCUmTvsxa7P'
//   },
//   {
//     author: '0x86D7d69D22e060665d9F43903a6D9f9cE8dCd996',
//     title: 'We All Friends',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lWlFoc1A1a0VGcHVHTWM2bXRmNzJ4ZGN2SkRoRm13NTlqNEF2eWhKYUxCcg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmeZQhsP5kEFpuGMc6mtf72xdcvJDhFmw59j4AvyhJaLBr',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmZb863FnzhYXq2VcjohoS5pbCAjpXZTmiWAWwAJZHMZ5L'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Unusual Monday: The Punisher ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1WSktvUlZxaW0zb2VHeGFFOXpHZlpNdmhxOGpjM1VaYUNzWUoyc0F2MmZrRQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmVJKoRVqim3oeGxaE9zGfZMvhq8jc3UZaCsYJ2sAv2fkE',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmQF2JSs4xN4uomfsmeHXY4YDjavDcnNgXRsrTYPqgxN5A'
//   },
//   {
//     author: '0x9b776f682C03Ca462ceE8607a2ad7471DF015e13',
//     title: 'GhostBase Thrillah',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jZFhmenM4b0h0QVoxUUpjdHJ5S3g0Skppc3Bka25kZ3ZqTnBpV0ZyUEdMVg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmcdXfzs8oHtAZ1QJctryKx4JJispdkndgvjNpiWFrPGLV',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmVJyH4TFuPHJELiD7Cz2JtcgYz7dDYxynbLxnhr5jFNPm'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Gifted: Queen B',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1iMkVXcnV5TFFYRDRlckZ3ZkFLamRDdTJzcDh3N0tVOUhrejliY0dVZDdudQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmb2EWruyLQXD4erFwfAKjdCu2sp8w7KU9Hkz9bcGUd7nu',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/Qma3eY1N72URvZACapR3WYg9BxvkoAV4P58NntLV9w1Gan'
//   },
//   {
//     author: '0x5d5D1c3179aDdf4A598818421047Ffa622052eF6',
//     title: 'Based & Atomic',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mWEZuWk1oQ01OSkZyWUQ3aDVtWmFOcEFRdmFlamppTWVZanJGb0h2QVlLYQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmfXFnZMhCMNJFrYD7h5mZaNpAQvaejjiMeYjrFoHvAYKa',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRtmnHrrW1hqFrzMyaS57j4F2oam4JyDyYjDFSfey2ziA'
//   },
//   {
//     author: '0xC443c18Ea6A6c6261a1E1be8449aFd691D664796',
//     title: 'Based Ruins',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1TWGQxMVVxV2NwZHRXY3VmVnhMUmsybWE4TnMxS1dZSmZFVmF6N2pYVnNxTg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmSXd11UqWcpdtWcufVxLRk2ma8Ns1KWYJfEVaz7jXVsqN',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmbnRxRBWd3cjH69XbCjkFevH4vtMLajQQiuTWs7G5zYmB'
//   },
//   {
//     author: '0xC443c18Ea6A6c6261a1E1be8449aFd691D664796',
//     title: 'Based World Vision',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jTWR4WkxqZW95QlR5dE1vR3dRTEdZMnRjTUxOc0tjTkNOZDVSMUI0WEgxSA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmcMdxZLjeoyBTytMoGwQLGY2tcMLNsKcNCNd5R1B4XH1H',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmVJhdYJTXTiT49wVAMNbNENR6HjAKZB2kft4Jk5oSyZBh'
//   },
//   {
//     author: '0xC443c18Ea6A6c6261a1E1be8449aFd691D664796',
//     title: 'Working From Home With A Based Intern',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1Vc2hlTnFQTG54a25uVDl6M0hSVGFwYWV4RmYyQUNxWU1US3hadXpUQ002NQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmUsheNqPLnxknnT9z3HRTapaexFf2ACqYMTKxZuzTCM65',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmXMRVodHDBCVQjDoCmen5myNoZHsL92Rr5yW2hExnEm3L'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Headquarters: Just Squint Man ',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kOHhRZkQzdjN5SlhoVHBMSG1WYUU3U3lzODdWWHF1ZVp4NDV5dHBKQjNEdg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmd8xQfD3v3yJXhTpLHmVaE7Sys87VXqueZx45ytpJB3Dv',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmXS6BAVw679fKMJ9ZW1zSXaUPyc2LKRo6Espzh3s7ATcf'
//   },
//   {
//     author: '0xD66fa7a53803E34fAd9A0eCbd52111E93d0B3542',
//     title: 'Orman Gülü',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1Sc05xbnlkV3dwUFlpM2J1Qk1uaUtHNnI1WGN4WEdkN2c1SzZRWm5ZekhzOQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmRsNqnydWwpPYi3buBMniKG6r5XcxXGd7g5K6QZnYzHs9',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmSKL89DbHVRAfULA8ucUASddnvtgSCD2TDz3tZYuSkk3h'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Intern’s Ink: Pepe Clan',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1QdXV2Ujg0aGFCTldhMXo1cFpFMTg0aVVzS28zU3RkUGhzaXdUS1pwNW12cw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmPuuvR84haBNWa1z5pZE184iUsKo3StdPhsiwTKZp5mvs',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmeZJeaKwQCDrZZ2hReSnF8eGubA6Mcbo6k2kqsbDKBzKV'
//   },
//   {
//     author: '0xA33BA7BF6f2343169de5a0496Cd76dA8839ea3e6',
//     title: 'Based Deluge',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mWGZZMjg3NWtQMkxXRnJHTlozeWNnc1Y1NkVONUhFTndOZEFhUlNLQ0xkRw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmfXfY2875kP2LWFrGNZ3ycgsV56EN5HENwNdAaRSKCLdG',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPwF44z8shMo4nWqyHJrcfHmUn3ss8JnuzZKPVhvFonFk'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Master Piece: Drip On Base',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1mNHM1NDZ0d2pBalpocXdFdW1VV3RYa3pBcmR3a0R5UnhDdnlrR2FVU2hhaA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmf4s546twjAjZhqwEumUWtXkzArdwkDyRxCvykGaUShah',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPfhMecJQs9ueAtMdkCku2hvUGeyqFpgmm57u5vJoAkyH'
//   },
//   {
//     author: '0x7Eb4655fdA4e8Cbc716af595BB961C29dDEA58F1',
//     title: 'Dr. Desab Circa 2023',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1jajh4Mm9oRzRmRkdNRHFkNGk5b3l4Nld1NkUxQW00YXRqTXlLRkdFYXdMVQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmcj8x2ohG4fFGMDqd4i9oyx6Wu6E1Am4atjMyKFGEawLU',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmaLHdMutKWGVCkUWs2VpPFAR3uDbzBTS9V1e4CSAE4Mxh'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Boardroom Art 001',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1YMlBFOWZVOHlnYk1LYkM5Q05wZnpKVmFjOVVmVkFYODRpVk54M1QybjZodQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmX2PE9fU8ygbMKbC9CNpfzJVac9UfVAX84iVNx3T2n6hu',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmWmDYyJ8FhD83QmBonH8yw1j6zLCAXoLpJdPXv42Vse34'
//   },
//   {
//     author: '0xF6eb526BFfA8d5036746Df58Fef23Fb091739c44',
//     title: 'Intern Overload',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kUXA1YkQ3d1JkUlE0Y1NUVWI2NFk2UDM4WUYzVWVON0NFMzFtMW5hTm5hVw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdQp5bD7wRdRQ4cSTUb64Y6P38YF3UeN7CE31m1naNnaW',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmTcLrHfp9Lr4zXtKB1i71pVGA5L4MAjbypBQURZfapqXG'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'White Guards',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lN3RlWGMxQjRldEQyMTVvMjRWVFZURjZXSmQ2c3FZdFVpckFZTEVZNmJhZQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qme7teXc1B4etD215o24VTVTF6WJd6sqYtUirAYLEY6bae',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmPB6HzDC1AFw3b4mKhvkhhYGUdKnxCQj3tp4EukEUrhvj'
//   },
//   {
//     author: '0x9b776f682C03Ca462ceE8607a2ad7471DF015e13',
//     title: '1001: A Based Odyssey',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lZ1pyQW5uczdyWDlXcmhIdldwMzhOdWNrQ3RYSHpkeWg3UTRDV3lkTmI3Rw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmegZrAnns7rX9WrhHvWp38NuckCtXHzdyh7Q4CWydNb7G',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmezTLiw5j4JA7oPfWtp96ppi18XcNWeFKCs2JF5CpNest'
//   },
//   {
//     author: '0xB70399fc376c1B3Cf3493556d2f14942323eF44f',
//     title: 'Reverse Engineered Data Based Pepe',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kR2hCWVdZWlZxTjUzOGk3TEQ2Wk5uN0VqR0NXNFM2OUZjN1ZxZzhmV0t5VQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdGhBYWYZVqN538i7LD6ZNn7EjGCW4S69Fc7Vqg8fWKyU',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmV9mqZM8NVYfSs9SKGb9rJZqd6SDzDTXxGmJxr8LRsAYm'
//   },
//   {
//     author: '0x82D746d7d53515B22Ad058937EE4D139bA09Ff07',
//     title: 'SnackChain Technology',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XVXoyblBoUlhUUXBIaXY0aDhCczZrRFVBYUE0bmh6cFFkZkQzTXRuVFhMTA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWUz2nPhRXTQpHiv4h8Bs6kDUAaA4nhzpQdfD3MtnTXLL',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmeXPoBVkp6jYBKnsK3gjbu9Kmf8NrG9bt5pwLDeMBisNc'
//   },
//   {
//     author: '0xe55608962FC9C6d0b7e14BB6b660DFb71F69b868',
//     title: 'Enfranchisement: Managers Only',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1YTjJBUDJiTW9Dc1ZHcUJXcDlXb3A3dDRjOG1aTGdzTW04RTJTdDltRVB2Qg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmXN2AP2bMoCsVGqBWp9Wop7t4c8mZLgsMm8E2St9mEPvB',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmS27RrZYpWwC7SSMSnf9MXzYDC4v4UcvonMg3W8it5GyM'
//   },
//   {
//     author: '0x2AAB747822B72B9E749252899f19f92E107454DC',
//     title: 'Intern Note Taker',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1lc1RkTllvRW9uZURqRDF6Ujh3VXZqQndzZUpFSEZUVUZhaXJDQVRnOHY5bw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmesTdNYoEoneDjD1zR8wUvjBwseJEHFTUFairCATg8v9o',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmSr5pkDA5s6fDAxeTZjoxanDuSHjzjEkPc5vu7mm8YpmK'
//   },
//   {
//     author: '0xC443c18Ea6A6c6261a1E1be8449aFd691D664796',
//     title: 'Based Vision Air',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1UeGZTQVBhUnplMkI4ZFhEM1ZyblJwSzNvQVR3Y28yU0tqUEJpMm9HOHdDcA==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmTxfSAPaRze2B8dXD3VrnRpK3oATwco2SKjPBi2oG8wCp',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmTHVxNdzzqNiqLs9sdAUDRerMNRfYA3eHRQnjdshfLnYr'
//   },
//   {
//     author: '0x7e07064E5A921A57Eb29C22F179B20513e8a3485',
//     title: 'I Looked Outside And It Was All Based',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1TWm5peFRnUTljOFBxYXhEZDdtcVRrQkJQTjJ5ZWo0S0pIRzczRG9mOHBrbw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmSZnixTgQ9c8PqaxDd7mqTkBBPN2yej4KJHG73Dof8pko',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmbN8xYGwCgXfC4biiW4bfHBDqfD29qURmNrGiMLCz7mzC'
//   },
//   {
//     author: '0x98a9B1596F1837EB20669EdD4409FDFb02FFAdf0',
//     title: 'Based Voxel',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1iN3pUcWZtRXhwYXl5NkdKaDhvcEhkYzhYaUxTeGZpZ3VwREVBM2hCN0NFZw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/Qmb7zTqfmExpayy6GJh8opHdc8XiLSxfigupDEA3hB7CEg',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmfAyfhunyTPEw15M7JszLkDbWHenEw9mJUZReQKqTFWde'
//   },
//   {
//     author: '0x5BbC0D3155A63BE7D0a849FB61dB0bd9d3Ba666A',
//     title: 'Bitcoin To The moon',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1XUWRUV0t4MVFvUGd1cDJuYnJWUWZnTkZTRG0yNmtzNGs0ZGVZMlZjVUZNZQ==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmWQdTWKx1QoPgup2nbrVQfgNFSDm26ks4k4deY2VcUFMe',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmRypc2RhBPqL1kteVzwXd5q2T5CNSuodUDh4kLC85tuD3'
//   },
//   {
//     author: '0xdb2d6fb485d9aD7C6d4b3E3964870E3F772591B9',
//     title: 'BASE SPACE',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1acVBOYnhyQ1lqdjdVM2hiZEppODlDajc2VDR0Z3F6a2E5Y2Z3VGdOTE5ORg==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmZqPNbxrCYjv7U3hbdJi89Cj76T4tgqzka9cfwTgNLNNF',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/Qmeuz5RJ4J5yZApK6nnmVuW5iYbwuG4NdhAfaYC9zx7QWe'
//   },
//   {
//     author: '0x8Ed7E8Faa587A495E656eb730c483d90f3beCA12',
//     title: 'An Interns Breakfast Is Their Most Important Meal Of The Day',
//     primaryMedia: 'https://images.mirror-media.xyz/nftembedsmedia/aHR0cHM6Ly9hMmJmNWIwNDA5MGZmMDA0ZjcwZjc4MGJmYzM5ZjIzOS5pcGZzY2RuLmlvL2lwZnMvUW1kWGVXWVdBcHZyaTE5dFdaUVoyaG5XNlVIV2NGODRFOUVFN3JrOVZ3WWZyMw==?mimetype=image/jpeg',
//     ipfsImageUrl: 'https://uplink.mypinata.cloud/ipfs/QmdXeWYWApvri19tWZQZ2hnW6UHWcF84E9EE7rk9VwYfr3',
//     submissionLink: 'https://uplink.mypinata.cloud/ipfs/QmZ5VEMmMZvac7x7d1tQ2EZJo2CzPSWbq4g7WmnSyqFJLm'
//   }
// ]



// type SignalData = {
//   author: string;
//   title: string;
//   primaryMedia: string;
//   ipfsImageUrl: string;
//   submissionLink: string;
// }

// const chunkArray = (array: any, size: any) => {
//   const chunkedArray = [];
//   let index = 0;
//   while (index < array.length) {
//     chunkedArray.push(array.slice(index, size + index));
//     index += size;
//   }
//   return chunkedArray;
// }

// let shouldRun = true;
// const onSignal = async () => {
//   if (!shouldRun) return;
//   console.log('spinning up the thread');

//   //   const authors = signalData.map((el: SignalData) => {

//   //     const newUser: dbNewUserType = {
//   //       address: el.author,
//   //     }

//   //      return newUser;
//   //   });

//   //   // insert authors into db

//   //   let errs: any = [];
//   //   let success = [];

//   //   const chunkedArray = chunkArray(authors, 10);

//   //   for (const chunk of chunkedArray) {
//   //     const result = await Promise.all(chunk.map(async (el: dbNewUserType) => {
//   //       try {
//   //         await db.insert(schema.users).values(el)
//   //         success.push(true)
//   //       } catch (err) {
//   //         console.log(err);
//   //         errs.push(el.address);
//   //       }
//   //     }))
//   //   }

//   //   console.log(JSON.stringify(errs, null, 2))
//   //   console.log(success.length)
//   //   console.log(errs.length)
//   //   shouldRun = false;
//   // }


// //   const submissionData = signalData.map((el: SignalData) => {
// //     const newSubmission: dbNewSubmissionType = {
// //       contestId: 262,
// //       author: el.author,
// //       created: new Date().toISOString(),
// //       type: "standard",
// //       url: el.submissionLink,
// //       version: 'uplink-v1'
// //     }

// //     return newSubmission;
// //   });


// //   console.log(submissionData)

// //   const res = await db.insert(schema.submissions).values(submissionData)
// //   console.log(res);

// //   console.log('done');

// // }


// // onSignal();


console.log(`🚀  Server ready at: ${url}`);