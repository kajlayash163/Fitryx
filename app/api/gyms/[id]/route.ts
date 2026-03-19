import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [gym] = await sql`SELECT * FROM gyms WHERE id = ${id}`
    if (!gym) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ gym })
  } catch (err) {
    console.error('[gym GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const body = await req.json()
    const { name, location, description, price_monthly, price_quarterly, price_yearly, facilities, images } = body
    const [gym] = await sql`
      UPDATE gyms SET
        name = ${name},
        location = ${location},
        description = ${description ?? ''},
        price_monthly = ${price_monthly ?? 0},
        price_quarterly = ${price_quarterly ?? 0},
        price_yearly = ${price_yearly ?? 0},
        facilities = ${facilities ?? []},
        images = ${images ?? []}
      WHERE id = ${id}
      RETURNING *
    `
    if (!gym) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ gym })
  } catch (err) {
    console.error('[gym PUT]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    await sql`DELETE FROM gyms WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[gym DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
