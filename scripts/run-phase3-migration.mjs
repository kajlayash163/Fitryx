import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  console.log('Running Phase 3 migrations (OTP + verification)...')

  // 1. Add is_verified column
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false`
  console.log('✓ is_verified column added to users')

  // 2. Set all existing users as verified (they registered before OTP was required)
  await sql`UPDATE users SET is_verified = true WHERE is_verified IS NULL OR is_verified = false`
  console.log('✓ existing users set to verified')

  // 3. Create user_otps table
  await sql`CREATE TABLE IF NOT EXISTS user_otps (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`
  console.log('✓ user_otps table created')

  // 4. Index
  await sql`CREATE INDEX IF NOT EXISTS idx_otp_user ON user_otps(user_id)`
  console.log('✓ index created')

  console.log('\n✅ Phase 3 migrations complete!')
}

main().catch(console.error).finally(() => process.exit(0))
