// useHandleMutation.ts
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
    }

    const handleErrors = (result: ResultObject) => {
        let errors = [];

        if (result.error?.graphQLErrors) {
            for (const err of result.error.graphQLErrors) {
                const errorCode = err.extensions.code as string;

                if (errorCode in knownErrors) {
                    console.log(err);
                    toast.error(knownErrors[errorCode as keyof typeof knownErrors])
                } else {
                    console.log(err);
                }
            }
        }

        if (result.error) {
            console.log(result.error);
        }

        return null;
    };
    // if there are graphql errors that I know about in my error map, return the error
    // if there are graphql errors that I don't know about, throw an unhandled error

    const handleMutation = useCallback(
        async (variables: any) => {
            try {
                const result = await graphqlClient.mutation(query, variables).toPromise();
                if (result.error) return handleErrors(result);
                return result;
            } catch (err) {
                console.log(`Error: ${err}`);
                toast.error('Unhandled error', {
                    icon: "🚀",
                })
                return null
            }
        }, [handleErrors, query]);



    return handleMutation;
}
