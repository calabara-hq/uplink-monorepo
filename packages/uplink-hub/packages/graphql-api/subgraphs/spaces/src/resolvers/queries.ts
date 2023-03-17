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
        async space(parent, args, contextValue, info) {
            return await findSpaceById(args.id);
        },
    },

    Space: {
        async __resolveReference(space) {
            return await findSpaceById(space.id);
        }
    }
};




export default queries
