
const queries = {
    Query: {
        contests(parent, args, contextValue, info) {
            return contests;
        },
        /*
        organizationByEns(parent, args, contextValue, info) {
            return organizations.find(organization => organization.ens === args.ens);
        },
        */
    },
    Space: {
        __resolveReference(object) {
            return object
        },
        spaceContests: ({ id }) => {
            return contests.filter(contest => contest.spaceId == id);
        }
    }
};

const contests = [
    {
        id: "1",
        spaceId: 1,
        ens: "sharkdao.eth",
    },
];



export default queries