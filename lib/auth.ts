import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import sql from './db'
import { randomBytes } from 'crypto'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number) {
  const sessionId = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
  `
  return sessionId
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  if (!sessionId) return null

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.role, u.created_at, u.is_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ${sessionId}
      AND s.expires_at > NOW()
  `
  return rows[0] ?? null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  if (sessionId) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
  }
}
