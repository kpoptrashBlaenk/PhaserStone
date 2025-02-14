import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_INTERNAL_HOST || process.env.DB_EXTERNAL_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string),
  ssl: {
    rejectUnauthorized: false,
  },
})

export default pool
