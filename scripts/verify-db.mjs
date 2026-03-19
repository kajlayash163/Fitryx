import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'gyms' ORDER BY ordinal_position`
  console.log('Columns:', cols.map(c => c.column_name).join(', '))
  if (cols.some(c => c.column_name === 'gender_type')) {
       console.log("SCHEMA IS READY. RUNNING SEED.");
       
       const seedContent = readFileSync(resolve(__dirname, '006-seed-jaipur-gyms.sql'), 'utf-8');
       const inserts = seedContent.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
       
       for (const stmt of inserts) {
            try {
               await sql(stmt);
               console.log("SUCCESS:", stmt.substring(0, 50));
            } catch (err) {
               console.error("FAIL:", stmt.substring(0, 50));
               console.error(err.message);
            }
       }
       console.log("SEEDING COMPLETE");
  } else {
       console.log("SCHEMA IS MISSING COLUMNS.");
  }
}
main().catch(console.error).finally(() => process.exit(0))
