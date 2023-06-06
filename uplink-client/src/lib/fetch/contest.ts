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
            submissions {
                id
                contestId
                author
                created
                type
                url
                version
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
    }
`;

const UserSubmissionParamsDocument = gql`
    query Query($contestId: ID!) {
    getUserSubmissionParams(contestId: $contestId) {
        maxSubPower
        remainingSubPower
        userSubmissions {
            author
            contestId
            created
            id
            type
            url
            version
        }
    }
    }
`;


const UserVotingParamsDocument = gql`
    query Query($contestId: ID!) {
    getUserVotingParams(contestId: $contestId) {
        totalVotingPower
        userVotes {
            votes
            submissionId
        }
        votesRemaining
        votesSpent
    }
    }
`;

// these are static params. we should cache them every time
export const getContestById = cache(async (contestId: number) => {
    const response = await graphqlClient.query(ContestByIdDocument, { contestId })
        .toPromise();
    return response
})

// TODO this is client side code. remove this

export const getUserSubmissionParams = async (contestId: number) => {
    const response = await graphqlClient.query(UserSubmissionParamsDocument, { contestId })
        .toPromise()
        .then(res => res)
        .catch((e) => {
            console.log(e)
            return {
                userSubmissions: [],
                maxSubPower: 0,
                remainingSubPower: 0
            }
        })

    return response
}

export const getUserVotingParams = async (contestId: number) => {
    console.log('calling getUserVotingParams')
    const response = await graphqlClient.query(UserVotingParamsDocument, { contestId })
        .toPromise()
        .then(res => res)
        .catch((e) => {
            console.log(e)
            return {
                totalVotingPower: "0",
                votesRemaining: "0",
                votesSpent: "0",
                userVotes: []
            }
        })
    return response
}


