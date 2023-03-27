





const queries = {
    Query: {
        async contest(_, { contestId }, contextValue, info) {
            return contests.find(contest => contest.id === contestId);
        },
        /*
        spaceContests(_, { spaceId, spaceName }) {
            if (spaceId) return contests.filter(contest => contest.spaceId === spaceId)
            else if (spaceName) return contests.filter(contest => contest.spaceName === spaceName)
            else throw new Error("You must provide either a spaceId or a spaceName");
        },
        */
        activeContests() {
            return contests.filter(contest => contest.start > '0')
        }

    },
    
    // used to resolve contests to spaces
    Space: {
        contests(space) {
            return contests.filter(contest => contest.spaceId === space.id)
        }
    },
    

    ActiveContest: {
        spaceLink(contest) {
            return {
                id: contest.spaceId,
                name: contest.spaceName
            }
        }
    }

};

const contests = [
    {
        id: "1",
        spaceId: 7,
        tag: "test",
        start: "1",
        vote: "1",
        end: "1",
        created: "1",
    },
];



export default queries