UPDATE users
SET role = 'tester',
    name = 'Тестер',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'bogdan3000tm@gmail.com';

UPDATE users
SET role = 'developer',
    name = 'Разработчик',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'ihnatenko.bogdan@gmail.com';

UPDATE users
SET role = 'streamer',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'diff1x@mail.ru';

UPDATE users
SET role = 'streamer',
    updated_at = CURRENT_TIMESTAMP
WHERE role = 'admin'
  AND lower(email) != 'ihnatenko.bogdan@gmail.com';

CREATE TABLE IF NOT EXISTS bridge_device_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  device_name TEXT,
  mod_version TEXT,
  minecraft_version TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_device_id TEXT,
  device_token TEXT,
  denied_reason TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_bridge_device_codes_code ON bridge_device_codes(code);
CREATE INDEX IF NOT EXISTS idx_bridge_device_codes_status_expires ON bridge_device_codes(status, expires_at);

CREATE TABLE IF NOT EXISTS bridge_devices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  mod_version TEXT,
  minecraft_version TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_bridge_devices_user_id ON bridge_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_bridge_devices_revoked_at ON bridge_devices(revoked_at);
