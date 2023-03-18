import prisma from 'shared-prisma';


const findSpaceById = async (id: number) => {
    return await prisma.space.findUnique({
        where: {
            id: id
        },
        include: {
            admins: true
        }
    });
}

const findSpaceByName = async (name: string) => {
    return await prisma.space.findUnique({
        where: {
            name: name
        },
        include: {
            admins: true
        }
    });
}


const queries = {
    Query: {
        async spaces() {
            const spaces = await prisma.space.findMany({
                include: {
                    admins: true
                }
            });
            return spaces
        },
        async space(parent, { id, name }, contextValue, info) {
            if (id) return await findSpaceById(id);
            else if (name) return await findSpaceByName(name);
            else throw new Error("You must provide either an ID or a name to find a space.");
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpaceById(space.id);
        }
    }
};




export default queries
