import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    await deleteSession()
    const cookieStore = await cookies()
    cookieStore.delete('session')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[logout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
