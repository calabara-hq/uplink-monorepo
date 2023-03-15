import queries from './queries.js';
import mutations from './mutations.js';

// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const resolvers = { ...queries, ...mutations };

export const spaces = [
    {
        id: "sharkdao",
        name: "Shark DAO",
        members: 634,
        logo: "sharkdao.png",
        admins: ["0x5e9b7e1f2e5b1f7f0a5b9e61e1e4e59e8f6995b1"],
        website: "sharks.wtf",
        twitter: "@sharkdao"
    },

    {
        id: "nouns",
        name: "nouns dao",
        members: 999,
        logo: "nouns.png",
        admins: ["0x5e9b7e1f2e5b1f7f0a5b9e61e1e4e59e8f6995b1"],
        website: "nouns.wtf",
    },
    {
        id: "uplink",
        name: "uplink",
        members: 11111111,
        logo: "uplink.png",
        admins: ["0x5e9b7e1f2e5b1f7f0a5b9e61e1e4e59e8f6995b1"],
        website: "nouns.wtf",
    },
    {
        id: "TNS",
        name: "TNS dao",
        members: 26,
        logo: "tns.png",
        admins: ["0x5e9b7e1f2e5b1f7f0a5b9e61e1e4e59e8f6995b1"],
        website: "tns.wtf",
    },
    {
        id: "Links",
        name: "Links dao",
        members: 32,
        logo: "links.png",
        admins: ["0x5e9b7e1f2e5b1f7f0a5b9e61e1e4e59e8f6995b1"],
        website: "links.wtf",
    },

];

export default resolvers;
