import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/federation";
import gql from 'graphql-tag';
import { readFileSync } from "fs";
import resolvers from "./resolvers/index.js";
const typeDefs = readFileSync("./schema.graphql").toString('utf-8');
//sss
const server = new ApolloServer({
    schema: buildSubgraphSchema([
        {
            typeDefs: gql `${typeDefs}`,
            resolvers
        }
    ])
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
