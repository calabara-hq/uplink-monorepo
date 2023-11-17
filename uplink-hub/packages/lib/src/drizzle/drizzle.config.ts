import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();

export default {
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_CONNECTION_STRING!
  },
  verbose: true,
  strict: true,
} satisfies Config
