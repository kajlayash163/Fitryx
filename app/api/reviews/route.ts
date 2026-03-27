import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const gymId = new URL(req.url).searchParams.get('gym_id')
    if (!gymId) return NextResponse.json({ error: 'gym_id required' }, { status: 400 })

    const reviews = await sql`
      SELECT r.id, r.rating, r.comment, r.created_at, r.user_id,
             u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.gym_id = ${gymId}
      ORDER BY r.created_at DESC
    `
    return NextResponse.json({ reviews })
  } catch (err) {
    console.error('[reviews GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const { gym_id, rating, comment } = await req.json()
    if (!gym_id || !rating || !comment?.trim()) {
      return NextResponse.json({ error: 'gym_id, rating, and comment required' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }
    // Sanitize and cap length
    const cleanComment = comment.trim().replace(/<[^>]*>/g, '').slice(0, 1000)
    if (cleanComment.length < 3) {
      return NextResponse.json({ error: 'Comment must be at least 3 characters' }, { status: 400 })
    }

    // Check if user already reviewed this gym
    const existing = await sql`SELECT id FROM reviews WHERE user_id = ${user.id} AND gym_id = ${gym_id}`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'You already reviewed this gym' }, { status: 409 })
    }

    // Insert review
    const [review] = await sql`
      INSERT INTO reviews (user_id, gym_id, rating, comment)
      VALUES (${user.id}, ${gym_id}, ${rating}, ${cleanComment})
      RETURNING *
    `

    // Recalculate gym rating and review_count
    const [stats] = await sql`
      SELECT AVG(rating)::NUMERIC(3,2) as avg_rating, COUNT(*)::INT as review_count
      FROM reviews WHERE gym_id = ${gym_id}
    `
    await sql`
      UPDATE gyms SET rating = ${stats.avg_rating}, review_count = ${stats.review_count}
      WHERE id = ${gym_id}
    `

    return NextResponse.json({ review }, { status: 201 })
  } catch (err) {
    console.error('[reviews POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
