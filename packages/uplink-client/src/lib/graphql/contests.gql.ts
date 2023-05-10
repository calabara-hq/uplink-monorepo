import gql from 'graphql-tag';


export const CreateContestDocument = gql`
    mutation CreateContest($contestData: ContestBuilderProps!){
        createContest(contestData: $contestData){
            success
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