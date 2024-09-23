import { Request, Response, NextFunction } from 'express'
import { parseV2Metadata, splitContractID } from '../utils/utils.js'
import { clientByChainId } from '../utils/transmissions.js'
import { formatGqlTokens, TOKEN_FRAGMENT } from '@tx-kit/sdk/subgraph'
import { gql } from '@urql/core'
import { V2TokenPage } from '../types.js'
import { dbGetUserManagedSpaces } from '../utils/database.js'



export const getUserManagedSpaces = async (req: Request, res: Response, next: NextFunction) => {
    const userAddress = req.query.userAddress as string

    try {
        const response = await dbGetUserManagedSpaces(userAddress)
        console.log(response)
        res.send(response).status(200)
    } catch (err) {
        next(err)
    }
}

export const getUserOwnedTokens = async (req: Request, res: Response, next: NextFunction) => {

    const userAddress = req.query.userAddress as string
    const chainId = Number(req.query.chainId)
    const contractAddress = req.query.contractAddress as string
    const pageSize = Number(req.query.pageSize)
    const skip = Number(req.query.skip)

    try {
        const { downlinkClient } = clientByChainId(chainId)

        const where = {
            ... (contractAddress ? { token_: { channel_contains: contractAddress.toLowerCase() } } : {})
        }

        const data = await downlinkClient.customQuery(
            gql`
                query($userAddress: String!, $pageSize: Int!, $skip: Int!, $where: TokenHolder_filter!) {
                    user(id: $userAddress) {
                        collectedTokens (
                            first: $pageSize,
                            skip: $skip,
                            where: $where
                        ) {
                            balance
                            token {
                                ...TokenFragment
                            }
                        }
                    }
                }
                ${TOKEN_FRAGMENT}
            `,
            { userAddress: userAddress.toLowerCase(), pageSize: pageSize + 1, skip, where }
        )
            .then(result => result.user.collectedTokens)

        const pageData = data.slice(0, pageSize)

        const resolvedTokensWithUserBalance = await Promise.all(pageData.map(async ({ token, balance }) => {
            const resolvedToken = await parseV2Metadata(formatGqlTokens([token])[0])
            return {
                ...resolvedToken,
                balance
            }
        }))

        const response = {
            data: resolvedTokensWithUserBalance,
            pageInfo: {
                endCursor: pageData.length,
                hasNextPage: data.length > pageSize
            }
        }


        res.send(response).status(200)

    } catch (err) {
        next(err)
    }
}