import { InvalidArgumentError } from "../errors.js";
import { getSupportedChains } from "./constants.js";
import { isAddress } from "viem"
import { ContractID, TokenIntentWithMetadata, TokenMetadata, V1TokenWithMetadata, V2TokenWithMetadata } from "../types.js";
import { schema } from "lib";
import { IChannel, IToken } from "@tx-kit/sdk";
import { cachedFetch } from "./cachedFetch.js";
import { Address } from "viem";

export const concatContractID = ({ chainId, contractAddress }: { chainId: number, contractAddress: string }) => {
    return `${contractAddress}-${chainId}` as ContractID;
}

export const splitContractID = (contractID: string): { chainId: number, contractAddress: `0x${string}` } => {
    const [contractAddress, chainId] = contractID.split("-");

    if (!getSupportedChains().includes(parseInt(chainId))) {
        throw new InvalidArgumentError(`Invalid contract address: ${contractAddress}`);
    }

    if (!isAddress(contractAddress)) {
        throw new InvalidArgumentError(`Invalid contract address: ${contractAddress}`);
    }

    return { chainId: parseInt(chainId), contractAddress: contractAddress as `0x${string}` };
}

export const parseIpfsUrl = (url: string) => {
    if (url.startsWith('ipfs://')) {
        const hash = url.split('ipfs://')[1];
        return {
            raw: url,
            gateway: `https://uplink.mypinata.cloud/ipfs/${hash}`,
        }
    }
    if (url.startsWith('https://uplink.mypinata.cloud/ipfs/')) {
        const hash = url.split('https://uplink.mypinata.cloud/ipfs/')[1];
        return {
            raw: `ipfs://${hash}`,
            gateway: url,
        }
    }
    return {
        raw: url,
        gateway: url,
    }
}


export const parseV1Metadata = (v1Response: schema.dbZoraTokenType): V1TokenWithMetadata => {
    return {
        ...v1Response,
        id: v1Response.id.toString(),
        totalMinted: v1Response.totalMinted.toString(),
        metadata: {
            id: 'uplink-v1', // these don't have top level json ipfs hashes
            name: v1Response.name,
            description: v1Response.description,
            image: parseIpfsUrl(v1Response.imageURI).gateway,
            animation: v1Response?.animationURI ? parseIpfsUrl(v1Response.animationURI).gateway : '',
            type: 'uplink-v1',
        }
    }
}

export const parseV2Metadata = async (token: IToken): Promise<V2TokenWithMetadata> => {

    if (!token.metadata) {
        try {
            const uri = parseIpfsUrl(token.uri).gateway;
            const metadataFn: () => Promise<TokenMetadata> = () => {
                return fetch(uri)
                    .then((res) => res.json())
                    .then(data => {
                        return {
                            id: token.uri.split("ipfs://")[1],
                            name: data.name,
                            description: data.description,
                            image: data.image,
                            animation: data.animation_uri || '',
                            type: data.type,

                        }
                    })
            }

            const resolvedMetadata: TokenMetadata = await cachedFetch(uri, metadataFn);

            return {
                ...token,
                metadata: resolvedMetadata
            };

        } catch (e) {
            return token;
        }

    }

    return token;
}


/// todo - we really don't need to do this here. we can save the metadata in the db if we want to

export const parseIntentMetadata = async (intentResponse: schema.dbTokenIntentType): Promise<TokenIntentWithMetadata> => {

    const { tokenIntent } = intentResponse;
    const parsedIntent = JSON.parse(tokenIntent);
    const uri = parseIpfsUrl(parsedIntent.intent.message.uri).gateway;
    const metadataFn: () => Promise<TokenMetadata> = () => {
        return fetch(uri)
            .then((res) => res.json())
            .then(data => {
                return {
                    id: parsedIntent.intent.message.uri.split("ipfs://")[1],
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    animation: data.animation_uri || '',
                    type: "uplink-v2",

                }
            })
    }

    const resolvedMetadata: TokenMetadata = await cachedFetch(uri, metadataFn);

    return {
        ...intentResponse,
        ...parsedIntent,
        metadata: resolvedMetadata,
        uri: parsedIntent.intent.message.uri,
        maxSupply: parsedIntent.intent.message.maxSupply,
        totalMinted: "0",
    };
}
