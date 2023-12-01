import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();

export default {
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: 'mysql://pv0f407t87e4kvk3qsd5:pscale_pw_71noXkFkZ0l6wVOvju2OxNA0Yti0xDASDNK8uIfp96K@aws.connect.psdb.cloud/uplink?ssl={"rejectUnauthorized":true}'
  },
  verbose: true,
  strict: true,
} satisfies Config
