import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from 'graphql-tag';
import { readFileSync } from "fs";
import resolvers from "./resolvers/index.js";
const typeDefs = gql(readFileSync("./schema.graphql").toString('utf-8'));
import cookie from 'cookie';
import dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.USER_SERVICE_PORT)

//const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers })});


// initialize the apollo server with buildSubgraphSchema and context
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async ({ req }) => {
    // get the 'session-cookie' + csrfToken header from the request
    const token = cookie.parse(req.headers['session-cookie'] || '');
    const csrfToken = req.headers['x-csrf-token'] || ''
    // add the user + csrf to the context
    return { token, csrfToken };
  }
});

console.log(`🚀  Server ready at: ${url}`);
