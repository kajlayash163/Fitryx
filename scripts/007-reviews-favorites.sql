-- Reviews table (replaces hardcoded dummy reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id INT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, gym_id)
);

-- Favorites / Wishlist table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id INT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, gym_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_gym ON reviews(gym_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_gym ON favorites(gym_id);

-- Add coordinates to gyms for Google Maps
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7);
