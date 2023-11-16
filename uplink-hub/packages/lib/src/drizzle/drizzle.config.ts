import { Config } from "drizzle-kit"
import dotenv from "dotenv"

dotenv.config();


const DATABASE_CONNECTION_STRING='mysql://rnqryg0x99e8xzri1t7a:pscale_pw_8ctnqrgfIvZivIpCklTnKPRihUVpyuOtX8jeSD3gsfq@aws.connect.psdb.cloud/uplink?ssl={"rejectUnauthorized":true}'


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
