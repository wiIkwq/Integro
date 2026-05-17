const API_BASE = "https://integro.bohdan.lol";
const CHANNEL_HANDLE = "@bebrok";
const ROOT_ID = "integro-youtube-root";

const state = {
  visible: false,
  eligible: false,
  token: "",
  user: null,
  actions: [],
  bridge: { connected: false },
  loading: false,
  busyId: "",
  notice: "",
  collapsed: false,
  lastUrl: ""
};

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

async function loadStoredAuth() {
  const stored = await chrome.storage.local.get(["integroToken", "integroUser"]);
  state.token = stored.integroToken || "";
  state.user = stored.integroUser || null;
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json().catch(() => ({ ok: false, error: { message: "Bad API response" } }));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload?.error?.message || "Request failed");
  }
  return payload.data;
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

function root() {
  let node = document.getElementById(ROOT_ID);
  if (!node) {
    node = document.createElement("div");
    node.id = ROOT_ID;
    document.documentElement.appendChild(node);
  }
  return node;
}

function removeRoot() {
  document.getElementById(ROOT_ID)?.remove();
}

function statusLabel() {
  if (!state.token) return "Вход нужен";
  return state.bridge?.connected ? "Bridge online" : "Стример оффлайн";
}

function render() {
  if (!state.eligible) {
    removeRoot();
    return;
  }

  const node = root();
  const disabled = !state.bridge?.connected;
  const content = state.token
    ? `
      <div class="integro-ext-head">
        <div>
          <strong>Integro</strong>
          <span>${safeText(statusLabel())}</span>
        </div>
        <button data-action="collapse" title="Свернуть">${state.collapsed ? "□" : "–"}</button>
      </div>
      ${state.collapsed ? "" : `
        <div class="integro-ext-balance">
          <span>Баланс</span>
          <strong>${coinAmount(state.user?.balance || 0)}</strong>
        </div>
        ${state.notice ? `<div class="integro-ext-notice">${safeText(state.notice)}</div>` : ""}
        <div class="integro-ext-list">
          ${state.loading ? `<div class="integro-ext-empty">Загрузка...</div>` : ""}
          ${!state.loading && state.actions.length === 0 ? `<div class="integro-ext-empty">Команд пока нет</div>` : ""}
          ${state.actions.map((action) => `
            <article class="integro-ext-action ${action.sentiment === "bad" ? "bad" : "good"}">
              <div>
                <strong>${safeText(action.title)}</strong>
                <span>${coinAmount(action.price)}</span>
              </div>
              <button data-action="buy" data-id="${safeText(action.id)}" ${disabled || state.busyId === action.id ? "disabled" : ""}>
                ${state.busyId === action.id ? "..." : "▶"}
              </button>
            </article>
          `).join("")}
        </div>
        <button class="integro-ext-logout" data-action="logout">Выйти</button>
      `}
    `
    : `
      <div class="integro-ext-head">
        <div>
          <strong>Integro</strong>
          <span>@bebrok live</span>
        </div>
      </div>
      <p class="integro-ext-copy">Войди через сайт, чтобы видеть баланс и запускать команды прямо на стриме.</p>
      ${state.notice ? `<div class="integro-ext-notice">${safeText(state.notice)}</div>` : ""}
      <button class="integro-ext-login" data-action="login">Войти</button>
    `;

  node.innerHTML = `<aside class="integro-ext-panel">${content}</aside>`;
}

async function refreshData() {
  if (!state.token || !state.eligible) return;
  state.loading = true;
  render();
  try {
    const data = await api("/extension/actions");
    state.actions = data.actions || [];
    state.bridge = data.bridge || { connected: false };
    state.user = data.user || state.user;
    await chrome.storage.local.set({ integroUser: state.user });
  } catch (error) {
    if (/auth/i.test(error.message)) {
      state.token = "";
      state.user = null;
      await chrome.storage.local.remove(["integroToken", "integroUser"]);
    }
    state.notice = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

async function buyAction(id) {
  state.busyId = id;
  state.notice = "";
  render();
  try {
    const result = await api(`/extension/actions/${encodeURIComponent(id)}/purchase`, { method: "POST" });
    state.notice = "Команда отправлена";
    if (typeof result.balance === "number") {
      state.user = { ...state.user, balance: result.balance };
      await chrome.storage.local.set({ integroUser: state.user });
    }
    await refreshData();
  } catch (error) {
    state.notice = error.message;
  } finally {
    state.busyId = "";
    render();
  }
}

async function checkPage() {
  const eligible = isEligiblePage();
  if (state.eligible !== eligible || state.lastUrl !== location.href) {
    state.eligible = eligible;
    state.lastUrl = location.href;
    state.notice = "";
    if (eligible) await refreshData();
    render();
  }
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest(`#${ROOT_ID} [data-action]`);
  if (!target) return;
  const action = target.dataset.action;
  if (action === "collapse") {
    state.collapsed = !state.collapsed;
    render();
  }
  if (action === "login") {
    state.notice = "Открыл сайт для входа";
    render();
    chrome.runtime.sendMessage({ type: "integro-start-login" }, (response) => {
      if (response?.ok === false) {
        state.notice = response.error || "Не удалось войти";
        render();
      }
    });
  }
  if (action === "logout") {
    chrome.runtime.sendMessage({ type: "integro-logout" });
  }
  if (action === "buy") {
    await buyAction(target.dataset.id);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "integro-auth-ready") {
    loadStoredAuth().then(refreshData);
  }
  if (message?.type === "integro-auth-logout") {
    state.token = "";
    state.user = null;
    state.actions = [];
    state.notice = "Вы вышли";
    render();
  }
  if (message?.type === "integro-auth-pending") {
    state.notice = "Подтверди вход на сайте";
    render();
  }
});

let observerTimer = null;
const observer = new MutationObserver(() => {
  window.clearTimeout(observerTimer);
  observerTimer = window.setTimeout(checkPage, 400);
});

loadStoredAuth().then(() => {
  checkPage();
  window.setInterval(checkPage, 2000);
  window.setInterval(refreshData, 15000);
  observer.observe(document.documentElement, { childList: true, subtree: true });
});
