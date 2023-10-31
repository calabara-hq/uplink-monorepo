import { z } from 'zod';
import { isERCToken, ERCTokenSchema, IToken } from "lib";
import { tokenController } from '../utils/tokenController.js';

const validateTokenStandard = async (token: IToken): Promise<boolean> => {
    if (isERCToken(token)) {
        return tokenController.verifyTokenStandard({
            contractAddress: token.address,
            expectedStandard: token.type,
        })
    }
    return true;
}

// verify that the token id is valid and fungible

const validateERC1155TokenId = async (token: IToken): Promise<boolean> => {
    if (isERCToken(token)) {
        if (token.type === "ERC1155") {
            if (!token.tokenId) return false;

            const [isValidId, isFungible] = await Promise.all([
                tokenController.isValidERC1155TokenId({
                    contractAddress: token.address,
                    tokenId: token.tokenId
                }),
                tokenController.isERC1155TokenFungible({
                    contractAddress: token.address,
                    tokenId: token.tokenId
                })
            ])
            return isValidId && isFungible;
        }
        return true;
    }
    return true;
}

// token validation helper

const validateToken = async (token: IToken): Promise<boolean> => {
    const [isValidStandard, isValidTokenId] = await Promise.all([
        validateTokenStandard(token),
        validateERC1155TokenId(token),
    ])
    return isValidStandard && isValidTokenId;
}

const RefinedERCTokenSchema = ERCTokenSchema

export const VerifiedTokenSchema = z.custom<IToken>().refine(async (token: IToken) => { return token ? await validateToken(token) : true; }, { message: "Invalid token data" })
export type VerifiedToken = z.infer<typeof VerifiedTokenSchema>;