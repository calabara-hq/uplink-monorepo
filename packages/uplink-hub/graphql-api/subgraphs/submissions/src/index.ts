import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from 'graphql-tag';
import { readFileSync } from "fs";
import resolvers from "./resolvers/index.js";
const typeDefs = gql(readFileSync("./schema.graphql").toString('utf-8'));
const port = 4000

const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });

const { url } = await startStandaloneServer(server, {
  listen: { port: port },
});

console.log(`🚀  Server ready at: ${url}`);
