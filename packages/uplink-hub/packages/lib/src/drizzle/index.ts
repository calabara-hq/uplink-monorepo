import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database'
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
//import { session } from './schema'
dotenv.config();


const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
})

export const db = drizzle(connection);


export const getSession = async () => {

    return await db.execute<{ sid: string }
    >(sql`select * from session`)

}

