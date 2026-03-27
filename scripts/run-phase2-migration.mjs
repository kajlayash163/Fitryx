import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  console.log('Running Phase 2 migrations...')

  // 1. Create reviews table
  await sql`CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id INT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, gym_id)
  )`
  console.log('✓ reviews table created')

  // 2. Create favorites table
  await sql`CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id INT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, gym_id)
  )`
  console.log('✓ favorites table created')

  // 3. Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_gym ON reviews(gym_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_favorites_gym ON favorites(gym_id)`
  console.log('✓ indexes created')

  // 4. Add latitude/longitude columns
  await sql`ALTER TABLE gyms ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7)`
  await sql`ALTER TABLE gyms ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7)`
  console.log('✓ latitude/longitude columns added')

  // 5. Update existing gyms with real Jaipur coordinates
  const gymCoords = [
    { name: "Gold's Gym Malviya Nagar", lat: 26.8561, lng: 75.8045 },
    { name: "Corenergy Fitness", lat: 26.8891, lng: 75.7864 },
    { name: "M&Y Fitness Club", lat: 26.9037, lng: 75.7570 },
    { name: "Jerai Classic Fitness", lat: 26.9160, lng: 75.7929 },
    { name: "FlexZone Gym", lat: 26.8730, lng: 75.7611 },
    { name: "FitLife Studio", lat: 26.9221, lng: 75.7785 },
    { name: "Fitness First Tonk Road", lat: 26.8450, lng: 75.7985 },
    { name: "Abs Fitness Club", lat: 26.8765, lng: 75.7561 },
    { name: "Jerai Fitness Hub", lat: 26.8990, lng: 75.7760 },
    { name: "Muscle Factory Gym", lat: 26.8630, lng: 75.7700 },
    { name: "Yog Power International", lat: 26.9370, lng: 75.7680 },
    { name: "OSlim Fitness Studio", lat: 26.8310, lng: 75.8210 },
    { name: "F45 Training Jaipur", lat: 26.9200, lng: 75.7841 },
    { name: "Xtreme Fitness", lat: 26.8270, lng: 75.7880 },
    { name: "Iron Paradise Gym", lat: 26.8905, lng: 75.7604 },
    { name: "FitBuzz Gym & Spa", lat: 26.8832, lng: 75.7977 },
    { name: "Body Craft Gym", lat: 26.8700, lng: 75.7400 },
    { name: "ProFit Gym", lat: 26.9120, lng: 75.7450 },
  ]

  for (const g of gymCoords) {
    await sql`UPDATE gyms SET latitude = ${g.lat}, longitude = ${g.lng} WHERE name ILIKE ${'%' + g.name.substring(0, 15) + '%'}`
  }
  console.log('✓ gym coordinates updated')

  console.log('\n✅ All Phase 2 migrations complete!')
}

main().catch(console.error).finally(() => process.exit(0))
