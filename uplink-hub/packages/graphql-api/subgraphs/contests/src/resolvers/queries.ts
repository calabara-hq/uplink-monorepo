import { Decimal, schema } from "lib";
import { sqlOps, db, dbSingleContestById, dbActiveContests, dbMultiContestsBySpaceId, dbIsContestTweetQueued } from '../utils/database.js';
import { Contest, Space } from "../__generated__/resolvers-types.js";

// TODO: this is dying for a refactor. we need to use the dataloader pattern and let each field resolve itself



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