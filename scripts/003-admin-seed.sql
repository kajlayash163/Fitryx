-- Creates a default admin user: admin@fitryx.com / fitryx2025
-- Password is bcrypt hash of "fitryx2025" with cost 12
INSERT INTO users (name, email, password, role)
VALUES (
  'Fitryx Admin',
  'admin@fitryx.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/lGtWFIJmS',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
