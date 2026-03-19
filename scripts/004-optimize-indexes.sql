-- Create indexes for performance optimization

-- Index on gyms for search queries
CREATE INDEX IF NOT EXISTS idx_gyms_name_location ON gyms USING gin(to_tsvector('english', name || ' ' || location));

-- Index on gyms rating for sorting
CREATE INDEX IF NOT EXISTS idx_gyms_rating ON gyms(rating DESC);

-- Index on gyms verified status for filtering
CREATE INDEX IF NOT EXISTS idx_gyms_verified ON gyms(verified);

-- Index on gyms facilities for facility filtering
CREATE INDEX IF NOT EXISTS idx_gyms_facilities ON gyms USING gin(facilities);

-- Index on users email for login queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on sessions user_id for session queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Index on sessions expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_gyms_verified_rating ON gyms(verified, rating DESC);
