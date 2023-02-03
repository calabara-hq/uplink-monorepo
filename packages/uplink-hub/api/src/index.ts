import express from 'express';
import {createBuiltMeshHTTPHandler} from './.mesh'
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('hello from api gateway again hahaha it works!');
});


//@ts-ignore
app.use('/graphql', createBuiltMeshHTTPHandler()) 


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
