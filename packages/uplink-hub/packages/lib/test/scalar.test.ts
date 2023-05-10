import { DecimalScalar } from "../src/graphql-scalars/Decimal";
import { describe, expect, test, jest, beforeEach, beforeAll } from '@jest/globals';
import Decimal from 'decimal.js';
import { Kind, ValueNode } from 'graphql';


describe('DecimalScalar', () => {
    test('should correctly serialize Decimal.js value', () => {
        const value = new Decimal('100.50');
        expect(DecimalScalar.serialize(value)).toBe('100.5');
    });

    test('should throw an error during serialization if the input is not a Decimal.js value', () => {
        expect(() => {
            DecimalScalar.serialize('100.50');
        }).toThrow(TypeError);
    });

    test('should correctly parse the value received from the client into the internal Decimal.js value', () => {
        const value = '100.50';
        expect(DecimalScalar.parseValue(value)).toEqual(new Decimal(value));
    });

    test('should throw an error during parsing if the input is not a string', () => {
        expect(() => {
            DecimalScalar.parseValue(100.50);
        }).toThrow(TypeError);
    });

    test('should throw an error during parsing if the input string is not a valid decimal', () => {
        expect(() => {
            DecimalScalar.parseValue('abc');
        }).toThrow(TypeError);
    });

    test('parses a string literal into a Decimal object', () => {
        const ast = {
            kind: Kind.STRING,
            value: '10',
        } as ValueNode;
        expect(DecimalScalar.parseLiteral(ast)).toEqual(new Decimal('10'));
    });

    test('throws an error if an invalid string literal is parsed', () => {
        const ast = {
            kind: Kind.STRING,
            value: 'foo',
        } as ValueNode;
        expect(() => DecimalScalar.parseLiteral(ast)).toThrow(TypeError);
    });

    test('parses a non-string literal into a Decimal object', () => {
        const ast = {
            kind: Kind.INT,
            value: '10',
        } as ValueNode;
        expect(() => DecimalScalar.parseLiteral(ast)).toThrow(TypeError);
    });
});