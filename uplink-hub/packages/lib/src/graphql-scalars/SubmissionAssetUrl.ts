import { GraphQLScalarType, Kind } from 'graphql';
import { isIpfsUrl } from './IpfsUrl.js';

export const isYoutubeUrl = (value: unknown): value is string => {
    if (typeof value !== 'string') {
        return false;
    }
    const pattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    return pattern.test(value);
}


export const SubmissionAssetUrlScalar = new GraphQLScalarType({
    name: 'SubmissionAssetUrl',
    description: 'Submission asset URL scalar that accepts IPFS and YouTube URLs',
    serialize(value: unknown): string {
        if (typeof value !== 'string') {
            throw new TypeError(`Value is not a string: ${value}`);
        }
        if (!isIpfsUrl(value) && !isYoutubeUrl(value)) {
            throw new TypeError(`Value is not a valid IPFS or YouTube URL: ${value}`);
        }
        return value;
    },
    parseValue(value: unknown): string {
        if (typeof value !== 'string') {
            throw new TypeError(`Value is not a string: ${value}`);
        }
        if (!isIpfsUrl(value) && !isYoutubeUrl(value)) {
            throw new TypeError(`Value is not a valid IPFS or YouTube URL: ${value}`);
        }
        return value;
    },
    parseLiteral(ast): string {
        if (ast.kind !== Kind.STRING) {
            throw new TypeError(`Can only parse strings to submission asset URLs but got a: ${ast.kind}`);
        }
        if (!isIpfsUrl(ast.value) && !isYoutubeUrl(ast.value)) {
            throw new TypeError(`Value is not a valid IPFS or YouTube URL: ${ast.value}`);
        }
        return ast.value;
    },
});
