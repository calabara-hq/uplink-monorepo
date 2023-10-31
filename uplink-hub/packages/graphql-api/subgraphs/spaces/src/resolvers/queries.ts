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


const singleSpaceByName = db.query.spaces.findFirst({
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



// const constructQuery = (info) => {
//     let dbWith = {};
//     info.fieldNodes[0].selectionSet.selections.map(selection => {
//         const field = selection.name.value;
//         if(field === 'admins')
//     });
// }




const queries = {
    Query: {
        async spaces(_, __, ___, info) {
            //const fields = constructQuery(info);
            //console.log(fields)
            const data = await manySpaces.execute();
            return data;
        },
        async space(parent, { id, name }, contextValue, info) {
            const data = id ? await singleSpaceById.execute({ id }) : name ? await singleSpaceByName.execute({ name }) : null;
            return data
        },
    },

    Space: {
        async __resolveReference(space) {
            const data = await singleSpaceById.execute({ id: space.id });
            return data;
        },
    },

    SpaceStub: {
        async __resolveReference(space) {
            const data = await singleSpaceById.execute({ id: space.id });
            return data;
        },
    },
};

export default queries