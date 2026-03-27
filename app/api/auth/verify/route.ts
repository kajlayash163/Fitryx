import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { createSession } from '@/lib/auth'
import { verifyOTP } from '@/lib/otp'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 })
    }

    // Find user
    const [user] = await sql`SELECT id, name, email, role, is_verified FROM users WHERE email = ${email.toLowerCase()}`
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (user.is_verified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
    }

    // Find latest OTP
    const [otpRecord] = await sql`
      SELECT id, otp_hash, expires_at FROM user_otps
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC LIMIT 1
    `
    if (!otpRecord) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 })
    }
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    // Mark as verified
    await sql`UPDATE users SET is_verified = true WHERE id = ${user.id}`
    // Clean up OTPs
    await sql`DELETE FROM user_otps WHERE user_id = ${user.id}`

    // Create session now
    const sessionId = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({
      message: 'Email verified successfully!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[verify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
