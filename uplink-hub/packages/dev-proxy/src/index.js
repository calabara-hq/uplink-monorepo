import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import httpProxy from 'http-proxy';
import cors from 'cors';
import express from 'express';

const proxy = httpProxy.createProxyServer({});
const app = express();

// Configure CORS to set the Access-Control-Allow-Origin header to the origin of the request
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true
}));

app.options('*', cors());

const server = http.createServer(app);

app.all('*', (req, res) => {
    if (req.url.startsWith('/api/graphql')) {
        req.headers.host = `localhost:${process.env.SUPERGRAPH_SERVICE_PORT}`;
        req.url = req.url.replace('/api/graphql', ''); // remove the '/api/graphql' from the path.
        proxy.web(req, res, { target: `http://localhost:${process.env.SUPERGRAPH_SERVICE_PORT}/` });
    } else if (req.url.startsWith('/api/auth')) {
        req.headers.host = `localhost:${process.env.AUTH_SERVICE_PORT}`;
        req.url = req.url.replace('/api/auth', ''); // remove the '/api/auth' from the path.
        proxy.web(req, res, { target: `http://localhost:${process.env.AUTH_SERVICE_PORT}/` });
    } else if (req.url.startsWith('/api/media')) {
        req.headers.host = `localhost:${process.env.MEDIA_SERVICE_PORT}`;
        req.url = req.url.replace('/api/media', ''); // remove the '/api/media' from the path.
        proxy.web(req, res, { target: `http://localhost:${process.env.MEDIA_SERVICE_PORT}/` });
    } else {
        res.write('Invalid route');
        res.end();
    }
});

server.listen(8080, () => {
    console.log('Dev proxy listening on port 8080')
});

proxy.on('error', function (err, req, res) {
    console.log('Proxy error:', err);
    res.end();
});