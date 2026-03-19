import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { role } = await req.json()
    if (!['user', 'admin'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    const [updated] = await sql`
      UPDATE users SET role = ${role} WHERE id = ${id} RETURNING id, name, email, role
    `
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('[user role PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    if (String(user.id) === id) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    await sql`DELETE FROM users WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[user DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
