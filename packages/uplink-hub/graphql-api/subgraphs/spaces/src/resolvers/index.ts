import queries from '@/resolvers/queries';
import mutations from '@/resolvers/mutations';

// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const resolvers = { ...queries, ...mutations };

export default resolvers;
