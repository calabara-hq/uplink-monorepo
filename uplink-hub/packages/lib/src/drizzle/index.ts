import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { and, asc, desc, eq, or, ne, lt, gt, sql, inArray } from 'drizzle-orm';

export * as schema from './schema.js';

export class DatabaseController {
    private connection: any;
    public db: any;
    public sqlOps: any;
    public schema: any;

    constructor(databaseHost: string, databaseUsername: string, databasePassword: string) {
        this.connection = connect({
            host: databaseHost,
            username: databaseUsername,
            password: databasePassword,
        });

        this.db = drizzle(this.connection);
        this.sqlOps = { and, asc, desc, eq, or, sql, ne, lt, gt, inArray };
    }
}
