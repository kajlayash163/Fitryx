import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession, hashPassword, comparePassword } from '@/lib/auth'

/**
 * PATCH /api/auth/me — Update profile (name, password)
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const { name, currentPassword, newPassword } = await req.json()

    // Update name
    if (name && name.trim()) {
      const cleanName = name.trim().slice(0, 100)
      await sql`UPDATE users SET name = ${cleanName} WHERE id = ${user.id}`
    }

    // Update password
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
      }

      // Check if user has a password (not Google-only)
      const [dbUser] = await sql`SELECT password FROM users WHERE id = ${user.id}`
      if (dbUser.password) {
        // Must verify current password
        if (!currentPassword) {
          return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
        }
        const valid = await comparePassword(currentPassword, dbUser.password)
        if (!valid) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }
      }

      const hashed = await hashPassword(newPassword)
      await sql`UPDATE users SET password = ${hashed} WHERE id = ${user.id}`
    }

    // Fetch updated user
    const [updated] = await sql`SELECT id, name, email, role, created_at, is_verified, google_id FROM users WHERE id = ${user.id}`
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error('[profile update]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
