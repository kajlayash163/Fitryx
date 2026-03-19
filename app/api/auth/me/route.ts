import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user })
  } catch (err) {
    console.error('[me]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
