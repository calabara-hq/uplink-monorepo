import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();

export default {
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: 'mysql://f7gayyuoqjhme5win9dr:pscale_pw_osWJPORpJidTG2qjc7eGvfftVMUecsppXmHuppAeT30@aws.connect.psdb.cloud/uplink?ssl={"rejectUnauthorized":true}'
  },
  verbose: true,
  strict: true,
} satisfies Config
