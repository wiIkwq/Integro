const CHANNEL_HANDLE = "@bebrok";
const COMMANDS_ROOT_ID = "integro-youtube-commands";
const BALANCE_ROOT_ID = "integro-youtube-balance";
const MESSAGE_TIMEOUT_MS = 14000;
const DEBUG = true;

const state = {
  eligible: false,
  user: null,
  actions: [],
  bridge: { connected: false },
  loading: false,
  busyId: "",
  notice: "",
  lastUrl: "",
  refreshId: 0
};

function log(level, message, data) {
  if (!DEBUG) return;
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[method](`[Integro extension:youtube] ${message}`, data || "");
}

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
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

function coinAmount(value) {
  return `${money(value)} ${coinWord(value)}`;
}

function safeText(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function send(message) {
  return new Promise((resolve) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      log("warn", "Message timeout", { type: message?.type });
      resolve({ ok: false, error: "Расширение не ответило вовремя" });
    }, MESSAGE_TIMEOUT_MS);

    log("log", "Send message", { type: message?.type });
    chrome.runtime.sendMessage(message, (response) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        log("error", "Message error", { type: message?.type, error: chrome.runtime.lastError.message });
        resolve({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }
      log("log", "Message response", { type: message?.type, ok: response?.ok });
      resolve(response || { ok: false, error: "Пустой ответ расширения" });
    });
  });
}

