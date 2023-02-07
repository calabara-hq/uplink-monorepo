
const queries = {
    Query: {
        spaces() {
            return spaces;
        },
        spaceByEns(parent, args, contextValue, info) {
            return spaces.find(space => space.ens === args.ens);
        },
    },
    Space: {
        __resolveReference(object) {
            return spaces.find(space => space.id === object.id);
        }
    }
};

const spaces = [
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
