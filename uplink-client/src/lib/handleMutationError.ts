
// intercept an API mutation response and handle any graphql errors.

import { GraphQLError } from "graphql";
import { toast } from "react-hot-toast";

interface ResultObject {
    data?: any;
    errors?: GraphQLError[];
}

const knownErrors = {
    'UNAUTHORIZED': 'You are not authorized to perform this action',
    'RATE_LIMIT_EXCEEDED': 'You are being rate limited',
    'INTERNAL_SERVER_ERROR': 'Something went wrong', // catch all for database errors
    // submitting
    'IPFS_UPLOAD_ERROR': 'Error uploading submission to IPFS',
    'INELIGIBLE_TO_SUBMIT': 'You are ineligible to submit to this contest',
    'ENTRY_LIMIT_REACHED': 'You have reached the entry limit for this contest',
    // voting
    'FAILED_TO_CREATE_VOTES': 'Failed to create votes',
    'CONTEST_DOES_NOT_EXIST': 'Contest does not exist',
    'INSUFFICIENT_VOTING_POWER': 'Proposed votes are greater than your available voting power',
    'INVALID_SUBMISSION_ID': 'Invalid submission id',
    'SELF_VOTING_DISABLED': 'Self voting is disabled for this contest',
    'FAILED_TO_DELETE_VOTES': 'Failed to remove votes',
    // tweeting
    'NOT_TWITTER_CONTEST': 'This is not a twitter contest',
    'CONTEST_TWEET_EXISTS': 'You have already tweeted for this contest',
    'CONTEST_TWEET_QUEUED': 'A tweet is already queued for this contest',

}

// we should still throw errors in any case of an error, but here we'll display a toast message to the user when we know what the error is
export const handleMutationError = (result: ResultObject) => {
    if (result.errors) {
        // check for graphql errors
        if (result?.errors.length > 0) {
            for (const err of result.errors) {
                const errorCode = err.extensions.code as string;
                // check for known errors
                if (errorCode in knownErrors) {
                    toast.error(knownErrors[errorCode as keyof typeof knownErrors])
                    throw new Error(knownErrors[errorCode as keyof typeof knownErrors]);
                } else {
                    // unknown graphql error. throw
                    throw new Error("unknown graphql error");
                }
            }
        }

        else {
            // unknown error. throw
            console.error(result.errors)
            throw new Error("unknown error");
        }
    }

    else {
        return result;
    }
}