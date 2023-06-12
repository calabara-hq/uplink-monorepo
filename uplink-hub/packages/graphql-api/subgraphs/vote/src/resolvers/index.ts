import queries from './queries.js';
import mutations from './mutations.js';
import { DecimalScalar, IpfsUrlScalar } from 'lib';

// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const resolvers = {
    Decimal: DecimalScalar,
    IpfsUrl: IpfsUrlScalar,
    ...queries,
    ...mutations
};

export default resolvers;
