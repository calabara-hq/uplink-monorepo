import express from 'express';
const auth = express();


auth.get('/', (req, res) => {
    res.send({ auth: { version: "1.0.0" } })
})

auth.get('/test', (req, res) => {
    res.send({ auth: { version: "2.0.0" } })
})

export default auth