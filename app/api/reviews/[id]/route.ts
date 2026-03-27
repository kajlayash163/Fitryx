import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const { id } = await params

    // Check ownership or admin
    const [review] = await sql`SELECT user_id, gym_id FROM reviews WHERE id = ${id}`
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    if (review.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await sql`DELETE FROM reviews WHERE id = ${id}`

    // Recalculate gym rating
    const [stats] = await sql`
      SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0) as avg_rating, COUNT(*)::INT as review_count
      FROM reviews WHERE gym_id = ${review.gym_id}
    `
    await sql`
      UPDATE gyms SET rating = ${stats.avg_rating}, review_count = ${stats.review_count}
      WHERE id = ${review.gym_id}
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[reviews DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
