import gql from 'graphql-tag';


export const CreateContestDocument = gql`
    mutation CreateContest($contestData: ContestBuilderProps!){
        createContest(contestData: $contestData){
            success
            errors{
                type
                deadlines{
                    startTime
                    voteTime
                    endTime
                }
                prompt{
                    title
                    body
                    coverUrl
                }
                submitterRewards{
                    tokens
                    payouts
                }
                voterRewards{
                    tokens
                    payouts
                }
                submitterRestrictions{
                    tokens
                    thresholds
                }
                votingPolicy{
                    tokens
                    strategies
                }
            }
        }
    }
`;