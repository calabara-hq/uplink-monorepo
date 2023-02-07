
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
    Organization: {
        __resolveReference(object) {
            return object
        },
        orgContests: ({ id }) => {
            return contests.filter(contest => contest.org_id == id);
        }
    }
};

const contests = [
    {
        id: "1",
        org_id: 1,
        ens: "sharkdao.eth",
    },
];



export default queries