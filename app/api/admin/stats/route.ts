import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [userStats] = await sql`SELECT COUNT(*)::INT as total, COUNT(*) FILTER (WHERE is_verified = true)::INT as verified FROM users`
    const [gymStats] = await sql`SELECT COUNT(*)::INT as total FROM gyms`
    const [reviewStats] = await sql`SELECT COUNT(*)::INT as total FROM reviews`
    const topGyms = await sql`SELECT id, name, rating, review_count FROM gyms ORDER BY rating DESC LIMIT 3`

    return NextResponse.json({
      users: { total: userStats.total, verified: userStats.verified },
      gyms: { total: gymStats.total },
      reviews: { total: reviewStats.total },
      topGyms,
    })
  } catch (err) {
    console.error('[admin stats]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
