import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import Decimal from 'decimal.js';

export const DecimalScalar = new GraphQLScalarType<Decimal, string>({
    name: 'Decimal',
    description: 'Custom scalar type for decimal values using Decimal.js',

    // Convert the internal Decimal.js value (server-side) to the value sent to the client
    serialize: (value): string => {
        if (!(value instanceof Decimal)) {
            throw new TypeError('DecimalScalar encountered a non-Decimal value during serialization');
        }
        return value.toString();
    },
    // Parse the value received from the client into the internal Decimal.js value (server-side)
    parseValue: (value: unknown): Decimal => {
        console.log('PARSE VALUE is ', value)
        if (typeof value !== 'string') {
            throw new TypeError('Decimal values must be a string');
        }
        try {
            return new Decimal(value);
        } catch (error) {
            throw new TypeError('Invalid decimal value');
        }
    },

    // Parse the value from the GraphQL query language (AST)
    parseLiteral: (ast: ValueNode): Decimal => {
        if (ast.kind !== Kind.STRING) {
            throw new TypeError('Decimal values must be a string');
        }
        try {
            return new Decimal(ast.value);
        } catch (error) {
            throw new TypeError('Invalid decimal value');
        }
    },
});
