import { NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const users = await sql`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    return NextResponse.json({ users })
  } catch (err) {
    console.error('[users GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
