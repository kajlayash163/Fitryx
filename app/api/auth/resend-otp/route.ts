import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { generateOTP, hashOTP, sendOTPEmail } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = rateLimit(`resend-otp:${ip}`, 3, 3600000) // 3 per hour
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait before requesting another code.' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const [user] = await sql`SELECT id, is_verified FROM users WHERE email = ${email.toLowerCase()}`
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.is_verified) return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })

    // Delete old OTPs
    await sql`DELETE FROM user_otps WHERE user_id = ${user.id}`

    // Generate new
    const otp = generateOTP()
    const otpHash = await hashOTP(otp)
    await sql`INSERT INTO user_otps (user_id, otp_hash, expires_at) VALUES (${user.id}, ${otpHash}, ${new Date(Date.now() + 15 * 60000).toISOString()})`
    await sendOTPEmail(email, otp)

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' })
  } catch (err) {
    console.error('[resend-otp]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
