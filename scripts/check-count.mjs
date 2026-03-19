import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  const result = await sql`SELECT count(*) FROM gyms`;
  console.log(`TOTAL GYMS: ${result[0].count}`);
}
main().catch(console.error).finally(() => process.exit(0))
