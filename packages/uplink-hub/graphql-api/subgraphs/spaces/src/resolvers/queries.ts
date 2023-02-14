
const queries = {
    Query: {
        spaces() {
            return spaces;
        },
        space(parent, args, contextValue, info) {
            return spaces.find(space => space.id === args.id);
        },
    },

    Space: {
        __resolveReference(space) {
            return spaces.find(_space => _space.id === space.id);
        }
    }
};

const spaces = [
    {
        id: "sharkdao",
        name: "Shark DAO",
        members: 634,
        logo: "sharkdao.png",
        socials: {
            web: "sharks.wtf",
            twitter: "@sharkdao"
        }
    },
    {
        id: "nouns",
        name: "nouns dao",
        members: 999,
        logo: "nouns.png",
        website: "nouns.wtf",
    },
];



export default queries
