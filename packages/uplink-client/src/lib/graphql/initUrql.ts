import { createClient } from '@urql/core';

const graphqlClient = createClient({
    url: `${process.env.NEXT_PUBLIC_HUB_URL}/graphql`,
    // hit the cache first, while revalidating in the background
    requestPolicy: 'cache-and-network',
});

export const stripTypenames: any = (obj: any) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(stripTypenames);
    }
    if (typeof obj === 'object') {
        const newObj = {} as any;
        for (const key in obj) {
            if (key === '__typename') {
                continue;
            }
            newObj[key] = stripTypenames(obj[key]);
        }
        return newObj;
    }
    return obj;
};



export default graphqlClient