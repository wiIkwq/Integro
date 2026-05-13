import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BadgeCheck,
  Cable,
  CheckCircle2,
  CirclePlay,
  Clock3,
  Coins,
  Copy,
  EyeOff,
  Gamepad2,
  Gift,
  History,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Power,
  RefreshCcw,
  Shield,
  Sparkles,
  Terminal,
  Ticket,
  UserRound,
  Users,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";
import { api } from "./api";
import { AnimatedPanel, BalanceRing, ShinyButton, SpotlightCard, StatusDot } from "./components/Bits";
import "./styles.css";

const EMPTY_ACTION_FORM = {
  title: "",
  description: "",
  price: 100,
  cooldownSeconds: 0,
  command: "say {user} активировал интерактив"
};

const STATUS_META = {
  queued: { label: "В очереди", tone: "queued" },
  completed: { label: "Выполнено", tone: "completed" },
  failed: { label: "Ошибка", tone: "failed" },
  refunded: { label: "Возврат", tone: "refunded" }
};

const TRANSACTION_LABELS = {
  voucher_redeem: "Ваучер",
  action_purchase: "Команда",
  action_refund: "Возврат"
};

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function dateTime(value) {
  if (!value) return "без срока";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatCooldown(seconds) {
  const value = Number(seconds) || 0;
  if (value <= 0) return "без кулдауна";
  if (value < 60) return `${value} сек`;
  const minutes = Math.round(value / 60);
  return `${minutes} мин`;
}

function generateVoucherCode() {
  return `LIVE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function statusLabel(status) {
  return STATUS_META[status]?.label || status || "Нет статуса";
}

function transactionLabel(type) {
  return TRANSACTION_LABELS[type] || type || "Операция";
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || { label: status || "unknown", tone: "unknown" };
  return <span className={`pill pill-${meta.tone}`}>{meta.label}</span>;
}

function Notice({ notice }) {
  if (!notice?.text) return null;
  return <div className={`notice ${notice.tone || "info"}`}>{notice.text}</div>;
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
  const loginError = error === "oauth_not_configured"
    ? "Google OAuth еще не подключен на сервере."
    : error
      ? "Не удалось завершить вход. Попробуй еще раз."
      : "";

  return (
    <main className="login-shell">
      <SpotlightCard as="section" className="login-panel">
        <div className="brand-row brand-row-large">
          <div className="brand-mark">I</div>
          <span>Integro</span>
        </div>
        <span className="surface-tag">
          <Gamepad2 size={16} />
          Minecraft stream control
        </span>
        <h1>Пульт интерактива для стрима</h1>
        <p>Google вход, ваучерные coins и очередь Minecraft-команд для одного стримера.</p>
        <ShinyButton as="a" className="primary-action login-action" href={api.loginUrl()}>
          <UserRound size={18} />
          Войти через Google
        </ShinyButton>
        {loginError && <Notice notice={{ tone: "error", text: loginError }} />}
      </SpotlightCard>

      <section className="feature-strip" aria-label="Integro flow">
        <div>
          <KeyRound size={18} />
          <span>Вход</span>
        </div>
        <div>
          <Ticket size={18} />
          <span>Ваучер</span>
        </div>
        <div>
          <Zap size={18} />
          <span>Команда</span>
        </div>
      </section>
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
      <div className="boot">
        <Loader2 className="spin" size={22} />
        Загрузка Integro
      </div>
    );
  }

  if (!me) {
    return <LoginScreen />;
  }

  return (
    <Shell user={me} onLogout={logout} error={error}>
      {me.role === "admin" ? (
        <AdminDashboard user={me} onUserChange={setMe} />
      ) : (
        <UserDashboard user={me} onUserChange={setMe} />
      )}
    </Shell>
  );
}

function Shell({ user, onLogout, error, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-row">
            <div className="brand-mark">I</div>
            <span>Integro</span>
          </div>
          <small>Minecraft interactive</small>
        </div>
        <div className="topbar-right">
          <div className="balance-chip">
            <Coins size={16} />
            {money(user.balance)} coins
          </div>
          <div className="profile-chip">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={18} />}
            <span>{user.name || user.email}</span>
            {user.role === "admin" && <Shield size={15} />}
          </div>
          <button className="icon-button" type="button" onClick={onLogout} title="Выйти">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      {error && <div className="notice error shell-notice">{error}</div>}
      {children}
    </div>
  );
}

function UserDashboard({ user, onUserChange }) {
  const [actions, setActions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh(options = {}) {
    if (!options.silent) setLoading(true);
    try {
      const [me, nextActions, nextTransactions, nextPurchases] = await Promise.all([
        api.me(),
        api.actions(),
        api.transactions(),
        api.purchases()
      ]);
      onUserChange(me.user);
      setActions(nextActions.actions);
      setTransactions(nextTransactions.transactions);
      setPurchases(nextPurchases.purchases);
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
      setNotice({ tone: "success", text: `Начислено ${money(result.coins)} coins` });
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
      setNotice({ tone: "success", text: `${action.title} добавлено в Minecraft-очередь` });
      await refresh({ silent: true });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy("");
    }
  }

  const lastPurchase = purchases[0];
  const queuedCount = purchases.filter((purchase) => purchase.status === "queued").length;
  const completedCount = purchases.filter((purchase) => purchase.status === "completed").length;

  return (
    <main className="workspace">
      <section className="streamer-hero">
        <AnimatedPanel className="hero-copy">
          <p className="eyebrow">Viewer panel</p>
          <h1>Запусти событие в Minecraft</h1>
          <p>Баланс пополняется ваучером от стримера, команды уходят в очередь bridge.</p>
          <div className="hero-actions">
            <button className="secondary-action" onClick={() => refresh()} type="button" disabled={loading}>
              <RefreshCcw size={17} className={loading ? "spin" : ""} />
              Обновить
            </button>
          </div>
        </AnimatedPanel>

        <SpotlightCard className="balance-card">
          <BalanceRing value={user.balance} label="coins" />
          <div>
            <span>Текущий баланс</span>
            <strong>{money(user.balance)} coins</strong>
          </div>
        </SpotlightCard>

        <form className="voucher-card" onSubmit={redeem}>
          <div className="panel-title">
            <Gift size={19} />
            <h2>Ваучер</h2>
          </div>
          <div className="inline-form">
            <input
              value={voucher}
              onChange={(event) => setVoucher(event.target.value)}
              placeholder="LIVE-500"
              autoComplete="off"
              aria-label="Код ваучера"
            />
            <ShinyButton className="primary-action compact" disabled={!voucher.trim() || busy === "voucher"}>
              <Ticket size={17} />
              {busy === "voucher" ? "Проверяем" : "Активировать"}
            </ShinyButton>
          </div>
          <Notice notice={notice} />
        </form>
      </section>

      <section className="metrics user-metrics">
        <Metric icon={CirclePlay} label="Последняя команда" value={lastPurchase ? statusLabel(lastPurchase.status) : "Нет"} />
        <Metric icon={Activity} label="В очереди" value={queuedCount} />
        <Metric icon={CheckCircle2} label="Выполнено" value={completedCount} />
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Actions</p>
          <h2>Доступные действия</h2>
        </div>
      </section>

      <section className="actions-grid">
        {loading && actions.length === 0 && <SkeletonCards count={3} />}
        {!loading && actions.length === 0 && (
          <EmptyState icon={Sparkles} title="Нет доступных действий" text="Стример еще не добавил команды." />
        )}
        {actions.map((action, index) => {
          const lacksCoins = user.balance < action.price;
          const isBusy = busy === action.id;
          return (
            <SpotlightCard className="action-card" key={action.id} delay={index * 45}>
              <div>
                <div className="action-icon">
                  <Terminal size={20} />
                </div>
                <div className="action-top">
                  <h3>{action.title}</h3>
                  <span>{money(action.price)} coins</span>
                </div>
                <p>{action.description || "Minecraft команда от стримера"}</p>
              </div>
              <div className="action-footer">
                <span className="muted-line">
                  <Clock3 size={15} />
                  {formatCooldown(action.cooldownSeconds)}
                </span>
                <ShinyButton
                  className="primary-action compact action-run"
                  disabled={isBusy || lacksCoins}
                  onClick={() => buy(action)}
                  type="button"
                  title={lacksCoins ? "Недостаточно coins" : "Запустить команду"}
                >
                  <Zap size={17} />
                  {isBusy ? "Отправляем" : lacksCoins ? "Не хватает" : "Запустить"}
                </ShinyButton>
              </div>
            </SpotlightCard>
          );
        })}
      </section>

      <section className="grid two">
        <HistoryPanel transactions={transactions} />
        <PurchasesPanel purchases={purchases} />
      </section>
    </main>
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

function HistoryPanel({ transactions }) {
  return (
    <AnimatedPanel className="panel">
      <div className="panel-title">
        <History size={19} />
        <h2>История баланса</h2>
      </div>
      <div className="table-list">
        {transactions.length === 0 && (
          <EmptyState icon={History} title="Истории нет" text="Транзакции появятся здесь." />
        )}
        {transactions.map((row) => (
          <div className="list-row" key={row.id}>
            <div>
              <strong>{transactionLabel(row.type)}</strong>
              <span>{row.note ? `${row.note} · ${dateTime(row.createdAt)}` : dateTime(row.createdAt)}</span>
            </div>
            <b className={row.amount > 0 ? "positive" : "negative"}>
              {row.amount > 0 ? "+" : ""}
              {money(row.amount)}
            </b>
          </div>
        ))}
      </div>
    </AnimatedPanel>
  );
}

function PurchasesPanel({ purchases }) {
  return (
    <AnimatedPanel className="panel">
      <div className="panel-title">
        <Terminal size={19} />
        <h2>Команды</h2>
      </div>
      <div className="table-list">
        {purchases.length === 0 && (
          <EmptyState icon={Terminal} title="Команд нет" text="Купленные действия появятся здесь." />
        )}
        {purchases.map((row) => (
          <div className="list-row" key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <span>
                {money(row.amount)} coins · {dateTime(row.createdAt)}
              </span>
              {row.errorMessage && <small className="row-error">{row.errorMessage}</small>}
            </div>
            <StatusPill status={row.status} />
          </div>
        ))}
      </div>
    </AnimatedPanel>
  );
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
    { id: "actions", label: "Действия", icon: Terminal, count: actions.length },
    { id: "vouchers", label: "Ваучеры", icon: Ticket, count: vouchers.length },
    { id: "users", label: "Пользователи", icon: Users, count: users.length },
    { id: "queue", label: "Очередь", icon: Activity, count: purchases.length }
  ];

  return (
    <main className="workspace">
      <section className="control-hero">
        <AnimatedPanel>
          <p className="eyebrow">Streamer panel</p>
          <h1>Управление Minecraft интерактивом</h1>
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

      <section className="metrics">
        <Metric icon={Terminal} label="Действий" value={overview?.actionsCount || 0} />
        <Metric icon={Ticket} label="Ваучеров" value={overview?.vouchersCount || 0} />
        <Metric icon={UserRound} label="Юзеров" value={overview?.usersCount || 0} />
        <Metric
          icon={bridgeOnline ? Wifi : WifiOff}
          label="Bridge"
          value={bridgeOnline ? "online" : "offline"}
          tone={bridgeOnline ? "good" : "bad"}
          meta={`${overview?.bridge?.sockets || 0} socket`}
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

function Metric({ icon: Icon, label, value, meta, tone = "neutral" }) {
  return (
    <SpotlightCard as="div" className={`metric metric-${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      {meta && <small>{meta}</small>}
    </SpotlightCard>
  );
}

function AdminActions({ actions, refresh, setMessage }) {
  const [form, setForm] = useState(EMPTY_ACTION_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.createAction({
        ...form,
        price: Number(form.price),
        cooldownSeconds: Number(form.cooldownSeconds)
      });
      setForm(EMPTY_ACTION_FORM);
      setMessage("Действие создано");
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
      setMessage("Действие выключено");
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
          <h2>Новое действие</h2>
        </div>
        <label className="field">
          <span>Название</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Описание</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
          <span>Minecraft command</span>
          <textarea
            required
            className="mono"
            spellCheck="false"
            value={form.command}
            onChange={(e) => setForm({ ...form, command: e.target.value })}
          />
        </label>
        <ShinyButton className="primary-action compact" disabled={saving}>
          <BadgeCheck size={17} />
          {saving ? "Создаем" : "Создать"}
        </ShinyButton>
      </form>

      <section className="panel">
        <div className="panel-title">
          <Terminal size={19} />
          <h2>Действия</h2>
        </div>
        <div className="table-list">
          {actions.length === 0 && <EmptyState icon={Terminal} title="Действий нет" text="Создай первое действие для стрима." />}
          {actions.map((action) => (
            <div className="admin-row" key={action.id}>
              <div>
                <div className="row-title">
                  <strong>{action.title}</strong>
                  <span className={`state-badge ${action.isEnabled ? "on" : "off"}`}>
                    {action.isEnabled ? "active" : "disabled"}
                  </span>
                </div>
                <span>
                  {money(action.price)} coins · {formatCooldown(action.cooldownSeconds)}
                </span>
                <code>{action.command}</code>
              </div>
              <div className="row-actions">
                <button className="secondary-action compact" onClick={() => toggle(action)} type="button" disabled={busyId === action.id}>
                  <Power size={15} />
                  {action.isEnabled ? "Выключить" : "Включить"}
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => hideAction(action.id)}
                  type="button"
                  disabled={busyId === action.id}
                  title="Скрыть действие"
                >
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
  const [form, setForm] = useState({ code: "", coins: 500, maxRedemptions: 1, expiresAt: "" });
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
        expiresAt: form.expiresAt || null
      });
      setForm({ code: "", coins: 500, maxRedemptions: 1, expiresAt: "" });
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
        <label className="field">
          <span>Срок</span>
          <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </label>
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
                  <span className={`state-badge ${voucher.isActive ? "on" : "off"}`}>
                    {voucher.isActive ? "active" : "disabled"}
                  </span>
                </div>
                <span>
                  {money(voucher.coins)} coins · {voucher.redeemedCount}/{voucher.maxRedemptions}
                </span>
                <span>expires {dateTime(voucher.expiresAt)}</span>
              </div>
              <div className="row-actions">
                <button className="icon-button" type="button" onClick={() => copy(voucher.code)} title="Скопировать">
                  <Copy size={17} />
                </button>
                <button className="secondary-action compact" onClick={() => toggle(voucher)} type="button" disabled={busyId === voucher.id}>
                  <Power size={15} />
                  {voucher.isActive ? "Выключить" : "Включить"}
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
  return (
    <section className="panel">
      <div className="panel-title">
        <Users size={19} />
        <h2>Пользователи</h2>
      </div>
      <div className="table-list">
        {users.length === 0 && <EmptyState icon={Users} title="Пользователей нет" text="После входа зрители появятся здесь." />}
        {users.map((user) => (
          <div className="list-row" key={user.id}>
            <div className="user-line">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserRound size={20} />}
              <div>
                <strong>{user.name || user.email}</strong>
                <span>{user.email}</span>
              </div>
            </div>
            <b>{money(user.balance)} coins</b>
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
                {purchase.userName || purchase.userEmail} · {dateTime(purchase.createdAt)}
              </span>
              <code>{purchase.commandSnapshot}</code>
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
