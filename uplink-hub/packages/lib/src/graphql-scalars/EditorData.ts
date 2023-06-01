import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { OutputData, OutputBlockData } from '@editorjs/editorjs';

interface IEditorBlockData<T extends object = object> extends OutputBlockData<string, T> { }

interface IEditorDataWithBlocks {
    time: number;
    blocks: Array<{
        type: string;
        data: IEditorBlockData;
    }>;
    version: string;
}

export const EditorDataScalar = new GraphQLScalarType<IEditorDataWithBlocks, IEditorDataWithBlocks>({
    name: 'EditorData',
    description: 'Editor.js output data',
    serialize: (value) => {
        const editorData = value as IEditorDataWithBlocks;
        if (!isIEditorDataWithBlocks(editorData)) {
            throw new TypeError(`Value is not IEditorData with 'blocks' property: ${value}`);
        }
        return editorData;
    },
    parseValue: (value) => {
        const editorData = value as IEditorDataWithBlocks;
        if (!isIEditorDataWithBlocks(editorData)) {
            throw new TypeError(`Value is not IEditorData with 'blocks' property: ${value}`);
        }
        return editorData;
    },
    parseLiteral: (ast: ValueNode): IEditorDataWithBlocks => {
        if (ast.kind !== Kind.OBJECT) {
            throw new TypeError(`Can only parse objects to IEditorData but got a: ${ast.kind}`);
        }
        if (!ast.fields.some((field) => field.name.value === 'blocks')) {
            throw new TypeError(`Object does not have 'blocks' property: ${ast}`);
        }
        const value = astToObject(ast) as unknown;
        if (!isIEditorDataWithBlocks(value)) {
            throw new TypeError(`Value is not IEditorData with 'blocks' property: ${value}`);
        }
        return value;
    },
});

function isIEditorDataWithBlocks(value: unknown): value is IEditorDataWithBlocks {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    return Array.isArray((value as IEditorDataWithBlocks).blocks);
}

function astToObject(ast: ValueNode): unknown {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
            return Number(ast.value);
        case Kind.OBJECT: {
            const value: Record<string, unknown> = {};
            ast.fields.forEach((field) => {
                value[field.name.value] = astToObject(field.value);
            });
            return value;
        }
        case Kind.LIST:
            return ast.values.map(astToObject);
        case Kind.NULL:
            return null;
        default:
            return undefined;
    }
}

