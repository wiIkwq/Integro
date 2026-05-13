import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BadgeCheck,
  Cable,
  ChevronDown,
  Chrome,
  Coins,
  Copy,
  EyeOff,
  Gamepad2,
  Gift,
  Image,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Power,
  RefreshCcw,
  Shield,
  Shuffle,
  Sparkles,
  Terminal,
  Ticket,
  Trash2,
  Twitch,
  UserRound,
  Users,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";
import { api } from "./api";
import { AnimatedPanel, PixelSnow, ShinyButton, SpotlightCard, StatusDot } from "./components/Bits";
import "./styles.css";

const EMPTY_ACTION_FORM = {
  title: "",
  description: "",
  price: 100,
  commandsText: "say {user} активировал интерактив",
  commandMode: "sequence",
  repeatCount: 1,
  stepDelaySeconds: 0,
  repeatDelaySeconds: 0,
  cooldownSeconds: 0,
  bannerUrl: ""
};

const STATUS_META = {
  queued: { label: "В очереди", tone: "queued" },
  completed: { label: "Выполнено", tone: "completed" },
  failed: { label: "Ошибка", tone: "failed" },
  refunded: { label: "Возврат", tone: "refunded" }
};

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function dateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function secondsLabel(seconds) {
  const value = Number(seconds) || 0;
  if (value <= 0) return "";
  if (value < 60) return `${value} сек`;
  return `${Math.round(value / 60)} мин`;
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

function commandsFromText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function statusLabel(status) {
  return STATUS_META[status]?.label || status || "Нет статуса";
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
        {me.role === "admin" ? (
          <AdminDashboard onUserChange={setMe} />
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
          <div className="balance-chip">
            <Coins size={16} />
            {money(user.balance)} coins
          </div>
          <div className="profile-wrap">
            <button className="profile-chip" type="button" onClick={toggleProfile} aria-expanded={profileOpen}>
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={18} />}
              <span>{user.name || "Профиль"}</span>
              {user.role === "admin" && <Shield size={15} />}
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
          <span>{user.role === "admin" ? "Админ" : "Зритель"}</span>
        </div>
      </div>
      {error && <Notice notice={{ tone: "error", text: error }} />}
      {!stats && !error && (
        <div className="mini-loading">
          <Loader2 className="spin" size={16} />
          Загружаем статистику
        </div>
      )}
      {stats && (
        <div className="profile-stats-grid">
          <StatMini label="Баланс" value={`${money(stats.balance)} coins`} />
          <StatMini label="Пополнено" value={money(stats.totalReceived)} />
          <StatMini label="Потрачено" value={money(stats.totalSpent)} />
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
  const [voucher, setVoucher] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useAutoDismissNotice(notice, setNotice);

  async function refresh(options = {}) {
    if (!options.silent) setLoading(true);
    try {
      const [me, nextActions] = await Promise.all([api.me(), api.actions()]);
      onUserChange(me.user);
      setActions(nextActions.actions);
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
      setNotice({ tone: "success", text: `Ваучер активирован: +${money(result.coins)} coins` });
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

      <section className="actions-grid">
        {loading && actions.length === 0 && <SkeletonCards count={4} />}
        {!loading && actions.length === 0 && (
          <EmptyState icon={Sparkles} title="Команд пока нет" text="Стример еще не добавил действия." />
        )}
        {actions.map((action, index) => {
          const lacksCoins = user.balance < action.price;
          const isBusy = busy === action.id;
          return (
            <ActionCard
              action={action}
              index={index}
              key={action.id}
              disabled={isBusy || lacksCoins}
              buttonText={isBusy ? "Отправляем" : lacksCoins ? "Не хватает coins" : "Запустить"}
              onClick={() => buy(action)}
            />
          );
        })}
      </section>
    </main>
  );
}

function ActionCard({ action, index = 0, disabled, buttonText, onClick }) {
  const bannerStyle = action.bannerUrl ? { backgroundImage: `url(${action.bannerUrl})` } : undefined;
  const details = [
    action.commandCount > 1 ? `${action.commandCount} команд` : "1 команда",
    action.commandMode === "random" ? "рандом" : "",
    action.repeatCount > 1 ? `x${action.repeatCount}` : ""
  ].filter(Boolean);

  return (
    <SpotlightCard className="action-card" delay={index * 35}>
      <div className={`action-banner ${action.bannerUrl ? "has-image" : ""}`} style={bannerStyle}>
        {!action.bannerUrl && <Gamepad2 size={32} />}
      </div>
      <div className="action-body">
        <div className="action-top">
          <h3>{action.title}</h3>
          <span>{money(action.price)} coins</span>
        </div>
        {action.description && <p>{action.description}</p>}
        <div className="action-meta">
          {details.map((item) => <span key={item}>{item}</span>)}
          {action.cooldownSeconds > 0 && <span>{secondsLabel(action.cooldownSeconds)}</span>}
        </div>
      </div>
      <ShinyButton className="primary-action action-run" disabled={disabled} onClick={onClick} type="button">
        <Zap size={17} />
        {buttonText}
      </ShinyButton>
    </SpotlightCard>
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

function AdminDashboard({ onUserChange }) {
  const [tab, setTab] = useState("actions");
  const [actions, setActions] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bridgeBusy, setBridgeBusy] = useState(false);

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

  async function flushBridge() {
    setBridgeBusy(true);
    setMessage("");
    try {
      const result = await api.flushBridge();
      setMessage(`Отправлено в bridge: ${result.sent || 0}`);
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBridgeBusy(false);
    }
  }

  const bridgeOnline = Boolean(overview?.bridge?.connected);
  const tabs = [
    { id: "actions", label: "Команды", icon: Terminal, count: actions.length },
    { id: "vouchers", label: "Ваучеры", icon: Ticket, count: vouchers.length },
    { id: "users", label: "Пользователи", icon: Users, count: users.length },
    { id: "queue", label: "Очередь", icon: Activity, count: purchases.length }
  ];

  return (
    <main className="workspace">
      <section className="admin-hero">
        <AnimatedPanel>
          <h1>Панель стримера</h1>
          <div className="status-row">
            <StatusDot online={bridgeOnline} label={bridgeOnline ? "Bridge online" : "Bridge offline"} />
            <span>{overview?.bridge?.queued || 0} в очереди</span>
          </div>
        </AnimatedPanel>
        <div className="hero-actions">
          <button className="secondary-action" onClick={() => refresh()} type="button" disabled={loading}>
            <RefreshCcw size={17} className={loading ? "spin" : ""} />
            Обновить
          </button>
          <ShinyButton
            className="primary-action"
            onClick={flushBridge}
            type="button"
            disabled={bridgeBusy || !bridgeOnline}
            title={bridgeOnline ? "Повторно отправить очередь" : "Bridge не подключен"}
          >
            <Cable size={17} />
            {bridgeBusy ? "Отправляем" : "Flush queue"}
          </ShinyButton>
        </div>
      </section>

      <section className="metrics metrics-wide">
        <Metric icon={Coins} label="Получено" value={money(overview?.totalReceived || 0)} />
        <Metric icon={Zap} label="Потрачено" value={money(overview?.totalSpent || 0)} />
        <Metric icon={Ticket} label="Активаций" value={overview?.voucherRedemptionsCount || 0} />
        <Metric icon={Terminal} label="Команд куплено" value={overview?.purchasesCount || 0} />
        <Metric icon={Users} label="Пользователей" value={overview?.usersCount || 0} />
        <Metric
          icon={bridgeOnline ? Wifi : WifiOff}
          label="Bridge"
          value={bridgeOnline ? "online" : "offline"}
          tone={bridgeOnline ? "good" : "bad"}
        />
      </section>

      {message && <div className="notice info">{message}</div>}

      <nav className="tabs" aria-label="Admin sections">
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
      {tab === "users" && <AdminUsers users={users} />}
      {tab === "queue" && <AdminQueue purchases={purchases} />}
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
  const [form, setForm] = useState(EMPTY_ACTION_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const commandLines = useMemo(() => commandsFromText(form.commandsText).length, [form.commandsText]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.createAction({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        commands: commandsFromText(form.commandsText),
        commandMode: form.commandMode,
        repeatCount: Number(form.repeatCount),
        stepDelayMs: Number(form.stepDelaySeconds) * 1000,
        repeatDelayMs: Number(form.repeatDelaySeconds) * 1000,
        cooldownSeconds: Number(form.cooldownSeconds),
        bannerUrl: form.bannerUrl
      });
      setForm(EMPTY_ACTION_FORM);
      setMessage("Команда создана");
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

  async function hideAction(id) {
    setBusyId(id);
    setMessage("");
    try {
      await api.deleteAction(id);
      setMessage("Команда выключена");
      await refresh({ silent: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="grid admin-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="panel-title">
          <Plus size={19} />
          <h2>Новая команда</h2>
        </div>
        <label className="field">
          <span>Название</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Описание</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="field">
          <span>Баннер URL</span>
          <div className="input-icon">
            <Image size={16} />
            <input value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} placeholder="https://..." />
          </div>
        </label>
        <div className="split-inputs">
          <label className="field">
            <span>Цена</span>
            <input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label className="field">
            <span>Кулдаун, сек</span>
            <input type="number" min="0" value={form.cooldownSeconds} onChange={(e) => setForm({ ...form, cooldownSeconds: e.target.value })} />
          </label>
        </div>
        <label className="field">
          <span>Команды Minecraft</span>
          <textarea
            required
            className="mono command-input"
            spellCheck="false"
            value={form.commandsText}
            onChange={(e) => setForm({ ...form, commandsText: e.target.value })}
          />
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
        <div className="split-inputs">
          <label className="field">
            <span>Повторы</span>
            <input required type="number" min="1" max="20" value={form.repeatCount} onChange={(e) => setForm({ ...form, repeatCount: e.target.value })} />
          </label>
          <label className="field">
            <span>Между командами, сек</span>
            <input type="number" min="0" value={form.stepDelaySeconds} onChange={(e) => setForm({ ...form, stepDelaySeconds: e.target.value })} />
          </label>
        </div>
        <label className="field">
          <span>Между повторами, сек</span>
          <input type="number" min="0" value={form.repeatDelaySeconds} onChange={(e) => setForm({ ...form, repeatDelaySeconds: e.target.value })} />
        </label>
        <div className="form-foot">
          <span>{commandLines || 0} строк</span>
          <ShinyButton className="primary-action compact" disabled={saving}>
            <BadgeCheck size={17} />
            {saving ? "Создаем" : "Создать"}
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
                      {action.isEnabled ? "active" : "disabled"}
                    </span>
                  </div>
                  <span>
                    {money(action.price)} coins · {action.commandCount} команд · {action.commandMode === "random" ? "рандом" : "по очереди"}
                    {action.repeatCount > 1 ? ` · x${action.repeatCount}` : ""}
                  </span>
                  <code>{(action.commands || [action.command]).join(" | ")}</code>
                </div>
              </div>
              <div className="row-actions">
                <button className="secondary-action compact" onClick={() => toggle(action)} type="button" disabled={busyId === action.id}>
                  <Power size={15} />
                  {action.isEnabled ? "Выключить" : "Включить"}
                </button>
                <button className="icon-button danger" onClick={() => hideAction(action.id)} type="button" disabled={busyId === action.id} title="Скрыть">
                  <EyeOff size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function AdminVouchers({ vouchers, refresh, setMessage }) {
  const [form, setForm] = useState({ code: "", coins: 500, maxRedemptions: 1 });
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
        maxRedemptions: Number(form.maxRedemptions)
      });
      setForm({ code: "", coins: 500, maxRedemptions: 1 });
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
            <span>Coins</span>
            <input required type="number" min="1" value={form.coins} onChange={(e) => setForm({ ...form, coins: e.target.value })} />
          </label>
          <label className="field">
            <span>Активаций</span>
            <input required type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
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
                    {voucher.isUsed ? "использован" : voucher.isActive ? "active" : "disabled"}
                  </span>
                </div>
                <span>
                  {money(voucher.coins)} coins · {voucher.redeemedCount}/{voucher.maxRedemptions}
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
                  disabled={busyId === voucher.id || !voucher.canDelete}
                  title={voucher.canDelete ? "Удалить ваучер" : "Удаление доступно после всех активаций"}
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

function AdminUsers({ users }) {
  const totals = users.reduce((acc, user) => ({
    balance: acc.balance + (user.balance || 0),
    received: acc.received + (user.totalReceived || 0),
    spent: acc.spent + (user.totalSpent || 0),
    commands: acc.commands + (user.purchasesCount || 0)
  }), { balance: 0, received: 0, spent: 0, commands: 0 });

  return (
    <section className="panel">
      <div className="panel-title">
        <Users size={19} />
        <h2>Пользователи</h2>
      </div>
      <div className="stats-strip">
        <StatMini label="Баланс в сумме" value={`${money(totals.balance)} coins`} />
        <StatMini label="Получено" value={money(totals.received)} />
        <StatMini label="Потрачено" value={money(totals.spent)} />
        <StatMini label="Команд" value={totals.commands} />
      </div>
      <div className="table-list">
        {users.length === 0 && <EmptyState icon={Users} title="Пользователей нет" text="После входа зрители появятся здесь." />}
        {users.map((user) => (
          <div className="user-row" key={user.id}>
            <div className="user-line">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={20} />}
              <div>
                <strong>{user.name || "Зритель"}</strong>
                <span>{user.role === "admin" ? "Админ" : "Зритель"}</span>
              </div>
            </div>
            <div className="user-stats">
              <StatMini label="Баланс" value={`${money(user.balance)} coins`} />
              <StatMini label="Получено" value={money(user.totalReceived)} />
              <StatMini label="Потрачено" value={money(user.totalSpent)} />
              <StatMini label="Команд" value={user.purchasesCount || 0} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminQueue({ purchases }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <LayoutDashboard size={19} />
        <h2>Очередь команд</h2>
      </div>
      <div className="table-list">
        {purchases.length === 0 && <EmptyState icon={Activity} title="Очередь пустая" text="Новые команды появятся здесь." />}
        {purchases.map((purchase) => (
          <div className="admin-row" key={purchase.id}>
            <div>
              <strong>{purchase.title}</strong>
              <span>
                {purchase.userName || "Зритель"} · {dateTime(purchase.createdAt)}
              </span>
              <code>{purchase.commandSummary || purchase.commandSnapshot}</code>
              {purchase.errorMessage && <small className="row-error">{purchase.errorMessage}</small>}
            </div>
            <StatusPill status={purchase.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
