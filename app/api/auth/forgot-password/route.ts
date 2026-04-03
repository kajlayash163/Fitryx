import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { generateOTP, hashOTP, sendOTPEmail } from '@/lib/otp'

/**
 * POST /api/auth/forgot-password
 * Sends a password-reset OTP to the user's email.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = await rateLimit(`forgot-pwd:${ip}`, 3, 3600000) // 3 per hour
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const [user] = await sql`SELECT id, google_id, password FROM users WHERE email = ${email.toLowerCase()}`

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset code has been sent.' })
    }

    // Google-only users can't reset password
    if (!user.password && user.google_id) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset code has been sent.' })
    }

    // Delete old reset tokens
    await sql`DELETE FROM password_reset_tokens WHERE user_id = ${user.id}`

    // Generate OTP and store
    const otp = generateOTP()
    const otpHash = await hashOTP(otp)
    await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${otpHash}, ${new Date(Date.now() + 15 * 60000).toISOString()})
    `

    // Send email
    await sendResetEmail(email, otp)

    return NextResponse.json({ message: 'If an account with that email exists, a reset code has been sent.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendResetEmail(email: string, otp: string) {
  // Reuse the OTP email sender but with a different template
  const nodemailer = (await import('nodemailer')).default
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    console.log(`\n========================================`)
    console.log(`  PASSWORD RESET CODE for ${email}: ${otp}`)
    console.log(`========================================\n`)
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  await transporter.sendMail({
    from: `"Fitryx" <${gmailUser}>`,
    to: email,
    subject: 'Reset your Fitryx password',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0a0a0f; color: #e0e0e0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">Fitryx</h1>
          <p style="font-size: 14px; color: #888; margin-top: 4px;">Password Reset</p>
        </div>
        <p style="font-size: 15px; color: #ccc; line-height: 1.6;">Use the code below to reset your password. This code expires in <strong>15 minutes</strong>.</p>
        <div style="background: #1a1a2e; border: 1px solid #333; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #00d4aa; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #666; line-height: 1.5;">If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        <p style="font-size: 11px; color: #555; text-align: center;">© 2025 Fitryx. All rights reserved.</p>
      </div>
    `,
  })
}
