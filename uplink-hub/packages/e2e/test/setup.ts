import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined')
}

if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_PASSWORD) {
    throw new Error('DATABASE_HOST, DATABASE_USERNAME, or DATABASE_PASSWORD is not defined')
}


axios.get('http://localhost:8080/api/auth/')
    .catch((err) => {
        throw new Error('Could not connect to the cluster. are you sure it\'s running?')
    })
