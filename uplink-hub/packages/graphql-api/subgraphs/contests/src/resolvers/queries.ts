import { Decimal, schema } from "lib";
import { sqlOps, db, dbSingleContestById, dbActiveContests, dbMultiContestsBySpaceId, dbIsContestTweetQueued } from '../utils/database.js';
import { Contest, Space } from "../__generated__/resolvers-types.js";


const queries = {
    Query: {
        async contest(_: any, args: { contestId: string }) {
            const data = await dbSingleContestById(parseInt(args.contestId))
            return data;
        },

        async activeContests() {
            return dbActiveContests();
        },

        async isContestTweetQueued(_: any, args: { contestId: string }) {
            return dbIsContestTweetQueued(parseInt(args.contestId))
        }
    },

    // used to resolve contests to spaces
    Space: {
        async contests(space: Space) {
            return dbMultiContestsBySpaceId(parseInt(space.id))
        }
    },

    Contest: {

        space: async (contest: Contest) => {
            return { id: contest.spaceId };
        },


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