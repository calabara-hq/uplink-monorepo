import gql from 'graphql-tag';

export const CreateSubmissionDocument = gql`
    mutation CreateSubmission($contestId: ID!, $submission: SubmissionPayload!) {
        createSubmission(contestId: $contestId, submission: $submission) {
            errors
            success
            userSubmissionParams {
                maxSubPower
                remainingSubPower
                userSubmissions {
                    type
                }
            }
        }
    }
`;

export const CreateTwitterSubmissionDocument = gql`
    mutation CreateTwitterSubmission($contestId: ID!, $submission: TwitterSubmissionPayload!) {
        createTwitterSubmission(contestId: $contestId, submission: $submission) {
            errors
            success
            userSubmissionParams {
                maxSubPower
                remainingSubPower
                userSubmissions {
                    type
                }
            }
        }
    }
`;