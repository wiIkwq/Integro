import { readFile, writeFile } from "node:fs/promises";
import { TextDecoder } from "node:util";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "seed/dintegrate-actions.sql";

if (!inputPath) {
  console.error("Usage: node scripts/import-dintegrate-config.mjs <dintegrate.cfg> [output.sql]");
  process.exit(1);
}

async function main() {
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
}

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

  const id = `dintegrate-rule-${record.index}`;
  const override = ACTION_OVERRIDES[id] || {};
  const mode = String(record.mode || "all").toLowerCase() === "random" ? "random" : "sequence";
  return {
    id,
    title: override.title || `Правило ${record.index} · ${price} ${coinWord(price)}`,
    price,
    command: steps[0].command,
    steps,
    mode,
    randomCount: mode === "random" ? 1 : 1,
    sentiment: override.sentiment || inferSentiment(steps.map((step) => step.command))
  };
}

const ACTION_OVERRIDES = {
  "dintegrate-rule-2": { title: "Золотые яблоки", sentiment: "good" },
  "dintegrate-rule-3": { title: "Деликатесы", sentiment: "good" },
  "dintegrate-rule-4": { title: "Золотая морковь", sentiment: "good" },
  "dintegrate-rule-5": { title: "Тотем бессмертия", sentiment: "good" },
  "dintegrate-rule-6": { title: "Топовый молот", sentiment: "good" },
  "dintegrate-rule-7": { title: "Ударная ручная мина", sentiment: "good" },
  "dintegrate-rule-8": { title: "Набор ресурсов", sentiment: "good" },
  "dintegrate-rule-9": { title: "Пистолет Glock", sentiment: "good" },
  "dintegrate-rule-10": { title: "Набор незеритовых инструментов", sentiment: "good" },
  "dintegrate-rule-11": { title: "Механизм против паразитов (КДУ)", sentiment: "good" },
  "dintegrate-rule-12": { title: "Лазерная туррель", sentiment: "good" },
  "dintegrate-rule-13": { title: "Снайперская винтовка AWM", sentiment: "good" },
  "dintegrate-rule-14": { title: "Автомат АК-47", sentiment: "good" },
  "dintegrate-rule-15": { title: "Топовая броня", sentiment: "good" },
  "dintegrate-rule-16": { title: "Набор брони из паразитов", sentiment: "good" },
  "dintegrate-rule-17": { title: "Мега туррель", sentiment: "good" },
  "dintegrate-rule-18": { title: "БМП-2", sentiment: "good" },
  "dintegrate-rule-19": { title: "Вертолет Mi-28", sentiment: "good" },
  "dintegrate-rule-20": { title: "Очистить мир от паразитов", sentiment: "good" },
  "dintegrate-rule-21": { title: "Орда зомби", sentiment: "bad" },
  "dintegrate-rule-22": { title: "Зараженные люди", sentiment: "bad" },
  "dintegrate-rule-23": { title: "Крипер", sentiment: "bad" },
  "dintegrate-rule-24": { title: "Мимики с артефактами", sentiment: "bad" },
  "dintegrate-rule-25": { title: "Пачка паразитов", sentiment: "bad" },
  "dintegrate-rule-26": { title: "Фауресы", sentiment: "bad" },
  "dintegrate-rule-27": { title: "Пачка сильных паразитов", sentiment: "bad" },
  "dintegrate-rule-28": { title: "Зомби боссы", sentiment: "bad" },
  "dintegrate-rule-29": { title: "Споры с паразитами", sentiment: "bad" },
  "dintegrate-rule-30": { title: "Орда невидимых криперов", sentiment: "bad" },
  "dintegrate-rule-31": { title: "Убить всех", sentiment: "bad" },
  "dintegrate-rule-32": { title: "C4 над моей головой", sentiment: "bad" },
  "dintegrate-rule-33": { title: "Минометный обстрел", sentiment: "bad" },
  "dintegrate-rule-34": { title: "Супер босс паразитов", sentiment: "bad" },
  "dintegrate-rule-35": { title: "Куча паразитов дирижаблей", sentiment: "bad" },
  "dintegrate-rule-36": { title: "Визер босс (очень сильный)", sentiment: "bad" },
  "dintegrate-rule-37": { title: "Призвать орду варденов", sentiment: "bad" },
  "dintegrate-rule-38": { title: "C4 над головой у всех", sentiment: "bad" },
  "dintegrate-rule-39": { title: "Очистить инвентари", sentiment: "bad" },
  "dintegrate-rule-40": { title: "Телепортация под бедрок", sentiment: "bad" },
  "dintegrate-rule-41": { title: "Авиабомбы", sentiment: "bad" },
  "dintegrate-rule-42": { title: "Минометный босс паразитов", sentiment: "bad" },
  "dintegrate-rule-43": { title: "Реактивный ранец", sentiment: "good" },
  "dintegrate-rule-44": { title: "Винтовка МК14", sentiment: "good" },
  "dintegrate-rule-46": { title: "Миниган", sentiment: "good" },
  "dintegrate-rule-47": { title: "СВД", sentiment: "good" },
  "dintegrate-rule-48": { title: "Лабораторные блоки", sentiment: "good" },
  "dintegrate-rule-49": { title: "Обсидиан", sentiment: "good" },
  "dintegrate-rule-50": { title: "Ударить молнией всех", sentiment: "bad" },
  "dintegrate-rule-51": { title: "Ватердроп", sentiment: "bad" },
  "dintegrate-rule-52": { title: "ТП в край", sentiment: "bad" },
  "dintegrate-rule-53": { title: "Коробка из лавы", sentiment: "bad" },
  "dintegrate-rule-54": { title: "Набор механизмов", sentiment: "good" },
  "dintegrate-rule-55": { title: "Цифровой шахтер", sentiment: "good" },
  "dintegrate-rule-56": { title: "Танк YX100", sentiment: "good" },
  "dintegrate-rule-57": { title: "Дроны с гранатами", sentiment: "good" },
  "dintegrate-rule-58": { title: "Телепортировать всех в шахту", sentiment: "bad" },
  "dintegrate-rule-59": { title: "Телепортировать все с карты ко мне", sentiment: "bad" },
  "dintegrate-rule-60": { title: "Лудокейсы", sentiment: "good" },
  "dintegrate-rule-61": { title: "100 лудокейсов", sentiment: "good" },
  "dintegrate-rule-62": { title: "Прото разум", sentiment: "bad" },
  "dintegrate-rule-63": { title: "МЕ система", sentiment: "good" },
  "dintegrate-rule-64": { title: "Арбузные бомбы у всех", sentiment: "bad" },
  "dintegrate-rule-65": { title: "Летающая тележка", sentiment: "good" },
  "dintegrate-rule-66": { title: "Мега ракеты на всех", sentiment: "bad" },
  "dintegrate-rule-67": { title: "Уничтожение карты ракетами", sentiment: "bad" },
  "dintegrate-rule-68": { title: "Нано лук \"Боцек\"", sentiment: "good" },
  "dintegrate-rule-69": { title: "Пулемет \"Преданность\"", sentiment: "good" },
  "dintegrate-rule-70": { title: "Револьвер \"Трахелиум\"", sentiment: "good" },
  "dintegrate-rule-71": { title: "Снаряд миномета в случайного игрока", sentiment: "bad" },
  "dintegrate-rule-73": { title: "Отравить случайного игрока", sentiment: "bad" },
  "dintegrate-rule-74": { title: "Отравить всех игроков", sentiment: "bad" },
  "dintegrate-rule-75": { title: "Задымить всех игроков", sentiment: "bad" },
  "dintegrate-rule-76": { title: "Орда супер сильных паразитов", sentiment: "bad" },
  "dintegrate-rule-77": { title: "Супер сильные паразиты на всех", sentiment: "bad" },
  "dintegrate-rule-78": { title: "Босс паразитов червяк", sentiment: "bad" },
  "dintegrate-rule-79": { title: "Набор топ туррелей", sentiment: "good" },
  "dintegrate-rule-80": { title: "ТП всех в лаву под землю", sentiment: "bad" },
  "dintegrate-rule-81": { title: "Все паразитические боссы (усиленные)", sentiment: "bad" },
  "dintegrate-rule-84": { title: "ТП в шизокоробку с криперами", sentiment: "bad" },
  "dintegrate-rule-85": { title: "Гранаты против паразитов", sentiment: "good" },
  "dintegrate-rule-86": { title: "Фаршированная гадость", sentiment: "good" },
  "dintegrate-rule-87": { title: "Бомбежка всех динамитом", sentiment: "bad" },
  "dintegrate-rule-88": { title: "Жесткий разнос игроков, карты и всех остальных", sentiment: "bad" },
  "dintegrate-rule-89": { title: "Пулемет M2HB", sentiment: "good" },
  "dintegrate-rule-90": { title: "РПГ-7", sentiment: "good" },
  "dintegrate-rule-91": { title: "Тяжелая снайперская винтовка NTW-20", sentiment: "good" },
  "dintegrate-rule-92": { title: "Автоматические фермы железа", sentiment: "good" },
  "dintegrate-rule-93": { title: "Набор для помощи механизаторам", sentiment: "good" },
  "dintegrate-rule-94": { title: "4-звездочные боссы визеры", sentiment: "bad" },
  "dintegrate-rule-95": { title: "Орда усиленных прото разумов (маяки)", sentiment: "bad" },
  "dintegrate-rule-96": { title: "Обстрел РПГ ракетами всех", sentiment: "bad" },
  "dintegrate-rule-98": { title: "Удочка Нептуна", sentiment: "good" },
  "dintegrate-rule-99": { title: "Мега установка против паразитов", sentiment: "good" }
};

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

await main();
