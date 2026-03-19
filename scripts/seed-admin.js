import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const hash = await bcrypt.hash('fitryx2025', 12)

await sql`
  INSERT INTO users (name, email, password, role)
  VALUES ('Admin', 'admin@fitryx.com', ${hash}, 'admin')
  ON CONFLICT (email) DO UPDATE SET password = ${hash}, role = 'admin'
`

console.log('Admin user created: admin@fitryx.com / fitryx2025')
