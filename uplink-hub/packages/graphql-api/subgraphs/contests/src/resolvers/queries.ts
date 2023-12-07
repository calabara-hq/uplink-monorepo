import { Decimal, schema } from "lib";
import { sqlOps, db, dbSingleContestById, dbActiveContests, dbMultiContestsBySpaceId, dbIsContestTweetQueued, dbSingleSpaceByName } from '../utils/database.js';
import { Contest, MintBoard, Space } from "../__generated__/resolvers-types.js";


const queries = {
    Query: {
        async contest(_: any, args: { contestId: string }) {
            return dbSingleContestById(parseInt(args.contestId))
        },

        async activeContests() {
            return dbActiveContests();
        },

        async isContestTweetQueued(_: any, args: { contestId: string }) {
            return dbIsContestTweetQueued(parseInt(args.contestId))
        },

        async mintBoard(_: any, args: { spaceName: string }) {
            const data = await dbSingleSpaceByName(args.spaceName)
            return data?.mintBoard ?? null
        }
    },

    // used to resolve contests to spaces
    Space: {
        async contests(space: Space) {
            return dbMultiContestsBySpaceId(parseInt(space.id))
        },
    },

    Contest: {
        space: async (contest: Contest) => {
            return { id: contest.spaceId };
        },
    },

    MintBoard: {
        space: async (mintBoard: MintBoard) => {
            return { id: mintBoard.spaceId };
        }
    },

    ActiveContest: {
        space(contest: Contest) {
            return {
                id: contest.spaceId,
                //name: contest.spaceStub.spaceName
            }
        }
    }

};


export default queries