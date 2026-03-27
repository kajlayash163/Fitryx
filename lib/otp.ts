import bcrypt from 'bcryptjs'
import { randomInt } from 'crypto'
import nodemailer from 'nodemailer'

export function generateOTP(): string {
  return String(randomInt(100000, 999999))
}

export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10)
}

export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    console.log(`\n========================================`)
    console.log(`  OTP for ${email}: ${otp}`)
    console.log(`  (No Gmail credentials configured)`)
    console.log(`========================================\n`)
    return true
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  })

  try {
    await transporter.sendMail({
      from: `"Fitryx" <${gmailUser}>`,
      to: email,
      subject: 'Verify your Fitryx account',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0a0a0f; color: #e0e0e0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">Fitryx</h1>
            <p style="font-size: 14px; color: #888; margin-top: 4px;">Email Verification</p>
          </div>
          <p style="font-size: 15px; color: #ccc; line-height: 1.6;">Use the code below to verify your email address. This code expires in <strong>15 minutes</strong>.</p>
          <div style="background: #1a1a2e; border: 1px solid #333; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #00d4aa; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #666; line-height: 1.5;">If you didn't create a Fitryx account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="font-size: 11px; color: #555; text-align: center;">© 2025 Fitryx. All rights reserved.</p>
        </div>
      `,
    })
    return true
  } catch (err) {
    console.error('[OTP Email Error]', err)
    // Fallback: print to console
    console.log(`\n  OTP for ${email}: ${otp}\n`)
    return false
  }
}
