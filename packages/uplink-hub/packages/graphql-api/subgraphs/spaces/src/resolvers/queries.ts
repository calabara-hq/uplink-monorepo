import { _prismaClient } from "lib";

const findSpace = async (id?: string, name?: string) => {
    const where = id
        ? { id: parseInt(id) }
        : name
            ? { name }
            : undefined;

    if (!where) {
        return null;
    }
    return await _prismaClient.space.findUnique({
        where,
        include: {
            admins: true,
        },
    });
};



const queries = {
    Query: {
        async spaces() {
            const spaces = await _prismaClient.space.findMany({
                include: {
                    admins: true,
                },
            });
            return spaces;
        },
        async space(parent, { id, name }, contextValue, info) {
            return await findSpace(id, name);
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpace(space.id);
        },
    },
};




export default queries