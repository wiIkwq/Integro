-- Generated from dintegrate.cfg. DonatePay credentials are intentionally not imported.
INSERT INTO minecraft_actions
  (id, title, description, price, command, command_plan, command_mode, repeat_count,
   repeat_delay_ms, step_delay_ms, random_count, banner_url, sentiment, cooldown_seconds,
   is_enabled, created_at, updated_at)
VALUES
  ('dintegrate-rule-1', 'Правило 1 · 1 монета', '', 1, '/summon superbwarfare:mortar_shell ~2 ~30 ~2',
   '[{"command":"/summon superbwarfare:mortar_shell ~2 ~30 ~2","delayMs":2500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-2', 'Правило 2 · 20 монет', '', 20, '/give @a minecraft:golden_apple 10',
   '[{"command":"/give @a minecraft:golden_apple 10","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-3', 'Правило 3 · 10 монет', '', 10, '/give @a minecraft:rotten_flesh 10',
   '[{"command":"/give @a minecraft:rotten_flesh 10","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-4', 'Правило 4 · 15 монет', '', 15, '/give @a minecraft:golden_carrot 20',
   '[{"command":"/give @a minecraft:golden_carrot 20","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-5', 'Правило 5 · 25 монет', '', 25, '/give @a minecraft:totem_of_undying',
   '[{"command":"/give @a minecraft:totem_of_undying","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-6', 'Правило 6 · 33 монеты', '', 33, '/give @a easy_hammers:netherite_hammer{Enchantments:[{id:"minecraft:efficiency",lvl:5s},{id:"minecraft:unbreaking",lvl:3s},{id:"minecraft:mending",lvl:1s},{id:"minecraft:fortune",lvl:5s}]}',
   '[{"command":"/give @a easy_hammers:netherite_hammer{Enchantments:[{id:\"minecraft:efficiency\",lvl:5s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s},{id:\"minecraft:fortune\",lvl:5s}]}","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-7', 'Правило 7 · 34 монеты', '', 34, '/give @a superbwarfare:lunge_mine',
   '[{"command":"/give @a superbwarfare:lunge_mine","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-8', 'Правило 8 · 40 монет', '', 40, '/give Bebrok minecraft:iron_ingot 64',
   '[{"command":"/give Bebrok minecraft:iron_ingot 64","delayMs":1500},{"command":"/give Bebrok minecraft:diamond 20","delayMs":0},{"command":"/give Bebrok minecraft:gold_ingot 48","delayMs":0},{"command":"/give Bebrok minecraft:coal_block 32","delayMs":0},{"command":"/give Bebrok minecraft:redstone_block 32","delayMs":0},{"command":"/give Bebrok minecraft:lapis_block 12","delayMs":0},{"command":"/give Bebrok minecraft:redstone_block 32","delayMs":0},{"command":"/give Bebrok minecraft:netherite_ingot 12","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-9', 'Правило 9 · 47 монет', '', 47, '/give @a superbwarfare:glock_17',
   '[{"command":"/give @a superbwarfare:glock_17","delayMs":1500},{"command":"/give @a superbwarfare:handgun_ammo_box 16","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-10', 'Правило 10 · 50 монет', '', 50, '/give @a minecraft:netherite_sword{Enchantments:[{id:"minecraft:sharpness",lvl:5s},{id:"minecraft:unbreaking",lvl:3s},{id:"minecraft:mending",lvl:1s},{id:"minecraft:looting",lvl:3s},{id:"minecraft:sweeping",lvl:3s}]}',
   '[{"command":"/give @a minecraft:netherite_sword{Enchantments:[{id:\"minecraft:sharpness\",lvl:5s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s},{id:\"minecraft:looting\",lvl:3s},{id:\"minecraft:sweeping\",lvl:3s}]}","delayMs":1500},{"command":"/give @a easy_hammers:netherite_hammer{Enchantments:[{id:\"minecraft:efficiency\",lvl:5s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s},{id:\"minecraft:fortune\",lvl:3s}]}","delayMs":0},{"command":"/give @a minecraft:netherite_axe{Enchantments:[{id:\"minecraft:efficiency\",lvl:5s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s},{id:\"minecraft:fortune\",lvl:3s},{id:\"minecraft:sharpness\",lvl:5s}]}","delayMs":0},{"command":"/give @a minecraft:netherite_shovel{Enchantments:[{id:\"minecraft:efficiency\",lvl:5s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s},{id:\"minecraft:fortune\",lvl:3s}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-11', 'Правило 11 · 66 монет', '', 66, '/give Bebrok spore:cdu',
   '[{"command":"/give Bebrok spore:cdu","delayMs":1500},{"command":"/give Bebrok spore:ice_canister 16","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-12', 'Правило 12 · 70 монет', '', 70, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:laser_tower"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:laser_tower\"}} 1","delayMs":1500},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0},{"command":"/give Bebrok superbwarfare:creative_charging_station","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-13', 'Правило 13 · 71 монета', '', 71, '/give @a superbwarfare:awm',
   '[{"command":"/give @a superbwarfare:awm","delayMs":1500},{"command":"/give @a superbwarfare:sniper_ammo_box 10","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-14', 'Правило 14 · 75 монет', '', 75, '/give @a superbwarfare:ak_47',
   '[{"command":"/give @a superbwarfare:ak_47","delayMs":1500},{"command":"/give @a superbwarfare:rifle_ammo_box 20","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-15', 'Правило 15 · 90 монет', '', 90, '/give @a minecraft:netherite_helmet{Enchantments:[{id:"minecraft:protection",lvl:4s},{id:"minecraft:unbreaking",lvl:3s},{id:"minecraft:mending",lvl:1s}]}',
   '[{"command":"/give @a minecraft:netherite_helmet{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":1500},{"command":"/give @a minecraft:netherite_chestplate{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0},{"command":"/give @a minecraft:netherite_leggings{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0},{"command":"/give @a minecraft:netherite_boots{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-16', 'Правило 16 · 92 монеты', '', 92, '/give @a spore:inf_helmet{Enchantments:[{id:"minecraft:protection",lvl:4s},{id:"minecraft:unbreaking",lvl:3s},{id:"minecraft:mending",lvl:1s}]}',
   '[{"command":"/give @a spore:inf_helmet{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":1500},{"command":"/give @a spore:inf_chest{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0},{"command":"/give @a spore:inf_pants{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0},{"command":"/give @a spore:inf_boots{Enchantments:[{id:\"minecraft:protection\",lvl:4s},{id:\"minecraft:unbreaking\",lvl:3s},{id:\"minecraft:mending\",lvl:1s}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-17', 'Правило 17 · 99 монет', '', 99, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:waveforce_tower"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:waveforce_tower\"}} 1","delayMs":1500},{"command":"/give Bebrok superbwarfare:creative_charging_station","delayMs":0},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-18', 'Правило 18 · 101 монета', '', 101, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:bmp_2"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:bmp_2\"}} 1","delayMs":1500},{"command":"/give @p superbwarfare:large_battery_pack{Energy:20000000} 1","delayMs":0},{"command":"/give Bebrok superbwarfare:small_shell_ap 512","delayMs":0},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-19', 'Правило 19 · 120 монет', '', 120, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:mi_28"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:mi_28\"}} 1","delayMs":1500},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0},{"command":"/give Bebrok superbwarfare:large_battery_pack{Energy:20000000} 1","delayMs":0},{"command":"/give @p superbwarfare:small_rocket 256","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-20', 'Правило 20 · 365 монет', '', 365, '/kill @e[type=!player,type=!superbwarfare:laser_tower,type=!superbwarfare:waveforce_tower,type=!superbwarfare:bmp_2,type=!superbwarfare:yx_100]',
   '[{"command":"/kill @e[type=!player,type=!superbwarfare:laser_tower,type=!superbwarfare:waveforce_tower,type=!superbwarfare:bmp_2,type=!superbwarfare:yx_100]","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-21', 'Правило 21 · 17 монет', '', 17, '/summon minecraft:zombie',
   '[{"command":"/summon minecraft:zombie","delayMs":1500},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0},{"command":"/summon minecraft:zombie","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-22', 'Правило 22 · 21 монета', '', 21, '/summon spore:inf_villager',
   '[{"command":"/summon spore:inf_villager","delayMs":1500},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0},{"command":"/summon spore:inf_villager","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-23', 'Правило 23 · 22 монеты', '', 22, '/summon minecraft:creeper',
   '[{"command":"/summon minecraft:creeper","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-24', 'Правило 24 · 42 монеты', '', 42, '/summon artifacts:mimic ~5 ~ ~5',
   '[{"command":"/summon artifacts:mimic ~5 ~ ~5","delayMs":1500},{"command":"/summon artifacts:mimic ~5 ~ ~-5","delayMs":0},{"command":"/summon artifacts:mimic ~5 ~ ~","delayMs":0},{"command":"/summon artifacts:mimic ~ ~ ~","delayMs":0},{"command":"/summon artifacts:mimic ~2 ~ ~2","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-25', 'Правило 25 · 61 монета', '', 61, '/summon spore:braiomil ~1 ~ ~-1',
   '[{"command":"/summon spore:braiomil ~1 ~ ~-1","delayMs":1500},{"command":"/summon spore:inf_drowned ~2 ~ ~-2","delayMs":0},{"command":"/summon spore:bairn ~3 ~ ~-3","delayMs":0},{"command":"/summon spore:inf_human ~4 ~ ~-4","delayMs":0},{"command":"/summon spore:bloater ~-1 ~ ~1","delayMs":0},{"command":"/summon spore:bloater ~-2 ~ ~2","delayMs":0},{"command":"/summon spore:inf_player ~-3 ~ ~3","delayMs":0},{"command":"/summon spore:chemist ~-4 ~ ~4","delayMs":0},{"command":"/summon spore:inf_villager ~-4 ~ ~5","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-26', 'Правило 26 · 62 монеты', '', 62, '/summon spore:busser',
   '[{"command":"/summon spore:busser","delayMs":1500},{"command":"/summon spore:busser","delayMs":0},{"command":"/summon spore:busser","delayMs":0},{"command":"/summon spore:busser","delayMs":0},{"command":"/summon spore:busser","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-27', 'Правило 27 · 93 монеты', '', 93, '/summon spore:stalker ~1 ~ ~2',
   '[{"command":"/summon spore:stalker ~1 ~ ~2","delayMs":1500},{"command":"/summon spore:busser ~ ~ ~1","delayMs":0},{"command":"/summon spore:busser ~-2 ~ ~3","delayMs":0},{"command":"/summon spore:gastgaber ~1 ~ ~4","delayMs":0},{"command":"/summon spore:hevoker ~-2 ~ ~-3","delayMs":0},{"command":"/summon spore:hvindicator ~4 ~ ~2","delayMs":0},{"command":"/summon spore:stalker ~3 ~ ~-2","delayMs":0},{"command":"/summon spore:stalker ~-3 ~ ~-2","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-28', 'Правило 28 · 95 монет', '', 95, '/champions summon minecraft:zombie 4',
   '[{"command":"/champions summon minecraft:zombie 4","delayMs":1500},{"command":"/champions summon minecraft:zombie 4","delayMs":0},{"command":"/champions summon minecraft:zombie 4","delayMs":0},{"command":"/champions summon minecraft:zombie 4","delayMs":0},{"command":"/champions summon minecraft:zombie 4","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-29', 'Правило 29 · 63 монеты', '', 63, '/summon spore:scent',
   '[{"command":"/summon spore:scent","delayMs":1500},{"command":"/summon spore:scent ~5 ~ ~","delayMs":0},{"command":"/summon spore:scent ~ ~ ~-5","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-30', 'Правило 30 · 166 монет', '', 166, '/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}',
   '[{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}","delayMs":1500},{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:9999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon minecraft:creeper ~ ~ ~ {ActiveEffects:[{Id:14b,Duration:999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-31', 'Правило 31 · 222 монеты', '', 222, '/kill @a',
   '[{"command":"/kill @a","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-32', 'Правило 32 · 128 монет', '', 128, '/summon superbwarfare:c4 ~ ~2 ~',
   '[{"command":"/summon superbwarfare:c4 ~ ~2 ~","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-33', 'Правило 33 · 168 монет', '', 168, '/summon superbwarfare:mortar_shell ~2 ~30 ~2',
   '[{"command":"/summon superbwarfare:mortar_shell ~2 ~30 ~2","delayMs":1500},{"command":"/summon superbwarfare:mortar_shell ~-3 ~40 ~3","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~3 ~50 ~-3","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~2 ~60 ~2","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~2 ~70 ~-2","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~1 ~80 ~1","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~1 ~90 ~-1","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~-1 ~100 ~1","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~2 ~110 ~2","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~2 ~120 ~-2","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~-3 ~130 ~3","delayMs":0},{"command":"/summon superbwarfare:mortar_shell ~3 ~140 ~3","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-34', 'Правило 34 · 301 монета', '', 301, '/summon spore:sieger ~ ~ ~ {Attributes:[{Name:"minecraft:generic.max_health",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:sieger ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-35', 'Правило 35 · 333 монеты', '', 333, '/summon spore:hindenburg ~ ~10 ~ {Attributes:[{Name:"minecraft:generic.max_health",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:hindenburg ~ ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":1500},{"command":"/summon spore:hindenburg ~ ~12 ~5 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hindenburg ~5 ~14 ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hindenburg ~2 ~10 ~4 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hindenburg ~-2 ~10 ~-5 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hindenburg ~-2 ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-36', 'Правило 36 · 366 монет', '', 366, '/champions summon minecraft:wither 4',
   '[{"command":"/champions summon minecraft:wither 4","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-37', 'Правило 37 · 377 монет', '', 377, '/summon minecraft:warden',
   '[{"command":"/summon minecraft:warden","delayMs":1500},{"command":"/summon minecraft:warden ~ ~ ~5","delayMs":0},{"command":"/summon minecraft:warden ~-5 ~ ~","delayMs":0},{"command":"/summon minecraft:warden ~2 ~ ~","delayMs":0},{"command":"/summon minecraft:warden ~ ~ ~-2","delayMs":0},{"command":"/summon minecraft:warden ~1 ~ ~-1","delayMs":0},{"command":"/summon minecraft:warden ~ ~ ~3","delayMs":0},{"command":"/summon minecraft:warden ~3 ~ ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-38', 'Правило 38 · 455 монет', '', 455, '/execute as @a at @s run summon superbwarfare:c4 ~ ~2 ~',
   '[{"command":"/execute as @a at @s run summon superbwarfare:c4 ~ ~2 ~","delayMs":1500},{"command":"/execute as @a at @s run summon superbwarfare:c4 ~2 ~5 ~","delayMs":0},{"command":"/execute as @a at @s run summon superbwarfare:c4 ~ ~6 ~1","delayMs":0},{"command":"/execute as @a at @s run summon superbwarfare:c4 ~3 ~2 ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-39', 'Правило 39 · 466 монет', '', 466, '/clear @a',
   '[{"command":"/clear @a","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-40', 'Правило 40 · 467 монет', '', 467, '/tp @a ~ -500 ~',
   '[{"command":"/tp @a ~ -500 ~","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-41', 'Правило 41 · 799 монет', '', 799, '/playsound minecraft:rocket master @a',
   '[{"command":"/playsound minecraft:rocket master @a","delayMs":1500},{"command":"/summon superbwarfare:mk_82 ~ ~50 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~50 ~60 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~80 ~80 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~ ~90 ~-5","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~ ~100 ~-10","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~5 ~110 ~-5","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~-5 ~120 ~5","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~5 ~130 ~10","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~5 ~140 ~-10","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-42', 'Правило 42 · 335 монет', '', 335, '/summon spore:howitzer ~ ~ ~ {Attributes:[{Name:"minecraft:generic.max_health",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:howitzer ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-43', 'Правило 43 · 48 монет', '', 48, '/give @a mekanism:jetpack_armored{mekData:{GasTanks:[{Tank:0b,stored:{gasName:"mekanism:hydrogen",amount:24000L}}]}} 1',
   '[{"command":"/give @a mekanism:jetpack_armored{mekData:{GasTanks:[{Tank:0b,stored:{gasName:\"mekanism:hydrogen\",amount:24000L}}]}} 1","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-44', 'Правило 44 · 76 монет', '', 76, '/give @a superbwarfare:mk_14',
   '[{"command":"/give @a superbwarfare:mk_14","delayMs":1500},{"command":"/give @a superbwarfare:rifle_ammo_box 20","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-45', 'Правило 45 · 100001 монета', '', 100001, '/say hello',
   '[{"command":"/say hello","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-46', 'Правило 46 · 121 монета', '', 121, '/give @a superbwarfare:minigun',
   '[{"command":"/give @a superbwarfare:minigun","delayMs":1500},{"command":"/give @a superbwarfare:rifle_ammo_box 40","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-47', 'Правило 47 · 73 монеты', '', 73, '/give @a superbwarfare:svd',
   '[{"command":"/give @a superbwarfare:svd","delayMs":1500},{"command":"/give @a superbwarfare:sniper_ammo_box 20","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-48', 'Правило 48 · 69 монет', '', 69, '/give Bebrok spore:lab_block 256',
   '[{"command":"/give Bebrok spore:lab_block 256","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-49', 'Правило 49 · 68 монет', '', 68, '/give Bebrok minecraft:obsidian 256',
   '[{"command":"/give Bebrok minecraft:obsidian 256","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-50', 'Правило 50 · 111 монет', '', 111, '/execute at Bebrok at @a run summon minecraft:lightning_bolt',
   '[{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000},{"command":"/execute at Bebrok at @a run summon minecraft:lightning_bolt","delayMs":1000}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-51', 'Правило 51 · 77 монет', '', 77, '/tp @a ~ 3000 ~',
   '[{"command":"/tp @a ~ 3000 ~","delayMs":1500},{"command":"/give @a minecraft:water_bucket","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-52', 'Правило 52 · 122 монеты', '', 122, '/setblock ~ ~ ~ minecraft:end_portal',
   '[{"command":"/setblock ~ ~ ~ minecraft:end_portal","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-53', 'Правило 53 · 261 монета', '', 261, '/fill ~-1 ~-1 ~-1 ~1 ~1 ~1 minecraft:lava',
   '[{"command":"/fill ~-1 ~-1 ~-1 ~1 ~1 ~1 minecraft:lava","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-54', 'Правило 54 · 154 монеты', '', 154, '/give Bebrok mekanism:basic_smelting_factory',
   '[{"command":"/give Bebrok mekanism:basic_smelting_factory","delayMs":1500},{"command":"/give Bebrok mekanism:basic_enriching_factory","delayMs":0},{"command":"/give Bebrok mekanism:basic_crushing_factory","delayMs":0},{"command":"/give Bebrok mekanism:basic_infusing_factory","delayMs":0},{"command":"/give Bebrok mekanismgenerators:wind_generator 4","delayMs":0},{"command":"/give Bebrok mekanism:basic_universal_cable 64","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-55', 'Правило 55 · 96 монет', '', 96, '/give Bebrok mekanismgenerators:wind_generator 4',
   '[{"command":"/give Bebrok mekanismgenerators:wind_generator 4","delayMs":1500},{"command":"/give Bebrok mekanism:basic_universal_cable 64","delayMs":0},{"command":"/give Bebrok mekanism:digital_miner","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-56', 'Правило 56 · 142 монеты', '', 142, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:yx_100"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:yx_100\"}} 1","delayMs":1500},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0},{"command":"/give Bebrok superbwarfare:large_battery_pack{Energy:20000000} 1","delayMs":0},{"command":"/give Bebrok superbwarfare:large_shell_ap 100","delayMs":0},{"command":"/give Bebrok superbwarfare:heavy_ammo 400","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-57', 'Правило 57 · 72 монеты', '', 72, '/give Bebrok superbwarfare:drone 4',
   '[{"command":"/give Bebrok superbwarfare:drone 4","delayMs":1500},{"command":"/give Bebrok superbwarfare:monitor 4","delayMs":0},{"command":"/give Bebrok superbwarfare:rgo_grenade 64","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-58', 'Правило 58 · 64 монеты', '', 64, '/tp Bebrok ~ -55 ~',
   '[{"command":"/tp Bebrok ~ -55 ~","delayMs":1500},{"command":"/fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:air","delayMs":1500},{"command":"/tp @a Bebrok","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-59', 'Правило 59 · 362 монеты', '', 362, '/tp @e Bebrok',
   '[{"command":"/tp @e Bebrok","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-60', 'Правило 60 · 55 монет', '', 55, '/give Bebrok integrated_lucky_blocks:lucky_block 5',
   '[{"command":"/give Bebrok integrated_lucky_blocks:lucky_block 5","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-61', 'Правило 61 · 500 монет', '', 500, '/give Bebrok integrated_lucky_blocks:lucky_block 50',
   '[{"command":"/give Bebrok integrated_lucky_blocks:lucky_block 50","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-62', 'Правило 62 · 305 монет', '', 305, '/tp Bebrok ~ -50 ~',
   '[{"command":"/tp Bebrok ~ -50 ~","delayMs":1500},{"command":"/fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:air","delayMs":1000},{"command":"/summon spore:proto","delayMs":1000},{"command":"/tp Bebrok ~ 100 ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-63', 'Правило 63 · 125 монет', '', 125, '/give Bebrok refinedstorage:creative_controller',
   '[{"command":"/give Bebrok refinedstorage:creative_controller","delayMs":1500},{"command":"/give Bebrok refinedstorage:disk_drive","delayMs":0},{"command":"/give Bebrok refinedstorage:crafting_grid","delayMs":0},{"command":"/give Bebrok refinedstorage:64k_storage_disk","delayMs":0},{"command":"/give Bebrok refinedstorage:64k_storage_disk","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-64', 'Правило 64 · 456 монет', '', 456, '/playsound minecraft:huilo master @a',
   '[{"command":"/playsound minecraft:huilo master @a","delayMs":0},{"command":"/execute at @a run summon superbwarfare:melon_bomb","delayMs":8000}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-65', 'Правило 65 · 35 монет', '', 35, '/give @a superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:tom_6",Entity:{id:"superbwarfare:tom_6",Energy:100000}}} 1',
   '[{"command":"/give @a superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:tom_6\",Entity:{id:\"superbwarfare:tom_6\",Energy:100000}}} 1","delayMs":1000},{"command":"/give @a superbwarfare:crowbar","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-66', 'Правило 66 · 2222 монеты', '', 2222, '/execute at @a run summon superbwarfare:mk_82 ~ ~50 ~',
   '[{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~50 ~","delayMs":1500},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~60 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~10 ~80 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~90 ~-5","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~100 ~-10","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~110 ~-5","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~-5 ~120 ~5","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~130 ~10","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~140 ~-10","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-67', 'Правило 67 · 3333 монеты', '', 3333, '/playsound minecraft:indus master @a',
   '[{"command":"/playsound minecraft:indus master @a","delayMs":0},{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~50 ~","delayMs":5000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~60 ~","delayMs":7000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~10 ~80 ~","delayMs":4000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~90 ~-5","delayMs":12000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~ ~100 ~-10","delayMs":5000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~110 ~-5","delayMs":6000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~-5 ~120 ~5","delayMs":2000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~130 ~10","delayMs":5000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~140 ~-10","delayMs":5000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~140 ~-10","delayMs":5000},{"command":"/execute at @a run summon superbwarfare:mk_82 ~5 ~140 ~-10","delayMs":5000}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-68', 'Правило 68 · 124 монеты', '', 124, '/give @a superbwarfare:bocek',
   '[{"command":"/give @a superbwarfare:bocek","delayMs":0},{"command":"/give @a minecraft:arrow 512","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-69', 'Правило 69 · 91 монета', '', 91, '/give @a superbwarfare:devotion',
   '[{"command":"/give @a superbwarfare:devotion","delayMs":0},{"command":"/give @a superbwarfare:rifle_ammo_box 40","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-70', 'Правило 70 · 49 монет', '', 49, '/give @a superbwarfare:trachelium',
   '[{"command":"/give @a superbwarfare:trachelium","delayMs":0},{"command":"/give @a superbwarfare:rifle_ammo_box 15","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-71', 'Правило 71 · 88 монет', '', 88, '/execute at Bebrok at @r run summon superbwarfare:mortar_shell ~ ~5 ~',
   '[{"command":"/execute at Bebrok at @r run summon superbwarfare:mortar_shell ~ ~5 ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-72', 'Правило 72 · 199 монет', '', 199, '/execute at Bebrok at @r run summon superbwarfare:melon_bomb ~ ~5 ~',
   '[{"command":"/execute at Bebrok at @r run summon superbwarfare:melon_bomb ~ ~5 ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-73', 'Правило 73 · 45 монет', '', 45, '/execute at Bebrok at @r run effect give @r minecraft:poison infinite',
   '[{"command":"/execute at Bebrok at @r run effect give @r minecraft:poison infinite","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-74', 'Правило 74 · 175 монет', '', 175, '/execute at Bebrok at @r run effect give @a minecraft:poison infinite',
   '[{"command":"/execute at Bebrok at @r run effect give @a minecraft:poison infinite","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-75', 'Правило 75 · 36 монет', '', 36, '/execute at Bebrok at @a run summon superbwarfare:smoke_decoy ~ ~ ~',
   '[{"command":"/execute at Bebrok at @a run summon superbwarfare:smoke_decoy ~ ~ ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-76', 'Правило 76 · 355 монет', '', 355, '/summon spore:stalker ~1 ~ ~2 {Attributes:[{Name:"minecraft:generic.max_health",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:stalker ~1 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:busser ~ ~ ~1 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:busser ~-2 ~ ~3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:gastgaber ~1 ~ ~4 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hevoker ~-2 ~ ~-3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hvindicator ~4 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:stalker ~3 ~ ~-2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:stalker ~-3 ~ ~-2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-77', 'Правило 77 · 999 монет', '', 999, '/execute at Bebrok at @a run summon spore:stalker ~1 ~ ~2 {Attributes:[{Name:"minecraft:generic.max_health",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/execute at Bebrok at @a run summon spore:stalker ~1 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:busser ~ ~ ~1 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:busser ~-2 ~ ~3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:gastgaber ~1 ~ ~4 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:hevoker ~-2 ~ ~-3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:hvindicator ~4 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:stalker ~3 ~ ~-2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at Bebrok at @a run summon spore:stalker ~-3 ~ ~-2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:250.0}],Health:250.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-78', 'Правило 78 · 399 монет', '', 399, '/summon spore:hohlfresser ~1 ~ ~2 {Attributes:[{Name:"minecraft:generic.max_health",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:hohlfresser ~1 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-79', 'Правило 79 · 444 монеты', '', 444, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:waveforce_tower"}} 6',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:waveforce_tower\"}} 6","delayMs":0},{"command":"/give Bebrok superbwarfare:creative_charging_station 6","delayMs":0},{"command":"/give Bebrok superbwarfare:crowbar","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-80', 'Правило 80 · 388 монет', '', 388, '/tp Bebrok ~ -50 ~',
   '[{"command":"/tp Bebrok ~ -50 ~","delayMs":0},{"command":"/fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:lava","delayMs":0},{"command":"/tp @a Bebrok","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-81', 'Правило 81 · 1222 монеты', '', 1222, '/summon spore:hohlfresser ~1 ~ ~2 {Attributes:[{Name:"minecraft:generic.max_health",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:hohlfresser ~1 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:howitzer ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:hindenburg ~ ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:sieger ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:kraken ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:gazenbreacher ~ ~ ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-82', 'Правило 82 · 100000 монет', '', 100000, '/say hello',
   '[{"command":"/say hello","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-83', 'Правило 83 · 23 монеты', '', 23, '/give @a zombiekit:chainsaw',
   '[{"command":"/give @a zombiekit:chainsaw","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-84', 'Правило 84 · 888 монет', '', 888, '/execute at Bebrok run fill ~-5 ~-3 ~-5 ~5 ~3 ~5 minecraft:obsidian hollow',
   '[{"command":"/execute at Bebrok run fill ~-5 ~-3 ~-5 ~5 ~3 ~5 minecraft:obsidian hollow","delayMs":0},{"command":"/playsound minecraft:gugugaga master @a","delayMs":0},{"command":"/tp @a Bebrok","delayMs":0},{"command":"/execute at @a run summon minecraft:creeper","delayMs":4000},{"command":"/execute at @a run summon minecraft:creeper","delayMs":4000},{"command":"/execute at @a run summon minecraft:creeper","delayMs":4000},{"command":"/execute at @a run summon minecraft:creeper","delayMs":4000},{"command":"/execute at @a run summon minecraft:creeper","delayMs":4000}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-85', 'Правило 85 · 37 монет', '', 37, '/give @a spore:frozen_tumor 16',
   '[{"command":"/give @a spore:frozen_tumor 16","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-86', 'Правило 86 · 36 монет', '', 36, '/give @a spore:stuffed_abomination 12',
   '[{"command":"/give @a spore:stuffed_abomination 12","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-87', 'Правило 87 · 433 монеты', '', 433, '/playsound minecraft:bambo master @a',
   '[{"command":"/playsound minecraft:bambo master @a","delayMs":0},{"command":"/execute at @a run summon tnt ~ ~70 ~ {Fuse:75,ExplosionPower:6}","delayMs":0},{"command":"/execute at @a run summon tnt ~ ~60 ~ {Fuse:75,ExplosionPower:6}","delayMs":4000},{"command":"/execute at @a run summon tnt ~ ~70 ~ {Fuse:75,ExplosionPower:6}","delayMs":4000},{"command":"/execute at @a run summon tnt ~ ~50 ~ {Fuse:75,ExplosionPower:6}","delayMs":4000},{"command":"/execute at @a run summon tnt ~ ~30 ~ {Fuse:75,ExplosionPower:6}","delayMs":4000}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-88', 'Правило 88 · 5555 монет', '', 5555, '/playsound minecraft:jiest master @a',
   '[{"command":"/playsound minecraft:jiest master @a","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~128 ~","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~3 ~124 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~125 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~127 ~","delayMs":0},{"command":"/execute at @a run summon minecraft:lightning_bolt","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~4 ~100 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~2 ~100 ~","delayMs":0},{"command":"/execute at @a run summon minecraft:lightning_bolt","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~7 ~100 ~","delayMs":0},{"command":"/execute at @a run fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:lava","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~2 ~100 ~","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~ ~105 ~1","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~4 ~110 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~ ~115 ~2","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/execute at @a run summon spore:hohlfresser ~1 ~30 ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":5000},{"command":"/execute at @a run summon spore:howitzer ~ ~35 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:hindenburg ~40 ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:sieger ~ ~45 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:kraken ~ ~60 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:gazenbreacher ~ ~65 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:lava","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:a_10a ~ ~10 ~","delayMs":4000},{"command":"/execute at @a run summon superbwarfare:a_10a ~ ~11 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:a_10a ~ ~12 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:a_10a ~ ~13 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:a_10a ~ ~14 ~","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":5000},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/execute at @a run summon spore:hohlfresser ~1 ~30 ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":3000},{"command":"/execute at @a run summon spore:howitzer ~ ~35 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:hindenburg ~40 ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:lava","delayMs":4000},{"command":"/execute at @a run fill ~-1 ~-1 ~-1 ~2 ~2 ~2 minecraft:tnt","delayMs":4000},{"command":"/summon superbwarfare:mk_82 ~3 ~121 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~122 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~123 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~124 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~125 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~126 ~","delayMs":0},{"command":"/execute at @a run summon spore:hohlfresser ~1 ~30 ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":5000},{"command":"/execute at @a run summon spore:howitzer ~ ~35 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:hindenburg ~40 ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:hohlfresser ~1 ~30 ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:800.0}],Health:800.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:howitzer ~ ~35 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/execute at @a run summon spore:hindenburg ~40 ~10 ~ {Attributes:[{Name:\"minecraft:generic.max_health\",Base:2000.0}],Health:2000.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~2 ~100 ~","delayMs":3000},{"command":"/summon superbwarfare:mk_82 ~ ~105 ~1","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~4 ~110 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~ ~115 ~2","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~120 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~541 ~","delayMs":3000},{"command":"/summon superbwarfare:mk_82 ~3 ~531 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~511 ~","delayMs":0},{"command":"/summon superbwarfare:mk_82 ~3 ~521 ~","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-89', 'Правило 89 · 123 монеты', '', 123, '/give @a superbwarfare:m_2_hb',
   '[{"command":"/give @a superbwarfare:m_2_hb","delayMs":0},{"command":"/give @a superbwarfare:heavy_ammo 512","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-90', 'Правило 90 · 126 монет', '', 126, '/give @a superbwarfare:rpg',
   '[{"command":"/give @a superbwarfare:rpg","delayMs":0},{"command":"/give @a superbwarfare:rpg_rocket_standard 12","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-91', 'Правило 91 · 127 монет', '', 127, '/give @a superbwarfare:ntw_20',
   '[{"command":"/give @a superbwarfare:ntw_20","delayMs":0},{"command":"/give @a superbwarfare:heavy_ammo 128","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-92', 'Правило 92 · 51 монета', '', 51, '/give Bebrok easy_villagers:iron_farm 8',
   '[{"command":"/give Bebrok easy_villagers:iron_farm 8","delayMs":0},{"command":"/give Bebrok easy_villagers:villager 8","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-93', 'Правило 93 · 60 монет', '', 60, '/give Bebrok mekanism:alloy_infused 128',
   '[{"command":"/give Bebrok mekanism:alloy_infused 128","delayMs":0},{"command":"/give Bebrok mekanism:alloy_atomic 20","delayMs":0},{"command":"/give Bebrok mekanism:alloy_reinforced 32","delayMs":0},{"command":"/give Bebrok mekanism:enriched_redstone 32","delayMs":0},{"command":"/give Bebrok mekanism:enriched_carbon 32","delayMs":0},{"command":"/give Bebrok mekanism:enriched_diamond 32","delayMs":0},{"command":"/give Bebrok mekanism:enriched_refined_obsidian 32","delayMs":0},{"command":"/give Bebrok mekanism:upgrade_energy 32","delayMs":0},{"command":"/give Bebrok mekanism:upgrade_speed 32","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-94', 'Правило 94 · 1333 монеты', '', 1333, '/champions summon minecraft:wither 4',
   '[{"command":"/champions summon minecraft:wither 4","delayMs":1500},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0},{"command":"/champions summon minecraft:wither 4","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-95', 'Правило 95 · 777 монет', '', 777, '/summon spore:proto ~2 ~ ~6 {Attributes:[{Name:"minecraft:generic.max_health",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}',
   '[{"command":"/summon spore:proto ~2 ~ ~6 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":1500},{"command":"/summon spore:proto ~-5 ~ ~-3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~4 ~ ~-6 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~-2 ~ ~6 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~-7 ~ ~3 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~-3 ~ ~2 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~5 ~ ~-6 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0},{"command":"/summon spore:proto ~5 ~ ~-6 {Attributes:[{Name:\"minecraft:generic.max_health\",Base:100.0}],Health:100.0f,ActiveEffects:[{Id:11b,Amplifier:1b,Duration:999999,ShowParticles:0b}]}","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-96', 'Правило 96 · 148 монет', '', 148, '/execute at @a run summon superbwarfare:rpg_rocket_standard ~1 ~100 ~',
   '[{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~1 ~100 ~","delayMs":1500},{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~2 ~120 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~3 ~130 ~","delayMs":0},{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~ ~140 ~1","delayMs":0},{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~ ~150 ~2","delayMs":0},{"command":"/execute at @a run summon superbwarfare:rpg_rocket_standard ~ ~160 ~3","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-97', 'Правило 97 · 300 монет', '', 300, '/tp @r ~ 10000000 ~',
   '[{"command":"/tp @r ~ 10000000 ~","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'bad', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-98', 'Правило 98 · 52 монеты', '', 52, '/give @a aquaculture:neptunium_fishing_rod{Enchantments:[{id:"minecraft:lure",lvl:10s},{id:"minecraft:luck_of_the_sea",lvl:10s},{id:"minecraft:unbreaking",lvl:10s},{id:"minecraft:mending",lvl:1s}]} 1',
   '[{"command":"/give @a aquaculture:neptunium_fishing_rod{Enchantments:[{id:\"minecraft:lure\",lvl:10s},{id:\"minecraft:luck_of_the_sea\",lvl:10s},{id:\"minecraft:unbreaking\",lvl:10s},{id:\"minecraft:mending\",lvl:1s}]} 1","delayMs":1500}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
  ('dintegrate-rule-99', 'Правило 99 · 313 монет', '', 313, '/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:"superbwarfare:annihilator"}} 1',
   '[{"command":"/give Bebrok superbwarfare:container{BlockEntityTag:{EntityType:\"superbwarfare:annihilator\"}} 1","delayMs":1500},{"command":"/give Bebrok superbwarfare:creative_charging_station","delayMs":0},{"command":"/give @a superbwarfare:crowbar","delayMs":0}]', 'sequence', 1,
   0, 0, 1, '', 'good', 0,
   1, '2026-05-19T21:59:32.041Z', '2026-05-19T21:59:32.041Z')
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
