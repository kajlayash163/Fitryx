import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google-auth'
import { createSession } from '@/lib/auth'
import sql from '@/lib/db'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

/**
 * GET /api/auth/google/callback
 * Handles the redirect from Google after consent.
 * Implements Option A: Auto-link accounts by email.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('[google callback] Error from Google:', error)
      return NextResponse.redirect(new URL('/login?error=google_denied', BASE_URL))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/login?error=invalid_callback', BASE_URL))
    }

    // Validate CSRF state
    const cookieStore = await cookies()
    const storedState = cookieStore.get('oauth_state')?.value
    cookieStore.delete('oauth_state')

    if (!storedState || storedState !== state) {
      console.error('[google callback] State mismatch')
      return NextResponse.redirect(new URL('/login?error=state_mismatch', BASE_URL))
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)
    const googleUser = await getGoogleUserInfo(tokens.access_token)

    if (!googleUser.email || !googleUser.verified_email) {
      return NextResponse.redirect(new URL('/login?error=unverified_google_email', BASE_URL))
    }

    const email = googleUser.email.toLowerCase()
    let userId: number

    // Option A: Auto-link by email
    // 1. Check if user exists with this google_id
    const [byGoogleId] = await sql`SELECT id, role FROM users WHERE google_id = ${googleUser.id}`
    if (byGoogleId) {
      userId = byGoogleId.id
    } else {
      // 2. Check if user exists with this email
      const [byEmail] = await sql`SELECT id, role FROM users WHERE email = ${email}`
      if (byEmail) {
        // Link Google account to existing user
        await sql`UPDATE users SET google_id = ${googleUser.id}, is_verified = true WHERE id = ${byEmail.id}`
        userId = byEmail.id
      } else {
        // 3. Create new user (Google-only, no password, auto-verified)
        const [newUser] = await sql`
          INSERT INTO users (name, email, google_id, is_verified)
          VALUES (${googleUser.name}, ${email}, ${googleUser.id}, true)
          RETURNING id
        `
        userId = newUser.id
      }
    }

    // Session rotation + create
    await sql`DELETE FROM sessions WHERE user_id = ${userId}`
    const sessionId = await createSession(userId)
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    // Redirect to gyms page (or admin if admin role)
    const [user] = await sql`SELECT role FROM users WHERE id = ${userId}`
    const redirectPath = user?.role === 'admin' ? '/admin' : '/gyms'
    return NextResponse.redirect(new URL(redirectPath, BASE_URL))
  } catch (err) {
    console.error('[google callback]', err)
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', BASE_URL))
  }
}
