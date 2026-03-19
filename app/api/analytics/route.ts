import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [gymStats] = await sql`
      SELECT
        COUNT(*) AS total_gyms,
        COUNT(*) FILTER (WHERE verified = true) AS verified_gyms,
        COUNT(*) FILTER (WHERE verified = false) AS pending_gyms
      FROM gyms
    `
    const [userStats] = await sql`SELECT COUNT(*) AS total_users FROM users`

    // Monthly gym registrations (last 6 months)
    const gymGrowth = await sql`
      SELECT TO_CHAR(created_at, 'Mon') AS month, COUNT(*) AS count
      FROM gyms
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'Mon')
      ORDER BY DATE_TRUNC('month', created_at)
    `
    const userGrowth = await sql`
      SELECT TO_CHAR(created_at, 'Mon') AS month, COUNT(*) AS count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'Mon')
      ORDER BY DATE_TRUNC('month', created_at)
    `

    return NextResponse.json({
      totalGyms: Number(gymStats.total_gyms),
      verifiedGyms: Number(gymStats.verified_gyms),
      pendingGyms: Number(gymStats.pending_gyms),
      totalUsers: Number(userStats.total_users),
      gymGrowth,
      userGrowth,
    })
  } catch (err) {
    console.error('[analytics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
