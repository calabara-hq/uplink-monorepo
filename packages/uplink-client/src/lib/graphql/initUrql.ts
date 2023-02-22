import { createClient } from '@urql/core';

const graphqlClient = createClient({
    url: `${process.env.NEXT_PUBLIC_HUB_URL}/graphql`,
    // hit the cache first, while revalidating in the background
    requestPolicy: 'cache-and-network',
});

export default graphqlClient