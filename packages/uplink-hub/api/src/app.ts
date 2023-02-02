import express from 'express';
import { createYoga } from 'graphql-yoga';
import {createBuiltMeshHTTPHandler} from '../.mesh'
const app = express();
const port = 3000;


/*
import { getBuiltMesh } from '../.mesh';

//console.log(getBuiltMesh())

const { schema } = getBuiltMesh

const myFunc = async () => {
  let data = await getBuiltMesh();
  console.log(data)
}

myFunc();

/*
const server = createyoga({
  schema: schema
})
*/
app.get('/', (req, res) => {
  res.send('hello from api gateway!');
});

// @ts-expect-error
app.use('/graphql', createBuiltMeshHTTPHandler()) 


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});