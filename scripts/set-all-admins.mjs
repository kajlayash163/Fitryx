import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  await sql`UPDATE users SET role = 'admin' WHERE name ILIKE '%sachin%' OR email ILIKE '%sachin%'`
  const admins = await sql`SELECT id, name, email FROM users WHERE role = 'admin'`
  console.log('Current admins:', admins)
}
main().catch(console.error).finally(()=>process.exit(0))
