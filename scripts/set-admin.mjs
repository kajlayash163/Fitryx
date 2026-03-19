import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  const users = await sql`SELECT id, name, email FROM users WHERE name ILIKE '%sachin%' OR email ILIKE '%sachin%' LIMIT 1`
  if (users.length > 0) {
    const user = users[0]
    await sql`UPDATE users SET role = 'admin' WHERE id = ${user.id}`
    console.log(`Successfully restored Admin privileges for: ${user.name} (${user.email})`)
  } else {
    console.log('Could not find an account with the name sachin')
  }
}

main().catch(console.error).finally(() => process.exit(0))
