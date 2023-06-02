import 'server-only';
import graphqlClient from "@/lib/graphql/initUrql";
import gql from 'graphql-tag';
import { cache } from 'react';

const ContestByIdDocument = gql`
    query Query($contestId: Int!){
        contest(contestId: $contestId){
            id
            spaceId
            created
            promptUrl
            metadata {
                category
                type
            }
            deadlines {
                startTime
                voteTime
                endTime
                snapshot
            }
            submitterRestrictions {
                restrictionType
                tokenRestriction {
                    threshold
                    token {
                        address
                        decimals
                        symbol
                        tokenHash
                        tokenId
                        type
                    }
                }
            }            
            submitterRewards {
                rank
                tokenReward {
                    amount
                    token {
                        tokenHash
                        symbol
                        decimals
                        address
                        tokenId
                        type
                    }
                    tokenId
                }
            }
            voterRewards {
                rank
                tokenReward {
                    amount
                    tokenId
                    token {
                        tokenHash
                        type
                        address
                        symbol
                        decimals
                        tokenId
                    }
                }
            }
            votingPolicy {
                strategyType
                arcadeVotingPolicy {
                    token {
                        tokenHash
                        type
                        address
                        symbol
                        decimals
                        tokenId
                    }
                    votingPower
                }
                weightedVotingPolicy {
                    token {
                        tokenHash
                        type
                        address
                        symbol
                        decimals
                        tokenId
                    }
                }
            }
        }
    }`;


// these are static params. we should cache them every time
export const getContestById = cache(async (contestId: number) => {
    console.log('getContestById')
    const response = await graphqlClient.query(ContestByIdDocument, { contestId })
        .toPromise();
    return response
})

