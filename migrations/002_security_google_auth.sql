-- Fitryx: Security + Google Auth Migration
-- Run this against your Neon database

-- 1. Rate limits table (DB-backed rate limiter)
CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_created ON rate_limits (key, created_at);

-- 2. Google OAuth support
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- 3. Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Cleanup: auto-purge old rate limits (optional cron)
-- DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';
