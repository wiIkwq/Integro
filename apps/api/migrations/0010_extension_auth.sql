CREATE TABLE IF NOT EXISTS extension_device_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  device_token TEXT,
  denied_reason TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_extension_device_codes_code ON extension_device_codes(code);
CREATE INDEX IF NOT EXISTS idx_extension_device_codes_status_expires ON extension_device_codes(status, expires_at);

CREATE TABLE IF NOT EXISTS extension_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_extension_tokens_user_id ON extension_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_extension_tokens_revoked_at ON extension_tokens(revoked_at);
