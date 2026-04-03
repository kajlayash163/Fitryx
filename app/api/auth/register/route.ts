import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { isDisposableEmail, isValidEmailFormat } from '@/lib/disposable-domains'
import { generateOTP, hashOTP, sendOTPEmail } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per hour per IP
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = await rateLimit(`register:${ip}`, 5, 3600000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 })
    }

    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Block disposable/temp emails
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: 'Temporary or disposable email addresses are not allowed. Please use a permanent email.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Trim and sanitize name
    const cleanName = name.trim().slice(0, 100)

    const existing = await sql`SELECT id, is_verified FROM users WHERE email = ${email.toLowerCase()}`
    if (existing.length > 0) {
      if (!existing[0].is_verified) {
        // User exists but not verified — resend OTP
        const otp = generateOTP()
        const otpHash = await hashOTP(otp)
        await sql`DELETE FROM user_otps WHERE user_id = ${existing[0].id}`
        await sql`INSERT INTO user_otps (user_id, otp_hash, expires_at) VALUES (${existing[0].id}, ${otpHash}, ${new Date(Date.now() + 15 * 60000).toISOString()})`
        await sendOTPEmail(email, otp)
        return NextResponse.json({ message: 'Account exists but is not verified. A new verification code has been sent.', needsVerification: true, email }, { status: 200 })
      }
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const [user] = await sql`
      INSERT INTO users (name, email, password, is_verified)
      VALUES (${cleanName}, ${email.toLowerCase()}, ${hashed}, false)
      RETURNING id, name, email, role
    `

    // Generate and send OTP
    const otp = generateOTP()
    const otpHash = await hashOTP(otp)
    await sql`INSERT INTO user_otps (user_id, otp_hash, expires_at) VALUES (${user.id}, ${otpHash}, ${new Date(Date.now() + 15 * 60000).toISOString()})`
    await sendOTPEmail(email, otp)

    // Do NOT auto-login — require verification first
    return NextResponse.json({
      message: 'Account created! Please check your email for the verification code.',
      needsVerification: true,
      email,
    }, { status: 201 })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
