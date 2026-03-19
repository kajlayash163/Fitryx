import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const hash = await bcrypt.hash('fitryx2025', 12)
console.log('[v0] Generated hash:', hash)

await sql`
  INSERT INTO users (name, email, password, role)
  VALUES ('Fitryx Admin', 'admin@fitryx.com', ${hash}, 'admin')
  ON CONFLICT (email) DO NOTHING
`

console.log('[v0] Admin user seeded: admin@fitryx.com / fitryx2025')
