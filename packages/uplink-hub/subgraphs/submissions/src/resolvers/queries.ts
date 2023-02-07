
const queries = {
    Query: {
        submissions() {
            return submissions;
        },
    },
    Contest: {
        __resolveReference(object) {
            return object
        },
        contestSubmissions: ({ id }) => {
            return submissions.filter(sub => sub.contestId === id)
        }
    }
};

const submissions = [
    {
        id: "1",
        contestId: "1",
        author: "yungweez.eth",
        url: "ipfs://dy88dll0682d882d9",
        created: "isostring"
    },
];



export default queries