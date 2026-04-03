import nodemailer from 'nodemailer'

/**
 * Send a welcome email after successful registration & verification.
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    console.log(`[Welcome Email] Skipped — no Gmail credentials. Would send to ${email}`)
    return true
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  try {
    await transporter.sendMail({
      from: `"Fitryx" <${gmailUser}>`,
      to: email,
      subject: 'Welcome to Fitryx! 🎉',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0a0a0f; color: #e0e0e0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 700; color: #ffffff; margin: 0;">Welcome to Fitryx!</h1>
          </div>
          <p style="font-size: 16px; color: #ccc; line-height: 1.6;">Hey <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #ccc; line-height: 1.6;">You've joined India's #1 gym discovery platform. Here's what you can do:</p>
          <ul style="font-size: 14px; color: #aaa; line-height: 2; padding-left: 20px;">
            <li>🏋️ Browse & compare verified gyms</li>
            <li>⭐ Read real reviews from members</li>
            <li>💰 Find the best pricing plans</li>
            <li>❤️ Save your favorite gyms</li>
          </ul>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/gyms" style="display: inline-block; padding: 14px 32px; background: #00d4aa; color: #0a0a0f; font-weight: 700; font-size: 14px; border-radius: 12px; text-decoration: none;">Browse Gyms →</a>
          </div>
          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="font-size: 11px; color: #555; text-align: center;">© 2025 Fitryx. All rights reserved.</p>
        </div>
      `,
    })
    return true
  } catch (err) {
    console.error('[Welcome Email Error]', err)
    return false
  }
}
