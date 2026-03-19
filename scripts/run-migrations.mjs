import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()

const sql = neon(dbUrl)

// Run each ALTER TABLE individually
const alters = [
  `ALTER TABLE gyms ADD COLUMN IF NOT EXISTS gender_type VARCHAR(20) NOT NULL DEFAULT 'unisex' CHECK (gender_type IN ('unisex', 'women_only', 'men_only'))`,
  `ALTER TABLE gyms ADD COLUMN IF NOT EXISTS women_safety_rating NUMERIC(3,2) DEFAULT NULL`,
  `ALTER TABLE gyms ADD COLUMN IF NOT EXISTS opening_hours VARCHAR(100) DEFAULT '6:00 AM - 10:00 PM'`,
  `ALTER TABLE gyms ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT 'Jaipur'`,
  `ALTER TABLE gyms ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_gyms_city ON gyms(city)`,
  `CREATE INDEX IF NOT EXISTS idx_gyms_gender_type ON gyms(gender_type)`
]

console.log('=== Adding new columns ===')
for (const stmt of alters) {
  try {
    await sql(stmt)
    console.log('  OK:', stmt.substring(0, 80))
  } catch (e) {
    console.error('  FAIL:', e.message)
    console.error('  SQL:', stmt.substring(0, 80))
  }
}

// Verify columns exist now
const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'gyms' ORDER BY ordinal_position`
console.log('\nColumns in gyms table:', cols.map(c => c.column_name).join(', '))

// Count gyms
const count = await sql`SELECT count(*) as cnt FROM gyms`
console.log('Total gyms:', count[0].cnt)

process.exit(0)
