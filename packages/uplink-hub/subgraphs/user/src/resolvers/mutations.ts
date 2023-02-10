import userOperations from "../operations/operations"


const mutations = {
    Mutation: {
        signIn: async (_, { authData }) => {
            const result = await userOperations.verifySignature(authData)
            return { code: 200, success: true, message: "successfully signed in!", address: result }
        }
    }
}


export default mutations