import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const [gym] = await sql`
      UPDATE gyms SET verified = NOT verified WHERE id = ${id} RETURNING *
    `
    if (!gym) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ gym })
  } catch (err) {
    console.error('[gym verify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
