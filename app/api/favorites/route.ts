import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ favorites: [] })

    const favorites = await sql`
      SELECT gym_id FROM favorites WHERE user_id = ${user.id}
    `
    return NextResponse.json({ favorites: favorites.map(f => f.gym_id) })
  } catch (err) {
    console.error('[favorites GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const { gym_id } = await req.json()
    if (!gym_id) return NextResponse.json({ error: 'gym_id required' }, { status: 400 })

    // Toggle: if exists, remove; if not, add
    const existing = await sql`SELECT id FROM favorites WHERE user_id = ${user.id} AND gym_id = ${gym_id}`
    if (existing.length > 0) {
      await sql`DELETE FROM favorites WHERE user_id = ${user.id} AND gym_id = ${gym_id}`
      return NextResponse.json({ favorited: false })
    } else {
      await sql`INSERT INTO favorites (user_id, gym_id) VALUES (${user.id}, ${gym_id})`
      return NextResponse.json({ favorited: true })
    }
  } catch (err) {
    console.error('[favorites POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
