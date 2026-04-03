import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { verifyOTP } from '@/lib/otp'
import { rateLimit } from '@/lib/rate-limit'

/**
 * POST /api/auth/reset-password
 * Verifies reset token (OTP) and updates the password.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = await rateLimit(`reset-pwd:${ip}`, 5, 900000) // 5 per 15 min
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 })
    }

    const { email, otp, newPassword } = await req.json()
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, code, and new password are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const [user] = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 })
    }

    // Find the latest reset token
    const [token] = await sql`
      SELECT id, token_hash, expires_at FROM password_reset_tokens
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC LIMIT 1
    `
    if (!token) {
      return NextResponse.json({ error: 'No reset code found. Please request a new one.' }, { status: 400 })
    }
    if (new Date(token.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 400 })
    }

    const valid = await verifyOTP(otp, token.token_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 })
    }

    // Update password
    const hashed = await hashPassword(newPassword)
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${user.id}`

    // Cleanup tokens and invalidate all sessions
    await sql`DELETE FROM password_reset_tokens WHERE user_id = ${user.id}`
    await sql`DELETE FROM sessions WHERE user_id = ${user.id}`

    return NextResponse.json({ message: 'Password reset successfully. Please sign in with your new password.' })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
