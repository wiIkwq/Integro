const CHANNEL_HANDLE = "@bebrok";
const COMMANDS_ROOT_ID = "integro-youtube-commands";
const BALANCE_ROOT_ID = "integro-youtube-balance";
const MESSAGE_TIMEOUT_MS = 14000;
const DEBUG = globalThis.localStorage?.getItem("integro_debug") === "1";

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

function safeCssUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString().replace(/['"\\]/g, "");
  } catch {
    return null;
  }
}

function actionCardStyle(action, index) {
  const parts = [`--reveal-delay: ${index * 35}ms`];
  const bannerUrl = safeCssUrl(action.bannerUrl);
  if (bannerUrl) parts.push(`background-image: url('${safeText(bannerUrl)}')`);
  return ` style="${parts.join("; ")}"`;
}

function iconSvg(name, size = 16) {
  const attrs = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
  if (name === "thumbs-down") {
    return `<svg ${attrs}><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>`;
  }
  if (name === "gamepad") {
    return `<svg ${attrs}><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M6 18v2"/><path d="M18 18v2"/></svg>`;
  }
  if (name === "zap") {
    return `<svg ${attrs}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2A.5.5 0 0 1 14 2.5V10h6a1 1 0 0 1 .78 1.63l-9.9 10.2A.5.5 0 0 1 10 21.5V14Z"/></svg>`;
  }
  if (name === "coins") {
    return `<svg ${attrs}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`;
  }
  return `<svg ${attrs}><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>`;
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
    const directAvatarParent = mastheadEnd.querySelector("#avatar-btn")?.parentElement;
    const before = directAvatarParent?.parentElement === mastheadEnd ? directAvatarParent : null;
    mastheadEnd.insertBefore(root, before);
  }

  return root;
}

function sentimentIcon(action) {
  return action.sentiment === "bad" ? iconSvg("thumbs-down", 16) : iconSvg("thumbs-up", 16);
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

  const streamerOffline = !state.bridge?.connected;
  const body = state.user
    ? `
      ${state.notice ? `<div class="integro-extension-notice">${safeText(state.notice)}</div>` : ""}
      <div class="integro-command-row">
        ${state.loading ? `<div class="integro-inline-state">Загрузка команд...</div>` : ""}
        ${!state.loading && state.actions.length === 0 ? `<div class="integro-inline-state">Команд пока нет</div>` : ""}
        ${state.actions.map((action, index) => {
          const lacksCoins = Number(state.user?.balance || 0) < Number(action.price || 0);
          const isBusy = state.busyId === action.id;
          const disabled = streamerOffline || lacksCoins || isBusy;
          const buttonText = streamerOffline ? "Стример оффлайн" : isBusy ? "Отправляем" : lacksCoins ? "Не хватает монет" : "Запустить";
          return `
            <article class="spotlight-card action-card ${action.bannerUrl ? "has-image" : ""}"${actionCardStyle(action, index)}>
              <span class="effect-mark ${action.sentiment === "bad" ? "bad" : "good"}" title="${action.sentiment === "bad" ? "Негативный эффект" : "Позитивный эффект"}">
                ${sentimentIcon(action)}
              </span>
              ${action.bannerUrl ? "" : `<span class="action-bg-icon">${iconSvg("gamepad", 56)}</span>`}
              <div class="action-body">
                <div class="action-copy">
                  <h3>${safeText(action.title)}</h3>
                </div>
                <div class="action-footer">
                  <button class="shiny-button primary-action action-run" data-integro-action="buy" data-id="${safeText(action.id)}" ${disabled ? "disabled" : ""} type="button">
                    ${iconSvg("zap", 17)}
                    ${safeText(buttonText)}
                  </button>
                  <div class="price-inline">
                    <span class="price-current">
                      ${iconSvg("coins", 14)}
                      <strong>${safeText(money(action.price))}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `
    : `
      <div class="integro-login-strip">
        <div>
          <strong>Integro команды</strong>
          <span>Войди, чтобы видеть баланс и запускать команды прямо на стриме.</span>
        </div>
        ${state.notice ? `<p>${safeText(state.notice)}</p>` : ""}
        <button class="shiny-button primary-action" data-integro-action="login" type="button">
          ${iconSvg("zap", 17)}
          Войти
        </button>
      </div>
    `;

  mount.innerHTML = body;
  try {
    renderBalance();
  } catch (error) {
    log("warn", "Balance render failed", { error: error.message });
  }
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
  const commandsMissing = !document.getElementById(COMMANDS_ROOT_ID);
  const balanceMissing = !document.getElementById(BALANCE_ROOT_ID);
  if (changed) log("log", "Page eligibility changed", { eligible, url: location.href, channel: channelHandle() });
  state.eligible = eligible;
  state.lastUrl = location.href;

  if (!eligible) {
    removeInjectedUi();
    return;
  }

  if (changed || commandsMissing) {
    await syncSession();
    await refreshData();
    return;
  }

  if (balanceMissing) {
    renderBalance();
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

document.addEventListener("pointermove", (event) => {
  const card = event.target instanceof Element ? event.target.closest(".spotlight-card") : null;
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
  card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
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
