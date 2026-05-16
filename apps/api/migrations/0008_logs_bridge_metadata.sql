ALTER TABLE bridge_device_codes ADD COLUMN computer_name TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN os_name TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN os_version TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN java_version TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN minecraft_user TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN client_locale TEXT;

ALTER TABLE bridge_devices ADD COLUMN computer_name TEXT;
ALTER TABLE bridge_devices ADD COLUMN os_name TEXT;
ALTER TABLE bridge_devices ADD COLUMN os_version TEXT;
ALTER TABLE bridge_devices ADD COLUMN java_version TEXT;
ALTER TABLE bridge_devices ADD COLUMN minecraft_user TEXT;
ALTER TABLE bridge_devices ADD COLUMN client_locale TEXT;

CREATE TABLE IF NOT EXISTS bridge_command_logs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  purchase_id TEXT,
  action_title TEXT,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  message TEXT,
  command_snapshot TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_bridge_command_logs_created ON bridge_command_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_bridge_command_logs_status ON bridge_command_logs(status);

CREATE TABLE IF NOT EXISTS system_logs (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'info',
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
