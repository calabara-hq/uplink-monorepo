"use client";
import { useCallback } from "react";
import { DocumentNode } from "graphql";
import graphqlClient, { stripTypenames } from "@/lib/graphql/initUrql";
import { CombinedError } from "@urql/core";
import { GraphQLError } from "graphql";
import toast from 'react-hot-toast'

interface GraphQLErrorExtension {
    code: string;
}

interface GraphQLErrorObject {
    extensions: GraphQLErrorExtension;
}

interface ResultObject {
    data?: any;
    error?: {
        graphQLErrors?: GraphQLError[];
        message: string;
    } | CombinedError;
}


export default function useHandleMutation(query: DocumentNode) {

    const knownErrors = {
        'UNAUTHORIZED': 'You are not authorized to perform this action',
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
    }

    const handleErrors = (result: ResultObject) => {
        if (result.error) {
            // check for graphql errors
            if (result.error?.graphQLErrors) {
                for (const err of result.error.graphQLErrors) {
                    const errorCode = err.extensions.code as string;

                    // check for known errors
                    if (errorCode in knownErrors) {
                        console.log(err);
                        toast.error(knownErrors[errorCode as keyof typeof knownErrors])
                    } else {
                        // unknown graphql error. throw
                        throw new Error("unknown graphql error");
                    }
                }
            }

            else {
                // unknown error. throw
                throw new Error(result.error.message);
            }

        }
    };
    // if there are graphql errors that I know about in my error map, return the error
    // if there are graphql errors that I don't know about, throw an unknown error

    const handleMutation = useCallback(
        async (variables: any) => {
            try {
                const result = await graphqlClient.mutation(query, variables).toPromise();
                if (result.error) return handleErrors(result);
                return result;
            } catch (err) {
                // unknown error, handle it in the calling function
                throw new Error(err);
            }
        }, [handleErrors, query]);



    return handleMutation;
}
