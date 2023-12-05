import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();

const DATABASE_CONNECTION_STRING = 'mysql://45kl2lpzhneel9bwtlfj:pscale_pw_GA9AYLm6TYGt64Ty6ly2MZEOKv7rHFZQLpyHtjPF0fo@aws.connect.psdb.cloud/uplink?ssl={"rejectUnauthorized":true}'

export default {
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: DATABASE_CONNECTION_STRING
  },
  verbose: true,
  strict: true,
} satisfies Config
