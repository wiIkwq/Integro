ALTER TABLE bridge_device_codes ADD COLUMN ip_address TEXT;
ALTER TABLE bridge_device_codes ADD COLUMN user_agent TEXT;

ALTER TABLE bridge_devices ADD COLUMN ip_address TEXT;
ALTER TABLE bridge_devices ADD COLUMN user_agent TEXT;
