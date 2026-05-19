import { readFile, writeFile } from "node:fs/promises";
import { TextDecoder } from "node:util";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "seed/dintegrate-actions.sql";

if (!inputPath) {
  console.error("Usage: node scripts/import-dintegrate-config.mjs <dintegrate.cfg> [output.sql]");
  process.exit(1);
}

const bytes = await readFile(inputPath);
const text = new TextDecoder("windows-1251").decode(bytes);
const rules = parseRules(text);

if (rules.length === 0) {
  console.error("No dintegrate rules found");
  process.exit(1);
}

const now = new Date().toISOString();
const sql = [
  "-- Generated from dintegrate.cfg. DonatePay credentials are intentionally not imported.",
  ...rules.map((rule) => actionSql(rule, now)),
  ""
].join("\n");

await writeFile(new URL(`../${outputPath}`, import.meta.url), sql, "utf8");

const commandsCount = rules.reduce((sum, rule) => sum + rule.steps.length, 0);
const delayedCount = rules.reduce((sum, rule) => sum + rule.steps.filter((step) => step.delayMs > 0).length, 0);
console.log(`Generated ${rules.length} actions, ${commandsCount} commands, ${delayedCount} delayed steps -> apps/api/${outputPath}`);

function parseRules(source) {
  const records = new Map();
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^rule_(\d+)\.([A-Za-z0-9_]+)=(.*)$/.exec(trimmed);
    if (!match) continue;

    const [, idText, key, value] = match;
    const index = Number(idText);
    const record = records.get(index) || { index, commands: new Map() };
    if (/^cmd\d+$/.test(key)) {
      record.commands.set(Number(key.slice(3)), value.trim());
    } else {
      record[key] = value.trim();
    }
    records.set(index, record);
  }

  return [...records.values()]
    .sort((left, right) => left.index - right.index)
    .map((record) => normalizeRule(record))
    .filter(Boolean);
}

function normalizeRule(record) {
  const price = Math.max(1, Number.parseInt(record.amount || "0", 10));
  const commandRows = [...record.commands.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, command]) => command)
    .filter(Boolean);

  let pendingDelayMs = secondsToMs(record.startdelay || 0);
  const steps = [];

  for (const command of commandRows) {
    const delay = parseDelayCommand(command);
    if (delay !== null) {
      pendingDelayMs += delay;
      continue;
    }
    if (isDonationNotice(command)) {
      continue;
    }
    steps.push({
      command: command.slice(0, 1000),
      delayMs: Math.max(0, Math.min(600000, pendingDelayMs))
    });
    pendingDelayMs = 0;
  }

  if (steps.length === 0) return null;

  const mode = String(record.mode || "all").toLowerCase() === "random" ? "random" : "sequence";
  return {
    id: `dintegrate-rule-${record.index}`,
    title: `Правило ${record.index} · ${price} ${coinWord(price)}`,
    price,
    command: steps[0].command,
    steps,
    mode,
    randomCount: mode === "random" ? 1 : 1,
    sentiment: inferSentiment(steps.map((step) => step.command))
  };
}

function parseDelayCommand(command) {
  const match = /^delay\s+([\d.,]+)$/i.exec(command.trim());
  if (!match) return null;
  return secondsToMs(match[1]);
}

function isDonationNotice(command) {
  const normalized = command.trim().toLowerCase();
  return normalized.startsWith("say ") && (normalized.includes("{name}") || normalized.includes("{sum}"));
}

function secondsToMs(value) {
  const seconds = Number.parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.round(seconds * 1000);
}

function inferSentiment(commands) {
  const payload = commands
    .map((command) => command.toLowerCase())
    .filter((command) => !command.startsWith("say "));
  if (payload.length === 0) return "good";

  const badPatterns = [
    "/kill",
    "/clear",
    "/tp @a",
    "/tp @r",
    " minecraft:lava",
    " minecraft:tnt",
    " summon tnt",
    "summon minecraft:creeper",
    "summon minecraft:warden",
    "champions summon",
    "lightning_bolt",
    "superbwarfare:c4",
    "mortar_shell",
    "superbwarfare:mk_82",
    "spore:"
  ];
  if (payload.some((command) => badPatterns.some((pattern) => command.includes(pattern)))) {
    return "bad";
  }
  if (payload.every((command) => command.startsWith("/give ") || command.startsWith("/playsound "))) {
    return "good";
  }
  return "bad";
}

function coinWord(value) {
  const number = Math.abs(Number(value) || 0);
  const lastTwo = number % 100;
  const last = number % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "монет";
  if (last === 1) return "монета";
  if (last >= 2 && last <= 4) return "монеты";
  return "монет";
}

function actionSql(rule, now) {
  return `INSERT INTO minecraft_actions
  (id, title, description, price, command, command_plan, command_mode, repeat_count,
   repeat_delay_ms, step_delay_ms, random_count, banner_url, sentiment, cooldown_seconds,
   is_enabled, created_at, updated_at)
VALUES
  (${sqlString(rule.id)}, ${sqlString(rule.title)}, '', ${rule.price}, ${sqlString(rule.command)},
   ${sqlString(JSON.stringify(rule.steps))}, ${sqlString(rule.mode)}, 1,
   0, 0, ${rule.randomCount}, '', ${sqlString(rule.sentiment)}, 0,
   1, ${sqlString(now)}, ${sqlString(now)})
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
  updated_at = excluded.updated_at;`;
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}
