import { createClient } from '@urql/core';

const graphqlClient = createClient({
    url: `${process.env.NEXT_PUBLIC_HUB_URL}/graphql`,
});

export default graphqlClient