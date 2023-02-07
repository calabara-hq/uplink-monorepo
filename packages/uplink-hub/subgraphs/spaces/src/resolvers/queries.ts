
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
        members: 634,
        logo: "sharkdao.png",
        website: "sharks.wtf",
    },
    {
        id: "2",
        name: "nouns",
        ens: "nouns.eth",
        members: 999,
        logo: "nouns.png",
        website: "nouns.wtf",
    },
];



export default queries
