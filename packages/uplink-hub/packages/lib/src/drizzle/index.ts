import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database'
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { and, asc, desc, eq, or } from 'drizzle-orm';

dotenv.config();


const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
})

export * as schema from './schema.js';
export const sqlOps = { and, asc, desc, eq, or, sql };
export const db = drizzle(connection);

