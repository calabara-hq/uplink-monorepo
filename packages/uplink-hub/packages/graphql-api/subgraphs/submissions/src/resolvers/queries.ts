
const queries = {
    Query: {
        submissions(_, { contestId }) {
            return submissions.filter(sub => sub.contestId === contestId);
        },
        submission(_, { submissionId }) {
            return submissions.find(sub => sub.id === submissionId)
        }
    },
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