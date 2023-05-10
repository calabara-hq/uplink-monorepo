import { _prismaClient, DecimalScalar } from "lib";


const contestById = async (id: string) => {
    const contestId = parseInt(id);
    const contest = await _prismaClient.contest.findUnique({
        where: { id: contestId },
        include: {
            submitterRewards: {
                include: {
                    token: true
                }
            },
            voterRewards: {
                include: {
                    token: true
                }
            }
        }
    });
    //console.log(JSON.stringify(contest, null, 2))
    return contest;
}

const formatContest = (contest) => {
    const { type, category, startTime, voteTime, endTime, snapshot, submitterRewards, voterRewards, ...rest } = contest;

    const data = {
        metadata: {
            type,
            category
        },
        deadlines: {
            startTime,
            voteTime,
            endTime,
            snapshot
        },
        submitterRewards: submitterRewards.map(reward => {
            return {
                ...reward,
                amount: DecimalScalar.parseValue(reward.amount) ?? null,
            }
        }),
        voterRewards: voterRewards.map(reward => {
            return {
                ...reward,
                amount: DecimalScalar.parseValue(reward.amount) ?? null,
            }
        }),
        ...rest
    }

    console.log(JSON.stringify(data, null, 2))
    return data;
}



const queries = {
    Query: {
        async contest(_, { contestId }, contextValue, info) {
            const contest = await contestById(contestId)
                .then(contest => contest ? formatContest(contest) : null)
            return contest;
            //return contests.find(contest => contest.id === contestId);
        },
        /*
        spaceContests(_, { spaceId, spaceName }) {
            if (spaceId) return contests.filter(contest => contest.spaceId === spaceId)
            else if (spaceName) return contests.filter(contest => contest.spaceName === spaceName)
            else throw new Error("You must provide either a spaceId or a spaceName");
        },
        */
        activeContests() {
            return contests.filter(contest => contest.deadlines.startTime > '0')
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
        id: 1,
        spaceId: 1,
        metadata: {
            type: 'contest',
            category: 'art'
        },
        deadlines: {
            startTime: '2021-05-01T00:00:00.000Z',
            voteTime: '2021-05-08T00:00:00.000Z',
            endTime: '2021-05-15T00:00:00.000Z',
            snapshot: '2021-04-30T00:00:00.000Z'
        },
        created: '2021-04-01T00:00:00.000Z',
        promptUrl: 'https://calabara.mypinata.cloud/ipfs/QmUVdqmqf1KDy6syiZeYXBZcn7a849qssJckRwxr35MMDd',
        submitterRewards: [
            {
                rank: 1,
                rewards: [
                    {
                        token: {
                            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                            symbol: 'DAI',
                            decimals: 18,
                            type: 'ERC20'
                        },
                        tokenId: 100
                    }
                ]
            }
        ]
    },
];



export default queries