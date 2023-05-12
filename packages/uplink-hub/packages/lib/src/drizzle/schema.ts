import { mysqlTable, serial, text, varchar, datetime, uniqueIndex } from 'drizzle-orm/mysql-core';
import { and, asc, desc, eq, or } from 'drizzle-orm';

export const session = mysqlTable('session', {
    id: serial('id').primaryKey(),
    sid: varchar('sid', { length: 255 }),
    data: varchar('data', { length: 1028 }),
    expiresAt: datetime('expires_at'),
},
    (session) => ({
        sessionTokenIndex: uniqueIndex("sid_idx").on(
            session.sid
        ),
    })

)

