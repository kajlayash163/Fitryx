import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

sql`SELECT id, name, email, role FROM users WHERE role = 'admin'`.then(r => console.log(JSON.stringify(r))).catch(console.error).finally(() => process.exit(0))
