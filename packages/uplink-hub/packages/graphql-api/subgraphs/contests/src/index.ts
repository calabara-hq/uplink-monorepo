import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from 'graphql-tag';
import { readFileSync } from "fs";
import resolvers from "./resolvers/index.js";
const typeDefs = gql(readFileSync("./schema.graphql").toString('utf-8'));
import cookie from 'cookie';

const port = 4000
//const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers })});


// initialize the apollo server with buildSubgraphSchema and context
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: port },
  context: async ({ req }) => {
    // get the user token from the headers
    // get the 'session-cookie' header from the request
    const token = cookie.parse(req.headers['session-cookie'] || '');
    // add the user to the context
    return { token };
  }
});

console.log(`🚀  Server ready at: ${url}`);
