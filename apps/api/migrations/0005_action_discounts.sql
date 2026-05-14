CREATE TABLE IF NOT EXISTS action_discounts (
  id TEXT PRIMARY KEY,
  action_id TEXT NOT NULL REFERENCES minecraft_actions(id) ON DELETE CASCADE,
  percent INTEGER NOT NULL,
  starts_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_action_discounts_action_active ON action_discounts(action_id, is_active, deleted_at);
CREATE INDEX IF NOT EXISTS idx_action_discounts_expires_at ON action_discounts(expires_at);

UPDATE users
SET name = 'bogdan3000tm',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'bogdan3000tm@gmail.com' AND name = 'Тестер';

UPDATE users
SET name = 'ihnatenko.bogdan',
    updated_at = CURRENT_TIMESTAMP
WHERE lower(email) = 'ihnatenko.bogdan@gmail.com' AND name = 'Разработчик';
