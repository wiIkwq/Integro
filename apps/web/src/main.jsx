import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  ChevronDown,
  Chrome,
  Coins,
  Copy,
  Eraser,
  Gamepad2,
  Gift,
  Image,
  Loader2,
  LogOut,
  Maximize2,
  Pencil,
  Play,
  Plus,
  Power,
  RefreshCcw,
  Search,
  Shield,
  Shuffle,
  Sparkles,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Ticket,
  Trash2,
  Twitch,
  Upload,
  UserRound,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap
} from "lucide-react";
import { api } from "./api";
import { AnimatedPanel, PixelSnow, ShinyButton, SpotlightCard } from "./components/Bits";
import "./styles.css";

function emptyActionForm() {
  return {
    title: "",
    description: "",
    price: 100,
    commands: ["say {user} активировал интерактив"],
    commandMode: "sequence",
    sentiment: "good",
    stepDelaySeconds: 0,
    randomCount: 1,
    bannerUrl: ""
  };
}

const STATUS_META = {
  queued: { label: "Отправлено", tone: "queued" },
  completed: { label: "Выполнено", tone: "completed" },
  failed: { label: "Ошибка", tone: "failed" },
  refunded: { label: "Возврат", tone: "refunded" }
};

const BANNER_WIDTH = 1280;
const BANNER_HEIGHT = 720;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

function dateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function cooldownLabel(seconds) {
  const value = Number(seconds) || 0;
  if (value <= 0) return "без задержки";
  if (value < 60) return `${value} сек`;
  if (value < 3600) return `${Math.round(value / 60)} мин`;
  return `${Math.round(value / 3600)} ч`;
}

function msLabel(ms) {
  const value = Number(ms) || 0;
  if (value <= 0) return "";
  if (value < 1000) return `${value} мс`;
  return `${value / 1000} сек`;
}

function generateVoucherCode() {
  return `LIVE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function commandCountLabel(value) {
  const number = Math.abs(Number(value) || 0);
  const lastTwo = number % 100;
  const last = number % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${number} команд`;
  if (last === 1) return `${number} команда`;
  if (last >= 2 && last <= 4) return `${number} команды`;
  return `${number} команд`;
}

function roleTitle(user) {
  const email = String(user?.email || "").toLowerCase();
  if (email === "bogdan3000tm@gmail.com") return "Тестер";
  if (email === "ihnatenko.bogdan@gmail.com") return "Разработчик";
  if (user?.role === "developer" || user?.role === "admin") return "Разработчик";
  if (user?.role === "streamer") return "Стример";
  if (user?.role === "tester") return "Тестер";
  return "Зритель";
}

function canOpenStreamerPanel(user) {
  return ["admin", "developer", "streamer"].includes(user?.role);
}

function canOpenDeveloperPanel(user) {
  return ["admin", "developer"].includes(user?.role);
}

function fileToDataUrl(file, maxBytes = 7 * 1024 * 1024) {
  if (!file) return Promise.resolve("");
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Загрузи изображение"));
  if (file.size > maxBytes) return Promise.reject(new Error("Фото должно быть до 7 MB"));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Не удалось открыть изображение"));
    image.src = source;
  });
}

async function cropBannerImage(crop) {
  const image = await loadImage(crop.source);
  const canvas = document.createElement("canvas");
  canvas.width = BANNER_WIDTH;
  canvas.height = BANNER_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas недоступен");
  const metrics = getBannerCropMetrics(crop, image.naturalWidth, image.naturalHeight);
  context.clearRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT);
  context.drawImage(
    image,
    metrics.sourceX,
    metrics.sourceY,
    metrics.cropWidth,
    metrics.cropHeight,
    0,
    0,
    BANNER_WIDTH,
    BANNER_HEIGHT
  );
  return canvas.toDataURL("image/webp", 0.9);
}

function getDefaultBannerCropBox(imageWidth, imageHeight) {
  const sourceWidth = Math.max(1, Number(imageWidth) || BANNER_WIDTH);
  const sourceHeight = Math.max(1, Number(imageHeight) || BANNER_HEIGHT);
  const targetAspect = BANNER_WIDTH / BANNER_HEIGHT;
  const sourceAspect = sourceWidth / sourceHeight;
  const width = sourceAspect > targetAspect ? sourceHeight * targetAspect : sourceWidth;
  const height = width / targetAspect;
  return {
    cropX: (sourceWidth - width) / 2,
    cropY: (sourceHeight - height) / 2,
    cropWidth: width,
    cropHeight: height
  };
}

function getBannerCropMetrics(crop, imageWidth = crop.width, imageHeight = crop.height) {
  const sourceWidth = Math.max(1, Number(imageWidth) || BANNER_WIDTH);
  const sourceHeight = Math.max(1, Number(imageHeight) || BANNER_HEIGHT);
  const targetAspect = BANNER_WIDTH / BANNER_HEIGHT;
  const sourceAspect = sourceWidth / sourceHeight;
  const maxCropWidth = sourceAspect > targetAspect ? sourceHeight * targetAspect : sourceWidth;
  const maxCropHeight = maxCropWidth / targetAspect;
  const minCropWidth = Math.min(maxCropWidth, Math.max(96, maxCropWidth * 0.22));

  let cropWidth = Number(crop.cropWidth);
  let sourceX = Number(crop.cropX);
  let sourceY = Number(crop.cropY);

  if (!Number.isFinite(cropWidth) || cropWidth <= 0 || !Number.isFinite(sourceX) || !Number.isFinite(sourceY)) {
    const zoom = clamp(Number(crop.zoom || 1), 1, 3);
    cropWidth = maxCropWidth / zoom;
    const cropHeight = cropWidth / targetAspect;
    const maxOffsetX = Math.max(0, (sourceWidth - cropWidth) / 2);
    const maxOffsetY = Math.max(0, (sourceHeight - cropHeight) / 2);
    const offsetX = clamp(Number(crop.offsetX || 0), -maxOffsetX, maxOffsetX);
    const offsetY = clamp(Number(crop.offsetY || 0), -maxOffsetY, maxOffsetY);
    sourceX = (sourceWidth - cropWidth) / 2 + offsetX;
    sourceY = (sourceHeight - cropHeight) / 2 + offsetY;
  }

  cropWidth = clamp(cropWidth, minCropWidth, maxCropWidth);
  let cropHeight = cropWidth / targetAspect;

  if (cropHeight > sourceHeight) {
    cropHeight = Math.min(sourceHeight, maxCropHeight);
    cropWidth = cropHeight * targetAspect;
  }

  sourceX = clamp(sourceX, 0, Math.max(0, sourceWidth - cropWidth));
  sourceY = clamp(sourceY, 0, Math.max(0, sourceHeight - cropHeight));

  return {
    zoom: maxCropWidth / cropWidth,
    sourceWidth,
    sourceHeight,
    cropWidth,
    cropHeight,
    sourceX,
    sourceY,
    cropX: sourceX,
    cropY: sourceY,
    offsetX: sourceX - (sourceWidth - cropWidth) / 2,
    offsetY: sourceY - (sourceHeight - cropHeight) / 2,
    minCropWidth,
    maxCropWidth
  };
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || { label: status || "unknown", tone: "unknown" };
  return <span className={`pill pill-${meta.tone}`}>{meta.label}</span>;
}

