import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();


const DATABASE_CONNECTION_STRING='mysql://acbfwy11h0z40oorlnai:pscale_pw_fLmF1PYXMKTHcIhZEDh5vfcFrvezmQsjDIw8ZPN7v8r@aws.connect.psdb.cloud/uplink?ssl={"rejectUnauthorized":true}'

export default {
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: DATABASE_CONNECTION_STRING//process.env.DATABASE_CONNECTION_STRING,
  },
  verbose: true,
  strict: true,
} satisfies Config
