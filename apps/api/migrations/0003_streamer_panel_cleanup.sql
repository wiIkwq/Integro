ALTER TABLE minecraft_actions ADD COLUMN deleted_at TEXT;
ALTER TABLE minecraft_actions ADD COLUMN random_count INTEGER NOT NULL DEFAULT 1;

ALTER TABLE vouchers ADD COLUMN per_user_limit INTEGER NOT NULL DEFAULT 1;
ALTER TABLE vouchers ADD COLUMN per_user_cooldown_seconds INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS voucher_redemptions_new (
  id TEXT PRIMARY KEY,
  voucher_id TEXT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_granted INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO voucher_redemptions_new (id, voucher_id, user_id, coins_granted, created_at)
SELECT id, voucher_id, user_id, coins_granted, created_at
FROM voucher_redemptions;

DROP TABLE voucher_redemptions;
ALTER TABLE voucher_redemptions_new RENAME TO voucher_redemptions;

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_user_id ON voucher_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_voucher_user_created ON voucher_redemptions(voucher_id, user_id, created_at);
