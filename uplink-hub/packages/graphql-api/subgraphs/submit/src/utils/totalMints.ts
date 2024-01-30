import { DatabaseController, schema, TokenController } from "lib";

const baseTokenController = new TokenController(process.env.ALCHEMY_KEY!, 8453);
const opTokenController = new TokenController(process.env.ALCHEMY_KEY!, 10);
const zoraTokenController = new TokenController(process.env.ALCHEMY_KEY!, 7777777);
const mainnetTokenController = new TokenController(process.env.ALCHEMY_KEY!, 1);
const baseTokenController__testnet = new TokenController(process.env.ALCHEMY_KEY!, 84531);
const opTokenController__testnet = new TokenController(process.env.ALCHEMY_KEY!, 420);
const zoraTokenController__testnet = new TokenController(process.env.ALCHEMY_KEY!, 999);

const getController = (chainId: number) => {
    switch(chainId){
        case 1:
            return mainnetTokenController;
        case 8453:
            return baseTokenController;
        case 10:
            return opTokenController;
        case 7777777:
            return zoraTokenController;
        case 84531:
            return baseTokenController__testnet;
        case 420:
            return opTokenController__testnet;
        case 999:
            return zoraTokenController__testnet;
        default:
            return mainnetTokenController;
    }
}



export const calculateTotalMints = async (posts: any) => {
    const withTotalMints = await Promise.all(posts.map( async (post: any) => {
        const controller = getController(post.edition.chainId)
        const totalMints = await controller.zora721TotalSupply({contractAddress: post.edition.contractAddress})
        return {...post, totalMints: parseInt(totalMints) || 0}
    }))
    return withTotalMints
}