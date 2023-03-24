import { _prismaClient } from "lib";

const findSpaceById = async (id: string) => {
    return await _prismaClient.space.findUnique({
        where: {
            id: id
        },
        include: {
            admins: true
        }
    });
}



const queries = {
    Query: {
        async spaces() {
            const spaces = await _prismaClient.space.findMany({
                include: {
                    admins: true
                }
            });
            return spaces
        },
        async space(parent, { id, name }, contextValue, info) {
            return await findSpaceById(id);
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpaceById(space.id);
        }
    }
};




export default queries