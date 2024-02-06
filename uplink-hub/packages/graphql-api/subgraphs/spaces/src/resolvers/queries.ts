import { Space } from "../__generated__/resolvers-types.js";
import { sqlOps, db } from "../utils/database.js";

const manySpaces = db.query.spaces.findMany({
    with: {
        admins: true,
        spaceTokens: {
            with: {
                token: true
            }
        }
    }
}).prepare();

const singleSpaceById = db.query.spaces.findFirst({
    where: ((spaces) => sqlOps.eq(spaces.id, sqlOps.placeholder('id'))),
    with: {
        admins: true,
        spaceTokens: {
            with: {
                token: true
            }
        }
    }
}).prepare();


export const singleSpaceByName = db.query.spaces.findFirst({
    where: ((spaces) => sqlOps.eq(spaces.name, sqlOps.placeholder('name'))),
    with: {
        admins: true,
        spaceTokens: {
            with: {
                token: true
            }
        }
    }
}).prepare();

const queries = {
    Query: {
        async spaces(_, __, ___, info) {

            const data = await manySpaces.execute();
            return data;
        },
        async space(parent, { id, name }, contextValue, info) {
            const data = id ? await singleSpaceById.execute({ id }) : name ? await singleSpaceByName.execute({ name }) : null;
            return data
        },
    },

    Space: {
        async __resolveReference(space: Space) {
            const data = await singleSpaceById.execute({ id: space.id });
            return data;
        },
        async stats(space: Space) {
            console.log(space)
        }
    },

    SpaceStub: {
        async __resolveReference(space) {
            const data = await singleSpaceById.execute({ id: space.id });
            return data;
        },
    },
};

export default queries