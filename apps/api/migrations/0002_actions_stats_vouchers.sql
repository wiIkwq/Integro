ALTER TABLE minecraft_actions ADD COLUMN command_plan TEXT;
ALTER TABLE minecraft_actions ADD COLUMN command_mode TEXT NOT NULL DEFAULT 'sequence';
ALTER TABLE minecraft_actions ADD COLUMN repeat_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE minecraft_actions ADD COLUMN repeat_delay_ms INTEGER NOT NULL DEFAULT 0;
ALTER TABLE minecraft_actions ADD COLUMN step_delay_ms INTEGER NOT NULL DEFAULT 0;
ALTER TABLE minecraft_actions ADD COLUMN banner_url TEXT;

ALTER TABLE vouchers ADD COLUMN deleted_at TEXT;
