import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL environment variable is not set.\n' +
    'Please add it to your .env.local file:\n' +
    '  DATABASE_URL=postgresql://user:pass@host/dbname'
  )
}

const sql = neon(process.env.DATABASE_URL)
export default sql
