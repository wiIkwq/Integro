-- Generated from dintegrate.cfg. DonatePay credentials are intentionally not imported.
INSERT INTO minecraft_actions
  (id, title, description, price, command, command_plan, command_mode, repeat_count,
   repeat_delay_ms, step_delay_ms, random_count, banner_url, sentiment, cooldown_seconds,
   is_enabled, created_at, updated_at)
VALUES
  ('dintegrate-rule-100', 'Хороший рандом', '', 75, '/dpi test {user} 10 1',
   '[{"command":"/dpi test {user} 10 1","delayMs":0},{"command":"/dpi test {user} 15 1","delayMs":0},{"command":"/dpi test {user} 20 1","delayMs":0},{"command":"/dpi test {user} 25 1","delayMs":0},{"command":"/dpi test {user} 33 1","delayMs":0},{"command":"/dpi test {user} 34 1","delayMs":0},{"command":"/dpi test {user} 35 1","delayMs":0},{"command":"/dpi test {user} 36 1","delayMs":0},{"command":"/dpi test {user} 37 1","delayMs":0},{"command":"/dpi test {user} 40 1","delayMs":0},{"command":"/dpi test {user} 47 1","delayMs":0},{"command":"/dpi test {user} 48 1","delayMs":0},{"command":"/dpi test {user} 49 1","delayMs":0},{"command":"/dpi test {user} 50 1","delayMs":0},{"command":"/dpi test {user} 52 1","delayMs":0},{"command":"/dpi test {user} 55 1","delayMs":0},{"command":"/dpi test {user} 60 1","delayMs":0},{"command":"/dpi test {user} 66 1","delayMs":0},{"command":"/dpi test {user} 68 1","delayMs":0},{"command":"/dpi test {user} 69 1","delayMs":0},{"command":"/dpi test {user} 70 1","delayMs":0},{"command":"/dpi test {user} 71 1","delayMs":0},{"command":"/dpi test {user} 72 1","delayMs":0},{"command":"/dpi test {user} 73 1","delayMs":0},{"command":"/dpi test {user} 75 1","delayMs":0},{"command":"/dpi test {user} 76 1","delayMs":0},{"command":"/dpi test {user} 78 1","delayMs":0},{"command":"/dpi test {user} 79 1","delayMs":0},{"command":"/dpi test {user} 90 1","delayMs":0},{"command":"/dpi test {user} 91 1","delayMs":0},{"command":"/dpi test {user} 92 1","delayMs":0},{"command":"/dpi test {user} 96 1","delayMs":0},{"command":"/dpi test {user} 99 1","delayMs":0},{"command":"/dpi test {user} 101 1","delayMs":0},{"command":"/dpi test {user} 120 1","delayMs":0},{"command":"/dpi test {user} 121 1","delayMs":0},{"command":"/dpi test {user} 123 1","delayMs":0},{"command":"/dpi test {user} 124 1","delayMs":0},{"command":"/dpi test {user} 125 1","delayMs":0},{"command":"/dpi test {user} 126 1","delayMs":0},{"command":"/dpi test {user} 127 1","delayMs":0},{"command":"/dpi test {user} 142 1","delayMs":0},{"command":"/dpi test {user} 154 1","delayMs":0},{"command":"/dpi test {user} 313 1","delayMs":0},{"command":"/dpi test {user} 365 1","delayMs":0},{"command":"/dpi test {user} 444 1","delayMs":0},{"command":"/dpi test {user} 500 1","delayMs":0}]', 'random', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-20T16:15:56.813Z', '2026-05-20T16:15:56.813Z')
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  command = excluded.command,
  command_plan = excluded.command_plan,
  command_mode = excluded.command_mode,
  repeat_count = excluded.repeat_count,
  repeat_delay_ms = excluded.repeat_delay_ms,
  step_delay_ms = excluded.step_delay_ms,
  random_count = excluded.random_count,
  sentiment = excluded.sentiment,
  cooldown_seconds = excluded.cooldown_seconds,
  is_enabled = excluded.is_enabled,
  updated_at = excluded.updated_at;
INSERT INTO minecraft_actions
  (id, title, description, price, command, command_plan, command_mode, repeat_count,
   repeat_delay_ms, step_delay_ms, random_count, banner_url, sentiment, cooldown_seconds,
   is_enabled, created_at, updated_at)
VALUES
  ('dintegrate-rule-101', 'Плохой рандом', '', 220, '/dpi test {user} 17 1',
   '[{"command":"/dpi test {user} 17 1","delayMs":0},{"command":"/dpi test {user} 21 1","delayMs":0},{"command":"/dpi test {user} 22 1","delayMs":0},{"command":"/dpi test {user} 36 1","delayMs":0},{"command":"/dpi test {user} 42 1","delayMs":0},{"command":"/dpi test {user} 45 1","delayMs":0},{"command":"/dpi test {user} 61 1","delayMs":0},{"command":"/dpi test {user} 62 1","delayMs":0},{"command":"/dpi test {user} 63 1","delayMs":0},{"command":"/dpi test {user} 77 1","delayMs":0},{"command":"/dpi test {user} 88 1","delayMs":0},{"command":"/dpi test {user} 93 1","delayMs":0},{"command":"/dpi test {user} 95 1","delayMs":0},{"command":"/dpi test {user} 111 1","delayMs":0},{"command":"/dpi test {user} 122 1","delayMs":0},{"command":"/dpi test {user} 128 1","delayMs":0},{"command":"/dpi test {user} 129 1","delayMs":0},{"command":"/dpi test {user} 148 1","delayMs":0},{"command":"/dpi test {user} 166 1","delayMs":0},{"command":"/dpi test {user} 168 1","delayMs":0},{"command":"/dpi test {user} 175 1","delayMs":0},{"command":"/dpi test {user} 222 1","delayMs":0},{"command":"/dpi test {user} 261 1","delayMs":0},{"command":"/dpi test {user} 301 1","delayMs":0},{"command":"/dpi test {user} 305 1","delayMs":0},{"command":"/dpi test {user} 333 1","delayMs":0},{"command":"/dpi test {user} 335 1","delayMs":0},{"command":"/dpi test {user} 355 1","delayMs":0},{"command":"/dpi test {user} 362 1","delayMs":0},{"command":"/dpi test {user} 366 1","delayMs":0},{"command":"/dpi test {user} 377 1","delayMs":0},{"command":"/dpi test {user} 388 1","delayMs":0},{"command":"/dpi test {user} 399 1","delayMs":0},{"command":"/dpi test {user} 433 1","delayMs":0},{"command":"/dpi test {user} 455 1","delayMs":0},{"command":"/dpi test {user} 456 1","delayMs":0},{"command":"/dpi test {user} 466 1","delayMs":0},{"command":"/dpi test {user} 467 1","delayMs":0},{"command":"/dpi test {user} 777 1","delayMs":0},{"command":"/dpi test {user} 799 1","delayMs":0},{"command":"/dpi test {user} 888 1","delayMs":0},{"command":"/dpi test {user} 999 1","delayMs":0},{"command":"/dpi test {user} 1222 1","delayMs":0},{"command":"/dpi test {user} 1333 1","delayMs":0},{"command":"/dpi test {user} 2222 1","delayMs":0},{"command":"/dpi test {user} 3333 1","delayMs":0},{"command":"/dpi test {user} 5555 1","delayMs":0}]', 'random', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-20T16:15:56.813Z', '2026-05-20T16:15:56.813Z')
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  command = excluded.command,
  command_plan = excluded.command_plan,
  command_mode = excluded.command_mode,
  repeat_count = excluded.repeat_count,
  repeat_delay_ms = excluded.repeat_delay_ms,
  step_delay_ms = excluded.step_delay_ms,
  random_count = excluded.random_count,
  sentiment = excluded.sentiment,
  cooldown_seconds = excluded.cooldown_seconds,
  is_enabled = excluded.is_enabled,
  updated_at = excluded.updated_at;
