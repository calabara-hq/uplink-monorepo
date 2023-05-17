import gql from 'graphql-tag';


export const CreateContestDocument = gql`
    mutation CreateContest($contestData: ContestBuilderProps!){
        createContest(contestData: $contestData){
            success
            contestId
            errors{
                metadata
                deadlines
                prompt
                submitterRewards
                voterRewards
                submitterRestrictions
                votingPolicy
            }
        }
    }
`;


export const ContestByIdDocument = gql`
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
