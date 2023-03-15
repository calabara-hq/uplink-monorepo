

const getUser = async (context: any) => {
    const { token } = context;
    if (!token['uplink-hub']) return null;
    //const user = await prisma.user.findUnique({ where: { token } });
    const user = {
        address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
    }
    return user;
}


export default getUser;