import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { and, asc, desc, eq, or, ne, lt, lte, gt, gte, sql, inArray, not, isNull, placeholder } from 'drizzle-orm';
import * as schema from './schema.js';
export * as schema from './schema.js';

export class DatabaseController {
    private connection: any;
    public db: any;
    public sqlOps: any;
    public dbTypes: any;

    constructor(databaseHost: string, databaseUsername: string, databasePassword: string) {
        this.connection = connect({
            host: databaseHost,
            username: databaseUsername,
            password: databasePassword,
        });

        this.db = drizzle(this.connection, { schema });
        this.sqlOps = { and, asc, desc, eq, or, sql, ne, lt, lte, gt, gte, inArray, not, isNull, placeholder };
    }
}
