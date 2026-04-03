import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { comparePassword, createSession } from '@/lib/auth'
import { cookies } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = await rateLimit(`login:${ip}`, 10, 60000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again in a minute.' }, { status: 429 })
    }

    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Block Google-only users (no password set)
    if (!user.password) {
      return NextResponse.json({ error: 'This account uses Google Sign-In. Please use the "Continue with Google" button.' }, { status: 400 })
    }

    // Block unverified users
    if (!user.is_verified) {
      return NextResponse.json({
        error: 'Please verify your email before signing in.',
        needsVerification: true,
        email: user.email,
      }, { status: 403 })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Session rotation: delete old sessions for this user, create new
    await sql`DELETE FROM sessions WHERE user_id = ${user.id}`
    const sessionId = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