function Notice({ notice }) {
  if (!notice?.text) return null;
  return (
    <div className={`notice ${notice.tone || "info"}`} role="status" aria-live="polite">
      {notice.text}
    </div>
  );
}

function useAutoDismissNotice(notice, setNotice, delay = 3800) {
  useEffect(() => {
    if (!notice?.text) return undefined;
    const timer = window.setTimeout(() => setNotice(null), delay);
    return () => window.clearTimeout(timer);
  }, [delay, notice?.text, setNotice]);
}

function AppBackground() {
  return (
    <div className="pixel-snow-shell" aria-hidden="true">
      <PixelSnow
        color="#ffffff"
        flakeSize={0.005}
        minFlakeSize={1}
        pixelResolution={400}
        speed={0.1}
        depthFade={12}
        farPlane={45}
        brightness={1}
        gamma={0.45}
        density={0.15}
        variant="square"
        direction={125}
      />
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty">
      <Icon size={28} />
      <strong>{title}</strong>
      {text && <span>{text}</span>}
    </div>
  );
}

function LoginScreen() {
  const error = new URLSearchParams(window.location.search).get("error");
  const loginError = {
    oauth_not_configured: "Google OAuth еще не подключен на сервере.",
    twitch_oauth_not_configured: "Twitch OAuth еще не подключен на сервере."
  }[error] || (error ? "Не удалось завершить вход. Попробуй еще раз." : "");

  return (
    <main className="login-shell">
      <SpotlightCard as="section" className="login-panel">
        <div className="brand-row brand-row-large">
          <div className="brand-mark">I</div>
          <span>Integro</span>
        </div>
        <h1>Войди в аккаунт</h1>
        <div className="login-auth-grid">
          <ShinyButton as="a" className="auth-provider google" href={api.loginUrl()}>
            <Chrome size={20} />
            Google
          </ShinyButton>
          <ShinyButton as="a" className="auth-provider twitch" href={api.twitchLoginUrl()}>
            <Twitch size={20} />
            Twitch
          </ShinyButton>
        </div>
        {loginError && <Notice notice={{ tone: "error", text: loginError }} />}
      </SpotlightCard>
    </main>
  );
}