function channelHandle() {
  const ownerLink = document.querySelector("ytd-video-owner-renderer a[href^='/@'], ytd-watch-metadata a[href^='/@']");
  if (ownerLink) return ownerLink.getAttribute("href").replace("/", "").toLowerCase();

  const canonical = document.querySelector("link[itemprop='url'], link[rel='canonical']");
  const href = canonical?.getAttribute("href") || "";
  const match = href.match(/\/(@[^/?#]+)/);
  return match ? match[1].toLowerCase() : "";
}

function isLiveStream() {
  const liveMeta = [...document.querySelectorAll("meta[itemprop='isLiveBroadcast']")]
    .some((item) => String(item.getAttribute("content") || "").toLowerCase() === "true");
  if (liveMeta) return true;

  const hasLiveChat = Boolean(document.querySelector("ytd-live-chat-frame"));
  const liveBadge = [...document.querySelectorAll("ytd-badge-supported-renderer, .badge-style-type-live-now, yt-formatted-string")]
    .some((item) => {
      const text = String(item.textContent || "").trim().toLowerCase();
      return text === "live" || text === "live now" || text === "в эфире" || text === "прямой эфир";
    });
  return hasLiveChat && liveBadge;
}

function isEligiblePage() {
  if (!location.hostname.includes("youtube.com")) return false;
  if (location.pathname !== "/watch" && !location.pathname.startsWith("/live/")) return false;
  return channelHandle() === CHANNEL_HANDLE && isLiveStream();
}

function removeInjectedUi() {
  document.getElementById(COMMANDS_ROOT_ID)?.remove();
  document.getElementById(BALANCE_ROOT_ID)?.remove();
}

function commandsMount() {
  const topRow = document.querySelector("ytd-watch-metadata #top-row");
  const metadata = document.querySelector("ytd-watch-metadata");
  if (!topRow || !metadata) return null;

  let root = document.getElementById(COMMANDS_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = COMMANDS_ROOT_ID;
  }

  if (root.parentElement !== metadata || root.previousElementSibling !== topRow) {
    topRow.insertAdjacentElement("afterend", root);
  }

  return root;
}

function balanceMount() {
  const mastheadEnd = document.querySelector("ytd-masthead #end");
  if (!mastheadEnd) return null;

  let root = document.getElementById(BALANCE_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = BALANCE_ROOT_ID;
  }

  if (root.parentElement !== mastheadEnd) {
    const avatar = mastheadEnd.querySelector("#avatar-btn, ytd-topbar-menu-button-renderer:last-child");
    mastheadEnd.insertBefore(root, avatar || mastheadEnd.firstChild);
  }

  return root;
}

function sentimentIcon(action) {
  return action.sentiment === "bad" ? "↓" : "↑";
}

function bridgeText() {
  if (!state.user) return "Вход нужен";
  return state.bridge?.connected ? "Bridge online" : "Стример оффлайн";
}

function renderBalance() {
  const mount = balanceMount();
  if (!mount) return;

  const label = state.user ? coinAmount(state.user.balance || 0) : "Integro";
  mount.innerHTML = `
    <button class="integro-top-balance" data-integro-action="${state.user ? "refresh" : "login"}" title="${state.user ? "Обновить баланс" : "Войти в Integro"}">
      <span class="integro-top-dot"></span>
      <strong>${safeText(label)}</strong>
    </button>
  `;
}

function renderCommands() {
  log("log", "Render commands", {
    eligible: state.eligible,
    hasUser: Boolean(state.user),
    actions: state.actions.length,
    loading: state.loading,
    notice: state.notice
  });
  if (!state.eligible) {
    removeInjectedUi();
    return;
  }

  const mount = commandsMount();
  if (!mount) return;

  const disabled = !state.bridge?.connected;
  const body = state.user
    ? `
      <div class="integro-strip-head">
        <div>
          <strong>Integro</strong>
          <span>${safeText(bridgeText())}</span>
        </div>
        ${state.notice ? `<p>${safeText(state.notice)}</p>` : ""}
      </div>
      <div class="integro-command-row">
        ${state.loading ? `<div class="integro-inline-state">Загрузка команд...</div>` : ""}
        ${!state.loading && state.actions.length === 0 ? `<div class="integro-inline-state">Команд пока нет</div>` : ""}
        ${state.actions.map((action) => `
          <article class="integro-command-card ${action.sentiment === "bad" ? "is-bad" : "is-good"}">
            <span class="integro-command-mark" title="${action.sentiment === "bad" ? "Плохая команда" : "Хорошая команда"}">${sentimentIcon(action)}</span>
            <strong>${safeText(action.title)}</strong>
            <div class="integro-command-footer">
              <button data-integro-action="buy" data-id="${safeText(action.id)}" ${disabled || state.busyId === action.id ? "disabled" : ""}>
                ${state.busyId === action.id ? "..." : "Донат"}
              </button>
              <span>${safeText(coinAmount(action.price))}</span>
            </div>
          </article>
        `).join("")}
      </div>
    `
    : `
      <div class="integro-login-strip">
        <div>
          <strong>Integro команды</strong>
          <span>Войди, чтобы видеть баланс и запускать команды прямо на стриме.</span>
        </div>
        ${state.notice ? `<p>${safeText(state.notice)}</p>` : ""}
        <button data-integro-action="login">Войти</button>
      </div>
    `;

  mount.innerHTML = body;
  renderBalance();
}

async function syncSession() {
  log("log", "Sync session");
  const response = await send({ type: "integro-session" });
  if (response.ok) {
    state.user = response.user || null;
    log("log", "Session synced", { hasUser: Boolean(state.user), user: state.user?.id });
    return;
  }
  state.user = null;
  state.notice = response.error || "Не удалось проверить вход";
  log("warn", "Session failed", { error: state.notice });
}

async function refreshData() {
  if (!state.eligible || !state.user) {
    state.loading = false;
    renderCommands();
    return;
  }

  const refreshId = ++state.refreshId;
  log("log", "Refresh data started", { refreshId });
  state.loading = true;
  renderCommands();

  try {
    const response = await send({ type: "integro-actions" });
    if (refreshId !== state.refreshId) {
      log("warn", "Refresh data ignored because newer request exists", { refreshId, current: state.refreshId });
      return;
    }

    if (response.ok) {
      state.actions = response.data?.actions || [];
      state.bridge = response.data?.bridge || { connected: false };
      state.user = response.data?.user || state.user;
      state.notice = "";
      log("log", "Refresh data ok", { refreshId, actions: state.actions.length, bridge: state.bridge });
    } else {
      if (/auth|войти/i.test(response.error || "")) state.user = null;
      state.notice = response.error || "Не удалось загрузить команды";
      log("warn", "Refresh data failed", { refreshId, error: state.notice });
    }
  } finally {
    if (refreshId === state.refreshId) {
      state.loading = false;
      renderCommands();
    }
  }
}

async function buyAction(id) {
  log("log", "Buy action", { id });
  state.busyId = id;
  state.notice = "";
  renderCommands();

  const response = await send({ type: "integro-purchase", actionId: id });
  if (response.ok) {
    state.notice = "Команда отправлена";
    if (typeof response.data?.balance === "number") {
      state.user = { ...state.user, balance: response.data.balance };
    }
    await refreshData();
  } else {
    state.notice = response.error || "Не удалось отправить команду";
    log("warn", "Buy action failed", { id, error: state.notice });
  }

  state.busyId = "";
  renderCommands();
}

async function checkPage() {
  const eligible = isEligiblePage();
  const changed = state.eligible !== eligible || state.lastUrl !== location.href;
  if (changed) log("log", "Page eligibility changed", { eligible, url: location.href, channel: channelHandle() });
  state.eligible = eligible;
  state.lastUrl = location.href;

  if (!eligible) {
    removeInjectedUi();
    return;
  }

  if (changed || !document.getElementById(COMMANDS_ROOT_ID) || !document.getElementById(BALANCE_ROOT_ID)) {
    await syncSession();
    await refreshData();
  } else {
    renderCommands();
  }
}

function integroClickTarget(event) {
  const node = event.target instanceof Element ? event.target : event.target?.parentElement;
  return node?.closest?.("[data-integro-action]") || null;
}

document.addEventListener("click", async (event) => {
  const target = integroClickTarget(event);
  if (!target) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const action = target.dataset.integroAction;
  if (action === "login") {
    state.notice = "Проверяю вход на сайте";
    renderCommands();
    const response = await send({ type: "integro-start-login" });
    if (response.ok) {
      await syncSession();
      await refreshData();
    } else {
      state.notice = response.error || "Не удалось войти";
      renderCommands();
    }
  }

  if (action === "refresh") {
    await syncSession();
    await refreshData();
  }

  if (action === "buy") {
    await buyAction(target.dataset.id);
  }
}, true);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "integro-auth-ready") {
    syncSession().then(refreshData);
  }
  if (message?.type === "integro-auth-logout") {
    state.user = null;
    state.actions = [];
    state.notice = "Вы вышли";
    renderCommands();
  }
  if (message?.type === "integro-auth-pending") {
    state.notice = "Подтверди вход на сайте";
    renderCommands();
  }
});

let observerTimer = null;
const observer = new MutationObserver(() => {
  window.clearTimeout(observerTimer);
  observerTimer = window.setTimeout(checkPage, 350);
});

checkPage();
window.setInterval(checkPage, 2000);
window.setInterval(refreshData, 15000);
observer.observe(document.documentElement, { childList: true, subtree: true });
