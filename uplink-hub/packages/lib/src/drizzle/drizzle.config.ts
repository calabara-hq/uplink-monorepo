import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();


const DATABASE_CONNECTION_STRING=''

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
