import { NextResponse } from 'next/server'
import { getGoogleAuthURL } from '@/lib/google-auth'
import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/google
 * Redirects user to Google's OAuth consent screen.
 */
export async function GET() {
  try {
    // Generate CSRF state token
    const state = randomBytes(32).toString('hex')
    const cookieStore = await cookies()
    cookieStore.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    })

    const url = getGoogleAuthURL(state)
    return NextResponse.redirect(url)
  } catch (err) {
    console.error('[google auth]', err)
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  }
}
