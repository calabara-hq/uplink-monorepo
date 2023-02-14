
const queries = {
    Query: {
        organizations() {
            return organizations;
        },
        organizationByEns(parent, args, contextValue, info) {
            return organizations.find(organization => organization.ens === args.ens);
        },
    },
    Organization: {
        __resolveReference(object) {
            return organizations.find(organization => organization.id === object.id);
        }
    }
};

const organizations = [
    {
        id: "1",
        name: "sharkdao",
        ens: "sharkdao.eth",
        members: 0,
        logo: "test.png",
        website: "sharks.wtf",
    },
];



export default queries