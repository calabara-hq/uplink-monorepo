
const queries = {
    Query: {
        contest(_, { contestId }) {
            return contests.find(contest => contest.id === contestId);
        },
        spaceContests(_, { spaceId }) {
            return contests.filter(contest => contest.spaceId === spaceId)
        },
        activeContests() {
            return contests.filter(contest => contest.start > '0')
        }

    },
    /*
    // used to resolve contests to spaces
    Space: {
        contests(space) {
            return contests.filter(contest => contest.spaceId === space.id)
        }
    },
    */

    ActiveContest: {
        spaceLink(contest) {
            return {
                id: contest.spaceId
            }
        }
    }

};

const contests = [
    {
        id: "1",
        spaceId: "sharkdao",
        tag: "test",
        start: "1",
        vote: "1",
        end: "1",
        created: "1",
    },
];



export default queries