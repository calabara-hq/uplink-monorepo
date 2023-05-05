import { GraphQLScalarType, Kind } from 'graphql';

export const IpfsUrlScalar = new GraphQLScalarType({
  name: 'IpfsUrl',
  description: 'IPFS URL scalar',
  serialize(value: unknown): string {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not a string: ${value}`);
    }
    if (!isIpfsUrl(value)) {
      throw new TypeError(`Value is not a valid IPFS URL: ${value}`);
    }
    return value;
  },
  parseValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not a string: ${value}`);
    }
    if (!isIpfsUrl(value)) {
      throw new TypeError(`Value is not a valid IPFS URL: ${value}`);
    }
    return value;
  },
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(`Can only parse strings to IPFS URL but got a: ${ast.kind}`);
    }
    if (!isIpfsUrl(ast.value)) {
      throw new TypeError(`Value is not a valid IPFS URL: ${ast.value}`);
    }
    return ast.value;
  },
});

function isIpfsUrl(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const pattern = /^(https:\/\/(?:[a-z0-9]+\.(?:ipfs|ipns)\.[a-z]+|cloudflare-ipfs\.com\/ipfs\/[a-zA-Z0-9]+|cloud\.ipfs\.io\/ipfs\/[a-zA-Z0-9]+|ipfs\.infura\.io\/ipfs\/[a-zA-Z0-9]+|dweb\.link\/ipfs\/[a-zA-Z0-9]+|ipfs\.fsi\.cloud\/ipfs\/[a-zA-Z0-9]+|ipfs\.runfission\.com\/ipfs\/[a-zA-Z0-9]+|calabara\.mypinata\.cloud\/ipfs\/[a-zA-Z0-9]+)|ipfs:\/\/[a-zA-Z0-9]+)/;
  return pattern.test(value);
}

