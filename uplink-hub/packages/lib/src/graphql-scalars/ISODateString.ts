import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const ISODateStringScalar = new GraphQLScalarType({
    name: 'ISODateString',
    description: 'Date in ISO format',
    parseValue(value: unknown): string {
        // The `parseValue` function parses the scalar value from the client to the server.
        if (typeof value !== 'string') {
            throw new TypeError(`Value is not a string: ${value}`);
        }
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) {
            throw new TypeError(`Value is not a valid ISO date string: ${value}`);
        }
        return value;
    },
    parseLiteral(ast: ValueNode): string {
        // The `parseLiteral` function parses the scalar value from the query string.
        if (ast.kind !== Kind.STRING) {
            throw new TypeError(`Can only parse strings to ISODateString but got a: ${ast.kind}`);
        }
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(ast.value)) {
            throw new TypeError(`Value is not a valid ISO date string: ${ast.value}`);
        }
        return ast.value;
    },
});