function App() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMe() {
    setError("");
    try {
      const data = await api.me();
      setMe(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function logout() {
    await api.logout();
    setMe(null);
  }

  if (loading) {
    return (
      <>
        <AppBackground />
        <div className="boot">
          <Loader2 className="spin" size={22} />
          Загрузка Integro
        </div>
      </>
    );
  }

  if (!me) {
    return (
      <>
        <AppBackground />
        <LoginScreen />
      </>
    );
  }

  return (
    <>
      <AppBackground />
      <Shell user={me} onLogout={logout} error={error}>
        {canOpenStreamerPanel(me) ? (
          <AdminDashboard user={me} onUserChange={setMe} />
        ) : (
          <UserDashboard user={me} onUserChange={setMe} />
        )}
      </Shell>
    </>
  );
}

function Shell({ user, onLogout, error, children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");

  async function toggleProfile() {
    const next = !profileOpen;
    setProfileOpen(next);
    if (!next) return;
    setStatsError("");
    try {
      const data = await api.stats();
      setStats(data.stats);
    } catch (err) {
      setStatsError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-row">
          <div className="brand-mark">I</div>
          <span>Integro</span>
        </div>
        <div className="topbar-right">
          {!canOpenStreamerPanel(user) && (
            <div className="balance-chip">
              <Coins size={16} />
              {coinAmount(user.balance)}
            </div>
          )}
          <div className="profile-wrap">
            <button className="profile-chip" type="button" onClick={toggleProfile} aria-expanded={profileOpen}>
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={18} />}
              <span>{user.name || "Профиль"}</span>
              {canOpenStreamerPanel(user) && <Shield size={15} />}
              <ChevronDown size={15} />
            </button>
          </div>
        </div>
      </header>
      {profileOpen && (
        <ProfileStats user={user} stats={stats} error={statsError} onLogout={onLogout} />
      )}
      {error && <div className="notice error shell-notice">{error}</div>}
      {children}
    </div>
  );
}

function ProfileStats({ user, stats, error, onLogout }) {
  return (
    <SpotlightCard as="aside" className="profile-popover">
      <div className="profile-popover-head">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={26} />}
        <div>
          <strong>{user.name || "Профиль"}</strong>
          <span>{roleTitle(user)}</span>
        </div>
      </div>
      {error && <Notice notice={{ tone: "error", text: error }} />}
      {!stats && !error && !canOpenStreamerPanel(user) && (
        <div className="mini-loading">
          <Loader2 className="spin" size={16} />
          Загружаем статистику
        </div>
      )}
      {stats && !canOpenStreamerPanel(user) && (
        <div className="profile-stats-grid">
          <StatMini label="Баланс" value={coinAmount(stats.balance)} />
          <StatMini label="Пополнено" value={coinAmount(stats.totalReceived)} />
          <StatMini label="Потрачено" value={coinAmount(stats.totalSpent)} />
          <StatMini label="Команд отправил" value={stats.completedCount || 0} />
        </div>
      )}
      <button className="secondary-action profile-logout" type="button" onClick={onLogout}>
        <LogOut size={16} />
        Выйти
      </button>
    </SpotlightCard>
  );
}

function StatMini({ label, value }) {
  return (
    <div className="stat-mini">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function UserDashboard({ user, onUserChange }) {
  const [actions, setActions] = useState([]);
  const [bridgeOnline, setBridgeOnline] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kindFilter, setKindFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  useAutoDismissNotice(notice, setNotice);

  const visibleActions = useMemo(() => {
    const filtered = actions.filter((action) => kindFilter === "all" || action.sentiment === kindFilter);
    if (priceSort === "asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (priceSort === "desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [actions, kindFilter, priceSort]);

  async function refresh(options = {}) {
    if (!options.silent) setLoading(true);
    try {
      const [me, nextActions] = await Promise.all([api.me(), api.actions()]);
      onUserChange(me.user);
      setActions(nextActions.actions);
      setBridgeOnline(Boolean(nextActions.bridge?.connected));
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function redeem(event) {
    event.preventDefault();
    const code = voucher.trim();
    if (!code) return;
    setBusy("voucher");
    setNotice(null);
    try {
      const result = await api.redeemVoucher(code);
      setNotice({ tone: "success", text: `Ваучер активирован: +${coinAmount(result.coins)}` });
      setVoucher("");
      await refresh({ silent: true });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy("");
    }
  }

  async function buy(action) {
    setBusy(action.id);
    setNotice(null);
    try {
      await api.buyAction(action.id);
      setNotice({ tone: "success", text: `${action.title} отправлено в игру` });
      await refresh({ silent: true });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="workspace user-workspace">
      <section className="viewer-bar viewer-bar-compact">
        <form className="voucher-strip" onSubmit={redeem} aria-label="Активация ваучера">
          <input
            value={voucher}
            onChange={(event) => setVoucher(event.target.value)}
            placeholder="Ваучер"
            autoComplete="off"
            aria-label="Код ваучера"
          />
          <ShinyButton className="primary-action" disabled={!voucher.trim() || busy === "voucher"}>
            <Ticket size={17} />
            {busy === "voucher" ? "Проверяем" : "Активировать"}
          </ShinyButton>
        </form>
      </section>

      <Notice notice={notice} />

      <section className="sort-toolbar" aria-label="Сортировка команд">
        <div className="segmented">
          <button className={kindFilter === "all" ? "active" : ""} type="button" onClick={() => setKindFilter("all")}>Все</button>
          <button className={kindFilter === "good" ? "active" : ""} type="button" onClick={() => setKindFilter("good")}>
            <ThumbsUp size={15} />
            Хорошие
          </button>
          <button className={kindFilter === "bad" ? "active" : ""} type="button" onClick={() => setKindFilter("bad")}>
            <ThumbsDown size={15} />
            Плохие
          </button>
        </div>
        <div className="segmented">
          <button className={priceSort === "none" ? "active" : ""} type="button" onClick={() => setPriceSort("none")}>Сначала новые</button>
          <button className={priceSort === "asc" ? "active" : ""} type="button" onClick={() => setPriceSort("asc")}>Дешевле</button>
          <button className={priceSort === "desc" ? "active" : ""} type="button" onClick={() => setPriceSort("desc")}>Дороже</button>
        </div>
      </section>

      <section className="actions-grid">
        {loading && actions.length === 0 && <SkeletonCards count={4} />}
        {!loading && visibleActions.length === 0 && (
          <EmptyState icon={Sparkles} title="Команд пока нет" text="Стример еще не добавил действия." />
        )}
        {visibleActions.map((action, index) => {
          const lacksCoins = user.balance < action.price;
          const isBusy = busy === action.id;
          const streamerOffline = !bridgeOnline;
          return (
            <ActionCard
              action={action}
              index={index}
              key={action.id}
              disabled={isBusy || lacksCoins || streamerOffline}
              buttonText={streamerOffline ? "Стример оффлайн" : isBusy ? "Отправляем" : lacksCoins ? "Не хватает монет" : "Запустить"}
              onClick={() => buy(action)}
            />
          );
        })}
      </section>
    </main>
  );
}

function ActionCard({ action, index = 0, disabled, buttonText, onClick }) {
  const cardStyle = action.bannerUrl ? { backgroundImage: `url(${action.bannerUrl})` } : undefined;
  const sentimentIcon = action.sentiment === "bad" ? ThumbsDown : ThumbsUp;
  const SentimentIcon = sentimentIcon;
  const sentimentLabel = action.sentiment === "bad" ? "Негативный эффект" : "Позитивный эффект";

  return (
    <SpotlightCard className={`action-card ${action.bannerUrl ? "has-image" : ""}`} delay={index * 35} style={cardStyle}>
      <span className={`effect-mark ${action.sentiment === "bad" ? "bad" : "good"}`} title={sentimentLabel}>
        <SentimentIcon size={16} />
      </span>
      {!action.bannerUrl && <Gamepad2 className="action-bg-icon" size={56} />}
      <div className="action-body">
        <div className="action-copy">
          <h3>{action.title}</h3>
        </div>
        <div className="action-footer">
          <ShinyButton className="primary-action action-run" disabled={disabled} onClick={onClick} type="button">
            <Zap size={17} />
            {buttonText}
          </ShinyButton>
          <PriceContent action={action} />
        </div>
      </div>
    </SpotlightCard>
  );
}

function PriceContent({ action }) {
  return (
    <div className="price-inline">
      <span className="price-current">
        <Coins size={14} strokeWidth={2.8} />
        <strong>{money(action.price)}</strong>
      </span>
    </div>
  );
}

function SkeletonCards({ count }) {
  return Array.from({ length: count }).map((_, index) => (
    <div className="skeleton-card" key={index}>
      <span />
      <strong />
      <p />
      <b />
    </div>
  ));
}

function AdminDashboard({ user, onUserChange }) {
  const [tab, setTab] = useState("actions");
  const [actions, setActions] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const isDeveloper = canOpenDeveloperPanel(user);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 3800);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function refresh(options = {}) {
    if (!options.silent) setLoading(true);
    try {
      const [me, nextOverview, nextActions, nextVouchers, nextUsers, nextPurchases] = await Promise.all([
        api.me(),
        api.adminOverview(),
        api.adminActions(),
        api.adminVouchers(),
        api.adminUsers(),
        api.adminPurchases()
      ]);
      onUserChange(me.user);
      setOverview(nextOverview);
      setActions(nextActions.actions);
      setVouchers(nextVouchers.vouchers);
      setUsers(nextUsers.users);
      setPurchases(nextPurchases.purchases);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function resetData() {
    const confirmed = window.confirm("Удалить статистику и всех зрителей? Стримерские аккаунты останутся.");
    if (!confirmed) return;
    setMessage("");
    setLoading(true);
    try {
      await api.adminResetData();
      setMessage("Статистика и зрители очищены");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  const bridgeOnline = Boolean(overview?.bridge?.connected);
  const tabs = [
    { id: "actions", label: "Команды", icon: Terminal, count: actions.length },
    { id: "vouchers", label: "Ваучеры", icon: Ticket, count: vouchers.length },
    { id: "users", label: "Пользователи", icon: Users, count: users.length },
    { id: "donations", label: "Донаты", icon: Zap, count: purchases.length },
    ...(isDeveloper ? [{ id: "developer", label: "Developer", icon: Shield, count: 0 }] : [])
  ];

  return (
    <main className="workspace">
      <section className="admin-hero">
        <AnimatedPanel>
          <h1>Панель стримера</h1>
        </AnimatedPanel>
        <div className="hero-actions">
          <button className="secondary-action" onClick={() => refresh()} type="button" disabled={loading}>
            <RefreshCcw size={17} className={loading ? "spin" : ""} />
            Обновить
          </button>
          <button className="secondary-action danger-action" onClick={resetData} type="button" disabled={loading}>
            <Eraser size={17} />
            Очистить данные
          </button>
        </div>
      </section>

      <section className="metrics metrics-wide">
        <Metric icon={Coins} label="Получено" value={coinAmount(overview?.totalReceived || 0)} />
        <Metric icon={Zap} label="Потрачено" value={coinAmount(overview?.totalSpent || 0)} />
        <Metric icon={Ticket} label="Активаций" value={overview?.voucherRedemptionsCount || 0} />
        <Metric icon={Terminal} label="Донатов" value={overview?.purchasesCount || 0} />
        <Metric icon={Users} label="Пользователей" value={overview?.usersCount || 0} />
        <Metric
          icon={bridgeOnline ? Wifi : WifiOff}
          label="Bridge"
          value={bridgeOnline ? "online" : "offline"}
          tone={bridgeOnline ? "good" : "bad"}
        />
      </section>

      {message && <div className="notice info">{message}</div>}

      <nav className="tabs" aria-label="Разделы стримера">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} type="button">
            <Icon size={17} />
            <span>{label}</span>
            <b>{count}</b>
          </button>
        ))}
      </nav>

      {tab === "actions" && <AdminActions actions={actions} refresh={refresh} setMessage={setMessage} />}
      {tab === "vouchers" && <AdminVouchers vouchers={vouchers} refresh={refresh} setMessage={setMessage} />}
      {tab === "users" && <AdminUsers users={users} refresh={refresh} setMessage={setMessage} />}
      {tab === "donations" && <AdminDonations purchases={purchases} />}
      {tab === "developer" && isDeveloper && <DeveloperPanel setMessage={setMessage} />}
    </main>
  );
}

function Metric({ icon: Icon, label, value, tone = "neutral" }) {
  return (
    <SpotlightCard as="div" className={`metric metric-${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </SpotlightCard>
  );
}

function AdminActions({ actions, refresh, setMessage }) {
  const [form, setForm] = useState(emptyActionForm);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [pendingBanner, setPendingBanner] = useState(null);
  const [expandedCommandIndex, setExpandedCommandIndex] = useState(null);
  const commandLines = useMemo(() => form.commands.map((command) => command.trim()).filter(Boolean).length, [form.commands]);
  const randomLimit = Math.max(1, commandLines || 1);
  const isEditing = Boolean(editingId);

  function actionToForm(action) {
    return {
      title: action.title || "",
      description: action.description || "",
      price: action.price || 1,
      commands: action.commands?.length ? [...action.commands] : [action.command || ""],
      commandMode: action.commandMode || "sequence",
      sentiment: action.sentiment || "good",
      stepDelaySeconds: String((Number(action.stepDelayMs) || 0) / 1000),
      randomCount: action.randomCount || 1,
      bannerUrl: action.bannerUrl || ""
    };
  }

  function startEdit(action) {
    setEditingId(action.id);
    setForm(actionToForm(action));
    setMessage(`Редактируешь: ${action.title}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyActionForm());
    setPendingBanner(null);
    setExpandedCommandIndex(null);
    setMessage("");
  }

  function setCommand(index, value) {
    setForm((current) => ({
      ...current,
      commands: current.commands.map((command, itemIndex) => (itemIndex === index ? value : command))
    }));
  }

  function addCommand() {
    setForm((current) => ({ ...current, commands: [...current.commands, ""] }));
  }

  function removeCommand(index) {
    setForm((current) => ({
      ...current,
      commands: current.commands.length > 1 ? current.commands.filter((_, itemIndex) => itemIndex !== index) : [""]
    }));
  }

  function moveCommand(index, direction) {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.commands.length) return current;
      const commands = [...current.commands];
      [commands[index], commands[nextIndex]] = [commands[nextIndex], commands[index]];
      return { ...current, commands };
    });
  }

  async function handleBanner(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const source = await fileToDataUrl(file);
      const image = await loadImage(source);
      setPendingBanner({
        source,
        width: image.naturalWidth,
        height: image.naturalHeight,
        ...getDefaultBannerCropBox(image.naturalWidth, image.naturalHeight)
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      event.target.value = "";
    }
  }

  async function applyBannerCrop() {
    if (!pendingBanner) return;
    try {
      const bannerUrl = await cropBannerImage(pendingBanner);
      setForm((current) => ({ ...current, bannerUrl }));
      setPendingBanner(null);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        commands: form.commands.map((command) => command.trim()).filter(Boolean),
        commandMode: form.commandMode,
        sentiment: form.sentiment,
        randomCount: Number(form.randomCount),
        stepDelayMs: Number(form.stepDelaySeconds) * 1000,
        bannerUrl: form.bannerUrl
      };
      if (isEditing) {
        await api.updateAction(editingId, payload);
      } else {
        await api.createAction(payload);
      }
      setForm(emptyActionForm());
      setEditingId("");
      setMessage(isEditing ? "Команда сохранена" : "Команда создана");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(action) {
    setBusyId(action.id);
    setMessage("");
    try {
      await api.updateAction(action.id, { isEnabled: !action.isEnabled });
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function removeAction(id) {
    setBusyId(id);
    setMessage("");
    try {
      await api.deleteAction(id);
      setMessage("Команда удалена");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function testAction(action) {
    setBusyId(action.id);
    setMessage("");
    try {
      await api.testAction(action.id);
      setMessage("Тест отправлен в Minecraft");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
    <section className="grid admin-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="panel-title panel-title-split">
          <div>
            {isEditing ? <Pencil size={19} /> : <Plus size={19} />}
            <h2>{isEditing ? "Редактирование команды" : "Новая команда"}</h2>
          </div>
          {isEditing && (
            <button className="secondary-action compact" type="button" onClick={cancelEdit}>
              <X size={15} />
              Отмена
            </button>
          )}
        </div>
        <label className="field">
          <span>Название</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Описание для панели</span>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Можно оставить пустым" />
        </label>
        <label className="field">
          <span>Баннер</span>
          <div className="upload-box">
            <div className={`thumb banner-preview ${form.bannerUrl ? "has-image" : ""}`} style={form.bannerUrl ? { backgroundImage: `url(${form.bannerUrl})` } : undefined}>
              {!form.bannerUrl && <Image size={20} />}
            </div>
            <div>
              <label className="secondary-action compact file-button">
                <Upload size={15} />
                Загрузить фото
                <input type="file" accept="image/*" onChange={handleBanner} />
              </label>
              {form.bannerUrl && (
                <button className="secondary-action compact remove-banner-button" type="button" onClick={() => setForm({ ...form, bannerUrl: "" })}>
                  <Trash2 size={15} />
                  Убрать баннер
                </button>
              )}
            </div>
          </div>
        </label>
        <label className="field">
          <span>Цена</span>
          <input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </label>
        <label className="field">
          <span>Команды Minecraft</span>
          <div className="command-fields">
            {form.commands.map((command, index) => (
              <div className="command-field-row" key={index}>
                <textarea
                  required={index === 0}
                  className="mono command-field-input"
                  spellCheck="false"
                  value={command}
                  placeholder={`Команда ${index + 1}`}
                  onChange={(e) => setCommand(index, e.target.value)}
                />
                <div className="command-field-actions" aria-label="Порядок команды">
                  <button className="icon-button compact" type="button" onClick={() => moveCommand(index, -1)} disabled={index === 0} title="Выше">
                    <ChevronDown className="rotate-up" size={16} />
                  </button>
                  <button className="icon-button compact" type="button" onClick={() => moveCommand(index, 1)} disabled={index === form.commands.length - 1} title="Ниже">
                    <ChevronDown size={16} />
                  </button>
                  <button className="icon-button compact danger" type="button" onClick={() => removeCommand(index)} title="Удалить поле">
                    <Trash2 size={16} />
                  </button>
                  <button className="icon-button compact" type="button" onClick={() => setExpandedCommandIndex(index)} title="Увеличить">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button className="secondary-action compact add-command-button" type="button" onClick={addCommand}>
              <Plus size={15} />
              Добавить команду
            </button>
          </div>
        </label>
        <div className="mode-row">
          <button
            className={form.commandMode === "sequence" ? "active" : ""}
            type="button"
            onClick={() => setForm({ ...form, commandMode: "sequence" })}
          >
            <Terminal size={15} />
            По очереди
          </button>
          <button
            className={form.commandMode === "random" ? "active" : ""}
            type="button"
            onClick={() => setForm({ ...form, commandMode: "random" })}
          >
            <Shuffle size={15} />
            Рандом
          </button>
        </div>
        <div className="mode-row">
          <button
            className={form.sentiment === "good" ? "active good-choice" : ""}
            type="button"
            onClick={() => setForm({ ...form, sentiment: "good" })}
          >
            <ThumbsUp size={15} />
            Хорошая
          </button>
          <button
            className={form.sentiment === "bad" ? "active bad-choice" : ""}
            type="button"
            onClick={() => setForm({ ...form, sentiment: "bad" })}
          >
            <ThumbsDown size={15} />
            Плохая
          </button>
        </div>
        <div className="split-inputs">
          <label className="field">
            <span>Между командами, сек</span>
            <input type="number" min="0" value={form.stepDelaySeconds} onChange={(e) => setForm({ ...form, stepDelaySeconds: e.target.value })} />
          </label>
          {form.commandMode === "random" && (
            <label className="field">
              <span>Сколько рандомных</span>
              <input
                type="number"
                min="1"
                max={randomLimit}
                value={Math.min(Number(form.randomCount) || 1, randomLimit)}
                onChange={(e) => setForm({ ...form, randomCount: e.target.value })}
              />
            </label>
          )}
        </div>
        <div className="form-foot">
          <span>{commandCountLabel(commandLines || 0)}</span>
          <ShinyButton className="primary-action compact" disabled={saving}>
            <BadgeCheck size={17} />
            {saving ? "Сохраняем" : isEditing ? "Сохранить" : "Создать"}
          </ShinyButton>
        </div>
      </form>

      <section className="panel">
        <div className="panel-title">
          <Terminal size={19} />
          <h2>Команды</h2>
        </div>
        <div className="table-list">
          {actions.length === 0 && <EmptyState icon={Terminal} title="Команд нет" text="Создай первое действие для стрима." />}
          {actions.map((action) => (
            <div className="admin-row action-admin-row" key={action.id}>
              <div className="admin-action-media">
                <div className={`thumb ${action.bannerUrl ? "has-image" : ""}`} style={action.bannerUrl ? { backgroundImage: `url(${action.bannerUrl})` } : undefined}>
                  {!action.bannerUrl && <Gamepad2 size={20} />}
                </div>
                <div>
                  <div className="row-title">
                    <strong>{action.title}</strong>
                    <span className={`state-badge ${action.isEnabled ? "on" : "off"}`}>
                      {action.isEnabled ? "включена" : "выключена"}
                    </span>
                    <span className={`state-badge ${action.sentiment === "bad" ? "bad" : "good"}`}>
                      {action.sentiment === "bad" ? "плохая" : "хорошая"}
                    </span>
                  </div>
                  <span>
                    {coinAmount(action.price)} · {commandCountLabel(action.commandCount)} · {action.commandMode === "random" ? "рандом" : "по очереди"}
                    {action.stepDelayMs > 0 ? ` · задержка ${msLabel(action.stepDelayMs)}` : ""}
                  </span>
                  <code>{(action.commands || [action.command]).join(" | ")}</code>
                </div>
              </div>
              <div className="row-actions">
                <button className="secondary-action compact" onClick={() => startEdit(action)} type="button" disabled={busyId === action.id}>
                  <Pencil size={15} />
                  Изменить
                </button>
                <button className="secondary-action compact" onClick={() => testAction(action)} type="button" disabled={busyId === action.id}>
                  <Play size={15} />
                  Тест
                </button>
                <button className="secondary-action compact" onClick={() => toggle(action)} type="button" disabled={busyId === action.id}>
                  <Power size={15} />
                  {action.isEnabled ? "Выключить" : "Включить"}
                </button>
                <button className="icon-button danger" onClick={() => removeAction(action.id)} type="button" disabled={busyId === action.id} title="Удалить">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
      {pendingBanner && (
        <BannerCropModal
          crop={pendingBanner}
          setCrop={setPendingBanner}
          onCancel={() => setPendingBanner(null)}
          onApply={applyBannerCrop}
        />
      )}
      {expandedCommandIndex !== null && (
        <CommandEditorModal
          value={form.commands[expandedCommandIndex] || ""}
          index={expandedCommandIndex}
          onChange={(value) => setCommand(expandedCommandIndex, value)}
          onClose={() => setExpandedCommandIndex(null)}
        />
      )}
    </>
  );
}

function BannerCropModal({ crop, setCrop, onCancel, onApply }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const metrics = getBannerCropMetrics(crop);
  const cropLeft = (metrics.sourceX / metrics.sourceWidth) * 100;
  const cropTop = (metrics.sourceY / metrics.sourceHeight) * 100;
  const cropWidth = (metrics.cropWidth / metrics.sourceWidth) * 100;
  const cropHeight = (metrics.cropHeight / metrics.sourceHeight) * 100;
  const cropRight = Math.max(0, 100 - cropLeft - cropWidth);
  const cropBottom = Math.max(0, 100 - cropTop - cropHeight);
  const stageStyle = {
    "--crop-aspect": metrics.sourceWidth / metrics.sourceHeight
  };
  const cropWindowStyle = {
    left: `${cropLeft}%`,
    top: `${cropTop}%`,
    width: `${cropWidth}%`,
    height: `${cropHeight}%`
  };
  const cropHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

  function setClampedCrop(nextCrop) {
    const nextMetrics = getBannerCropMetrics(nextCrop);
    setCrop({
      ...nextCrop,
      cropX: nextMetrics.sourceX,
      cropY: nextMetrics.sourceY,
      cropWidth: nextMetrics.cropWidth,
      cropHeight: nextMetrics.cropHeight,
      zoom: nextMetrics.zoom
    });
  }

  function resetCrop() {
    setClampedCrop({ ...crop, ...getDefaultBannerCropBox(metrics.sourceWidth, metrics.sourceHeight) });
  }

  function startCropDrag(event, mode, handle = "") {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      pointerId: event.pointerId,
      mode,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startCropX: metrics.sourceX,
      startCropY: metrics.sourceY,
      startCropWidth: metrics.cropWidth,
      startCropHeight: metrics.cropHeight,
      rect
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = ((event.clientX - drag.startX) / drag.rect.width) * metrics.sourceWidth;
    const deltaY = ((event.clientY - drag.startY) / drag.rect.height) * metrics.sourceHeight;
    if (drag.mode === "move") {
      setClampedCrop({
        ...crop,
        cropX: drag.startCropX + deltaX,
        cropY: drag.startCropY + deltaY,
        cropWidth: drag.startCropWidth,
        cropHeight: drag.startCropHeight
      });
      return;
    }

    const aspect = BANNER_WIDTH / BANNER_HEIGHT;
    const handle = drag.handle;
    const horizontal = handle.includes("e") ? deltaX : handle.includes("w") ? -deltaX : 0;
    const vertical = handle.includes("s") ? deltaY : handle.includes("n") ? -deltaY : 0;
    const widthFromX = drag.startCropWidth + horizontal;
    const widthFromY = (drag.startCropHeight + vertical) * aspect;
    const nextWidth = handle.length === 1
      ? (handle === "n" || handle === "s" ? widthFromY : widthFromX)
      : (Math.abs(horizontal) > Math.abs(vertical * aspect) ? widthFromX : widthFromY);
    const nextHeight = nextWidth / aspect;
    let nextX = drag.startCropX;
    let nextY = drag.startCropY;

    if (handle.includes("w")) nextX = drag.startCropX + drag.startCropWidth - nextWidth;
    if (!handle.includes("w") && !handle.includes("e")) nextX = drag.startCropX + (drag.startCropWidth - nextWidth) / 2;
    if (handle.includes("n")) nextY = drag.startCropY + drag.startCropHeight - nextHeight;
    if (!handle.includes("n") && !handle.includes("s")) nextY = drag.startCropY + (drag.startCropHeight - nextHeight) / 2;

    setClampedCrop({
      ...crop,
      cropX: nextX,
      cropY: nextY,
      cropWidth: nextWidth,
      cropHeight: nextHeight
    });
  }

  function handlePointerUp(event) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  return (
    <ModalFrame onClose={onCancel} className="crop-modal" backdropClassName="crop-backdrop" closeOnBackdrop={false} label="Кадрирование баннера">
      <div className="modal-title-row">
        <div>
          <h3>Кадрирование баннера</h3>
          <span>Формат как на карточке команды у зрителей</span>
        </div>
      </div>
      <div className="crop-stage-shell">
        <div
          className="crop-stage"
          ref={stageRef}
          style={stageStyle}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img className="crop-full-image" src={crop.source} alt="" draggable="false" />
          <div className="crop-shade" style={{ left: 0, top: 0, width: "100%", height: `${cropTop}%` }} aria-hidden="true" />
          <div className="crop-shade" style={{ left: 0, top: `${cropTop + cropHeight}%`, width: "100%", height: `${cropBottom}%` }} aria-hidden="true" />
          <div className="crop-shade" style={{ left: 0, top: `${cropTop}%`, width: `${cropLeft}%`, height: `${cropHeight}%` }} aria-hidden="true" />
          <div className="crop-shade" style={{ left: `${cropLeft + cropWidth}%`, top: `${cropTop}%`, width: `${cropRight}%`, height: `${cropHeight}%` }} aria-hidden="true" />
          <div
            className="crop-window"
            style={cropWindowStyle}
            role="presentation"
            onPointerDown={(event) => startCropDrag(event, "move")}
          >
            <div className="crop-grid" />
            {cropHandles.map((handle) => (
              <button
                className={`crop-handle crop-handle-${handle}`}
                key={handle}
                type="button"
                aria-label="Изменить кадр"
                onPointerDown={(event) => startCropDrag(event, "resize", handle)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="crop-toolbar">
        <span>Фиксированный формат 1280x720</span>
        <div>
          <button className="secondary-action compact icon-only" type="button" onClick={resetCrop} title="Сбросить">
            <RefreshCcw size={15} />
          </button>
        </div>
      </div>
      <div className="modal-actions">
        <button className="secondary-action compact" type="button" onClick={onCancel}>Отмена</button>
        <ShinyButton className="primary-action compact" type="button" onClick={onApply}>
          <BadgeCheck size={16} />
          Применить
        </ShinyButton>
      </div>
    </ModalFrame>
  );
}

function CommandEditorModal({ value, index, onChange, onClose }) {
  return (
    <ModalFrame onClose={onClose} className="command-modal" label="Большое поле команды">
      <div className="modal-title-row">
        <div>
          <h3>Команда {index + 1}</h3>
          <span>Удобное поле для длинной Minecraft-команды</span>
        </div>
        <button className="icon-button modal-close-inline" type="button" onClick={onClose} title="Закрыть">
          <X size={18} />
        </button>
      </div>
      <textarea
        className="mono expanded-command-input"
        spellCheck="false"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus
      />
      <div className="modal-actions">
        <ShinyButton className="primary-action compact" type="button" onClick={onClose}>
          <BadgeCheck size={16} />
          Готово
        </ShinyButton>
      </div>
    </ModalFrame>
  );
}

function ModalFrame({ children, onClose, className = "", backdropClassName = "", closeOnBackdrop = true, label }) {
  return (
    <div className={`modal-backdrop modal-lock ${backdropClassName}`} onClick={(event) => {
      if (closeOnBackdrop && event.target === event.currentTarget) onClose();
    }}>
      <SpotlightCard className={`user-modal ${className}`} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </SpotlightCard>
    </div>
  );
}

function AdminVouchers({ vouchers, refresh, setMessage }) {
  const [form, setForm] = useState({ code: "", coins: 500, maxRedemptions: 1, perUserLimit: 1, perUserCooldownSeconds: 0 });
  const [suggestedCode, setSuggestedCode] = useState(generateVoucherCode);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.createVoucher({
        code: form.code,
        coins: Number(form.coins),
        maxRedemptions: Number(form.maxRedemptions),
        perUserLimit: Number(form.perUserLimit),
        perUserCooldownSeconds: Number(form.perUserCooldownSeconds)
      });
      setForm({ code: "", coins: 500, maxRedemptions: 1, perUserLimit: 1, perUserCooldownSeconds: 0 });
      setSuggestedCode(generateVoucherCode());
      setMessage("Ваучер создан");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Код скопирован");
    } catch {
      setMessage("Не удалось скопировать код");
    }
  }

  async function toggle(voucher) {
    setBusyId(voucher.id);
    setMessage("");
    try {
      await api.updateVoucher(voucher.id, { isActive: !voucher.isActive });
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function remove(voucher) {
    setBusyId(voucher.id);
    setMessage("");
    try {
      await api.deleteVoucher(voucher.id);
      setMessage("Ваучер удален");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  function useGeneratedCode() {
    setForm((current) => ({ ...current, code: suggestedCode }));
    setSuggestedCode(generateVoucherCode());
  }

  return (
    <section className="grid admin-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="panel-title">
          <Ticket size={19} />
          <h2>Новый ваучер</h2>
        </div>
        <label className="field">
          <span>Код</span>
          <div className="input-with-button">
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder={suggestedCode} />
            <button className="secondary-action compact" type="button" onClick={useGeneratedCode}>
              <Sparkles size={15} />
              Сгенерировать
            </button>
          </div>
        </label>
        <div className="split-inputs">
          <label className="field">
            <span>Монеты</span>
            <input required type="number" min="1" value={form.coins} onChange={(e) => setForm({ ...form, coins: e.target.value })} />
          </label>
          <label className="field">
            <span>Всего активаций</span>
            <input required type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
          </label>
        </div>
        <div className="split-inputs">
          <label className="field">
            <span>На аккаунт</span>
            <input required type="number" min="1" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} />
          </label>
          <label className="field">
            <span>Задержка, сек</span>
            <input type="number" min="0" value={form.perUserCooldownSeconds} onChange={(e) => setForm({ ...form, perUserCooldownSeconds: e.target.value })} />
          </label>
        </div>
        <ShinyButton className="primary-action compact" disabled={saving}>
          <Plus size={17} />
          {saving ? "Создаем" : "Создать"}
        </ShinyButton>
      </form>

      <section className="panel">
        <div className="panel-title">
          <Gift size={19} />
          <h2>Ваучеры</h2>
        </div>
        <div className="table-list">
          {vouchers.length === 0 && <EmptyState icon={Gift} title="Ваучеров нет" text="Создай код для пополнения баланса." />}
          {vouchers.map((voucher) => (
            <div className="admin-row" key={voucher.id}>
              <div>
                <div className="row-title">
                  <strong>{voucher.code}</strong>
                  <span className={`state-badge ${voucher.isUsed ? "used" : voucher.isActive ? "on" : "off"}`}>
                    {voucher.isUsed ? "использован" : voucher.isActive ? "включен" : "выключен"}
                  </span>
                </div>
                <span>
                  {coinAmount(voucher.coins)} · {voucher.redeemedCount}/{voucher.maxRedemptions} · на аккаунт {voucher.perUserLimit}
                  {voucher.perUserCooldownSeconds > 0 ? ` · задержка ${cooldownLabel(voucher.perUserCooldownSeconds)}` : ""}
                </span>
              </div>
              <div className="row-actions">
                <button className="icon-button" type="button" onClick={() => copy(voucher.code)} title="Скопировать">
                  <Copy size={17} />
                </button>
                <button className="secondary-action compact" onClick={() => toggle(voucher)} type="button" disabled={busyId === voucher.id || voucher.isUsed}>
                  <Power size={15} />
                  {voucher.isActive ? "Выключить" : "Включить"}
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => remove(voucher)}
                  type="button"
                  disabled={busyId === voucher.id}
                  title="Удалить ваучер"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function AdminUsers({ users, refresh, setMessage }) {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinForm, setCoinForm] = useState({ mode: "grant", amount: "", reason: "" });
  const [busy, setBusy] = useState(false);
  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) => {
      const haystack = `${user.name || ""} ${user.email || ""} ${user.role || ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, users]);

  return (
    <section className="panel">
      <div className="panel-title panel-title-split">
        <div>
          <Users size={19} />
          <h2>Пользователи</h2>
        </div>
        <label className="input-icon user-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по имени" />
        </label>
      </div>
      <div className="table-list">
        {users.length === 0 && <EmptyState icon={Users} title="Пользователей нет" text="После входа зрители появятся здесь." />}
        {users.length > 0 && filteredUsers.length === 0 && <EmptyState icon={Search} title="Никого не нашли" text="Проверь имя или очисти поиск." />}
        {filteredUsers.map((user) => (
            <button className="user-row user-row-button" key={user.id} type="button" onClick={() => setSelectedUser(user)}>
              <div className="user-line">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={20} />}
                <div>
                  <strong>{user.name || "Зритель"}</strong>
                  <span>{roleTitle(user)}</span>
                </div>
              </div>
              <span>{user.purchasesCount || 0} донатов</span>
            </button>
        ))}
      </div>
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          coinForm={coinForm}
          setCoinForm={setCoinForm}
          busy={busy}
          onBalanceSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            try {
              const result = await api.adjustViewerBalance(selectedUser.id, {
                mode: coinForm.mode || "grant",
                amount: Number(coinForm.amount || 0),
                reason: coinForm.reason || "Коррекция баланса стримером"
              });
              const delta = Number(result.delta || 0);
              const prefix = delta > 0 ? "+" : "";
              setMessage(`Баланс обновлен: ${prefix}${coinAmount(delta)}`);
              setCoinForm({ mode: "grant", amount: "", reason: "" });
              await refresh({ silent: true });
              setSelectedUser((current) => current ? { ...current, balance: result.balance } : current);
            } catch (err) {
              setMessage(err.message);
            } finally {
              setBusy(false);
            }
          }}
          onClose={() => {
            setSelectedUser(null);
            setCoinForm({ mode: "grant", amount: "", reason: "" });
          }}
        />
      )}
    </section>
  );
}

function UserDetailsModal({ user, onClose, coinForm, setCoinForm, onBalanceSubmit, busy }) {
  const modeMeta = {
    grant: { title: "Начислить монеты", button: "Начислить", hint: "Добавит монеты к текущему балансу." },
    deduct: { title: "Списать монеты", button: "Списать", hint: "Уменьшит баланс пользователя." },
    set: { title: "Установить баланс", button: "Установить", hint: "Заменит текущий баланс указанной суммой." }
  };
  const activeMode = modeMeta[coinForm.mode] || modeMeta.grant;
  return (
    <ModalFrame onClose={onClose} label="Профиль пользователя">
        <button className="icon-button modal-close" type="button" onClick={onClose} title="Закрыть">
          <X size={18} />
        </button>
        <div className="modal-profile-head">
          <div className="modal-avatar">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={38} />}
          </div>
          <div>
            <span>{roleTitle(user)}</span>
            <h3>{user.name || "Зритель"}</h3>
            <p>Зарегистрирован: {dateTime(user.createdAt) || "нет даты"}</p>
          </div>
        </div>
        <div className={`modal-stats ${canOpenStreamerPanel(user) ? "streamer-stats" : ""}`}>
          {!canOpenStreamerPanel(user) && <StatMini label="Баланс" value={coinAmount(user.balance)} />}
          <StatMini label="Получил" value={coinAmount(user.totalReceived)} />
          <StatMini label="Потратил" value={coinAmount(user.totalSpent)} />
          <StatMini label="Донатов" value={user.purchasesCount || 0} />
        </div>
        {!canOpenStreamerPanel(user) && (
          <form className="modal-balance-form balance-editor" onSubmit={onBalanceSubmit}>
            <div className="balance-mode-row" role="group" aria-label="Режим изменения баланса">
              {Object.entries(modeMeta).map(([mode, meta]) => (
                <button
                  className={coinForm.mode === mode ? "active" : ""}
                  key={mode}
                  type="button"
                  onClick={() => setCoinForm({ ...coinForm, mode })}
                >
                  {meta.button}
                </button>
              ))}
            </div>
            <div className="balance-editor-card">
              <div>
                <strong>{activeMode.title}</strong>
                <span>{activeMode.hint}</span>
              </div>
              <input
                required
                type="number"
                min="0"
                value={coinForm.amount}
                onChange={(event) => setCoinForm({ ...coinForm, amount: event.target.value })}
                placeholder="Сумма"
              />
            </div>
            <label className="field">
              <span>Комментарий для логов</span>
              <input
                value={coinForm.reason}
                onChange={(event) => setCoinForm({ ...coinForm, reason: event.target.value })}
                placeholder="Бонус, компенсация, ручная правка"
              />
            </label>
            <ShinyButton className="primary-action compact" disabled={busy || !coinForm.amount}>
              <Coins size={16} />
              {activeMode.button}
            </ShinyButton>
          </form>
        )}
    </ModalFrame>
  );
}

function AdminDonations({ purchases }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Zap size={19} />
        <h2>Последние донаты</h2>
      </div>
      <div className="table-list">
        {purchases.length === 0 && <EmptyState icon={Zap} title="Донатов пока нет" text="Новые покупки команд появятся здесь." />}
        {purchases.map((purchase) => (
          <div className="admin-row donation-admin-row" key={purchase.id}>
            <div>
              <strong>{purchase.title}</strong>
              <span>
                {purchase.userName || "Зритель"} · {coinAmount(purchase.amount)} · {dateTime(purchase.createdAt)}
              </span>
              {purchase.errorMessage && <small className="row-error">{purchase.errorMessage}</small>}
            </div>
            <StatusPill status={purchase.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

function DeveloperPanel({ setMessage }) {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [commandLogs, setCommandLogs] = useState([]);
  const [roleForm, setRoleForm] = useState({ email: "", name: "", role: "streamer" });
  const [logFilters, setLogFilters] = useState({ source: "all", level: "all" });
  const [expandedDevice, setExpandedDevice] = useState("");
  const [busy, setBusy] = useState("");

  const suggestedUsers = useMemo(() => {
    const needle = roleForm.email.trim().toLowerCase();
    if (!needle) return users.slice(0, 6);
    return users
      .filter((user) => `${user.email || ""} ${user.name || ""}`.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [roleForm.email, users]);

  async function refresh() {
    const [nextUsers, nextDevices, nextSystemLogs, nextCommandLogs] = await Promise.all([
      api.developerUsers(),
      api.bridgeDevices(),
      api.developerLogs(logFilters),
      api.developerCommandLogs()
    ]);
    setUsers(nextUsers.users);
    setDevices(nextDevices.devices);
    setSystemLogs(nextSystemLogs.logs);
    setCommandLogs(nextCommandLogs.logs);
  }

  useEffect(() => {
    refresh().catch((err) => setMessage(err.message));
  }, [logFilters.source, logFilters.level]);

  async function assignRole(event) {
    event.preventDefault();
    setBusy("add-streamer");
    try {
      const result = await api.addStreamer(roleForm);
      setMessage(`Роль обновлена: ${roleTitle({ role: result.role, email: roleForm.email })}`);
      setRoleForm({ email: "", name: "", role: "streamer" });
      await refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy("");
    }
  }

  async function revokeDevice(device) {
    setBusy(`device:${device.id}`);
    try {
      await api.revokeBridgeDevice(device.id);
      setMessage("Bridge-устройство отвязано");
      await refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="grid admin-grid developer-grid">
      <section className="panel role-grant-panel">
        <div className="panel-title">
          <Shield size={19} />
          <h2>Выдать роль</h2>
        </div>
        <form className="developer-add-form role-grant-form" onSubmit={assignRole}>
          <label className="field">
            <span>Email Google</span>
            <input
              required
              type="email"
              list="developer-email-suggestions"
              value={roleForm.email}
              onChange={(event) => setRoleForm({ ...roleForm, email: event.target.value })}
              placeholder="user@gmail.com"
            />
            <datalist id="developer-email-suggestions">
              {users.map((user) => (
                <option key={user.id} value={user.email}>{user.name || roleTitle(user)}</option>
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Имя, если аккаунта еще нет</span>
            <input
              value={roleForm.name}
              onChange={(event) => setRoleForm({ ...roleForm, name: event.target.value })}
              placeholder="Можно оставить пустым"
            />
          </label>
          <label className="field">
            <span>Роль</span>
            <select value={roleForm.role} onChange={(event) => setRoleForm({ ...roleForm, role: event.target.value })}>
              <option value="user">Зритель</option>
              <option value="tester">Тестер</option>
              <option value="streamer">Стример</option>
              <option value="developer">Разработчик</option>
            </select>
          </label>
          <div className="role-suggestions" aria-label="Подсказки пользователей">
            {suggestedUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setRoleForm({ email: user.email, name: user.name || "", role: user.role || "user" })}
              >
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={16} />}
                <span>
                  <strong>{user.email}</strong>
                  <small>{user.name || "Без имени"} · {roleTitle(user)}</small>
                </span>
              </button>
            ))}
          </div>
          <ShinyButton className="primary-action compact" disabled={busy === "add-streamer"}>
            <Shield size={16} />
            Сохранить роль
          </ShinyButton>
        </form>
      </section>

      <section className="panel">
        <div className="panel-title">
          <Wifi size={19} />
          <h2>Bridge устройства</h2>
        </div>
        <div className="table-list">
          {devices.length === 0 && <EmptyState icon={WifiOff} title="Устройств нет" text="После логина мода устройства появятся здесь." />}
          {devices.map((device) => (
            <div className="admin-row" key={device.id}>
              <div>
                <strong>{device.name || "Minecraft"}</strong>
                <span>
                  {device.user_name || device.user_email} · {device.minecraft_version || "MC"} · {device.mod_version || "mod"} · {device.revoked_at ? "отвязано" : "активно"}
                </span>
                <small>Последний раз: {dateTime(device.last_seen_at || device.created_at)}</small>
                {expandedDevice === device.id && (
                  <div className="device-private-details">
                    <span>Компьютер: {device.computer_name || "не передан"}</span>
                    <span>ОС: {[device.os_name, device.os_version].filter(Boolean).join(" ") || "не передана"}</span>
                    <span>Java: {device.java_version || "не передана"}</span>
                    <span>Minecraft user: {device.minecraft_user || "не передан"}</span>
                    <span>Locale: {device.client_locale || "не передана"}</span>
                    <span>IP: {device.ip_address || "не передан"}</span>
                    <span>User-Agent: {device.user_agent || "не передан"}</span>
                  </div>
                )}
              </div>
              <div className="row-actions">
                <button className="secondary-action compact" type="button" onClick={() => setExpandedDevice(expandedDevice === device.id ? "" : device.id)}>
                  <Search size={15} />
                  {expandedDevice === device.id ? "Скрыть" : "Детали"}
                </button>
                <button className="icon-button danger" type="button" onClick={() => revokeDevice(device)} disabled={busy === `device:${device.id}` || Boolean(device.revoked_at)} title="Отвязать">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel developer-logs-panel console-panel">
        <div className="panel-title panel-title-split">
          <div>
            <Terminal size={19} />
            <h2>Системная консоль</h2>
          </div>
          <div className="log-filters">
            <select value={logFilters.source} onChange={(event) => setLogFilters({ ...logFilters, source: event.target.value })}>
              <option value="all">Все источники</option>
              <option value="developer.roles">Роли</option>
              <option value="streamer_panel">Баланс стримера</option>
              <option value="developer.bridge">Bridge</option>
            </select>
            <select value={logFilters.level} onChange={(event) => setLogFilters({ ...logFilters, level: event.target.value })}>
              <option value="all">Все уровни</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
            <button className="secondary-action compact" type="button" onClick={refresh} disabled={Boolean(busy)}>
              <RefreshCcw size={15} />
              Обновить
            </button>
          </div>
        </div>
        <div className="console-output" role="log" aria-label="Системные логи">
          {systemLogs.length === 0 && <EmptyState icon={Terminal} title="Логов нет" text="События появятся после действий в панели." />}
          {systemLogs.map((log) => (
            <div className={`console-line level-${log.level}`} key={log.id}>
              <span className="console-time">{dateTime(log.createdAt)}</span>
              <span className="console-level">{log.level}</span>
              <span className="console-source">{log.source}</span>
              <span className="console-actor">{log.userName || log.userEmail || "system"}</span>
              <strong>{log.message}</strong>
              <code>{JSON.stringify(log.metadata || {})}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="panel developer-logs-panel console-panel">
        <div className="panel-title panel-title-split">
          <div>
            <Zap size={19} />
            <h2>Консоль команд</h2>
          </div>
          <button className="secondary-action compact" type="button" onClick={refresh} disabled={Boolean(busy)}>
            <RefreshCcw size={15} />
            Обновить
          </button>
        </div>
        <div className="console-output" role="log" aria-label="Логи команд">
          {commandLogs.length === 0 && <EmptyState icon={Zap} title="Логов команд нет" text="Тесты и донаты появятся здесь после отправки в bridge." />}
          {commandLogs.map((log) => (
            <div className={`console-line level-${log.status === "failed" ? "error" : "info"}`} key={log.id}>
              <span className="console-time">{dateTime(log.createdAt)}</span>
              <span className="console-level">{log.status}</span>
              <span className="console-source">{log.source}</span>
              <span className="console-actor">{log.userName || "unknown"}</span>
              <strong>{log.actionTitle || "Команда"}</strong>
              {log.message && <small>{log.message}</small>}
              <code>{(log.commands || []).map((step) => step.command).join(" | ")}</code>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
