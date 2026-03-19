-- Add new columns to gyms table for gender type, women safety, opening hours, and city

-- Gender type: 'unisex', 'women_only', 'men_only'
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS gender_type VARCHAR(20) NOT NULL DEFAULT 'unisex' CHECK (gender_type IN ('unisex', 'women_only', 'men_only'));

-- Women safety rating (1-5 scale, NULL means not rated)
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS women_safety_rating NUMERIC(3,2) DEFAULT NULL CHECK (women_safety_rating IS NULL OR (women_safety_rating >= 1 AND women_safety_rating <= 5));

-- Opening hours as text (e.g., "5:00 AM - 11:00 PM")
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS opening_hours VARCHAR(100) DEFAULT '6:00 AM - 10:00 PM';

-- City for future multi-city support
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT 'Jaipur';

-- Phone number
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL;

-- Index on city for city-based filtering
CREATE INDEX IF NOT EXISTS idx_gyms_city ON gyms(city);

-- Index on gender_type for gender filtering
CREATE INDEX IF NOT EXISTS idx_gyms_gender_type ON gyms(gender_type);
