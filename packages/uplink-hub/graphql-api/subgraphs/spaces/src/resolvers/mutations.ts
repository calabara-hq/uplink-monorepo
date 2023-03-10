
const mutations = {
    Mutation: {
        createSpace: async (_: any, args: any, context: any) => {
            const { space } = args;
            console.log(space)
        }
    },
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
    {
        id: "uplink",
        name: "uplink",
        members: 11111111,
        logo: "uplink.png",
        website: "nouns.wtf",
    },
    {
        id: "TNS",
        name: "TNS dao",
        members: 26,
        logo: "tns.png",
        website: "tns.wtf",
    },
    {
        id: "Links",
        name: "Links dao",
        members: 32,
        logo: "links.png",
        website: "links.wtf",
    },

];



export default queries
