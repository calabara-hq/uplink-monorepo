
const queries = {
    Query: {
        me() {
            return user
        },
        generateNonce() {
            return { nonce: Math.floor(Math.random() * 100) }
        }
    },
};

const user = {
    address: "nickdodson.eth",
    isAuthenticated: false
};



export default queries