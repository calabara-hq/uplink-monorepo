const handleErrors = (result: any, handledCodes: string[]) => {
    if (result.error?.graphQLErrors) {
        let errors = {};
        let unhandledError = false;

        result.error.graphQLErrors.forEach((err: any) => {
            if (handledCodes.includes(err.extensions?.code)) {
                const { code, stacktrace, ...rest } = err.extensions;
                errors = { ...errors, ...rest };
            } else {
                unhandledError = true;
            }
        });

        if (unhandledError) {
            throw new Error('Unhandled GraphQL error');
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }
    }

    if (result.error) {
        throw new Error(result.error.message);
    }

    return null;
}

export default handleErrors