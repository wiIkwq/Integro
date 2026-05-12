import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  BadgeCheck,
  Cable,
  Coins,
  Copy,
  Gift,
  History,
  LogOut,
  Plus,
  RefreshCcw,
  Shield,
  Sparkles,
  Terminal,
  Ticket,
  Trash2,
  UserRound
} from "lucide-react";
import { api } from "./api";
import "./styles.css";

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value || 0);
}

function dateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function StatusPill({ status }) {
  return <span className={`pill pill-${status}`}>{status}</span>;
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty">
      <Icon size={28} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function LoginScreen() {
  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand-row">
          <div className="brand-mark">I</div>
          <span>Integro</span>
        </div>
        <h1>Minecraft команды за ваучерные монеты</h1>
        <p>
          Войди через Google, активируй ваучер от стримера и запускай игровые
          действия прямо во время стрима.
        </p>
        <a className="primary-action" href={api.loginUrl()}>
          <UserRound size={18} />
          Войти через Google
        </a>
      </section>
      <section className="feature-strip">
        <div>
          <Ticket size={18} />
          <span>Ваучеры</span>
        </div>
        <div>
          <Coins size={18} />
          <span>Баланс</span>
        </div>
        <div>
          <Terminal size={18} />
          <span>Minecraft</span>
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
    return <div className="boot">Загрузка Integro…</div>;
  }

  if (!me) {
    return <LoginScreen />;
  }

  return (
    <Shell user={me} onLogout={logout} error={error}>
      {me.role === "admin" ? <AdminDashboard onUserChange={setMe} /> : <UserDashboard onUserChange={setMe} />}
    </Shell>
  );
}

function Shell({ user, onLogout, error, children }) {
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
      {error && <div className="notice error">{error}</div>}
      {children}
    </div>
  );
}

function UserDashboard({ onUserChange }) {
  const [actions, setActions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function refresh() {
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
  }

  useEffect(() => {
    refresh().catch((err) => setMessage(err.message));
  }, []);

  async function redeem(event) {
    event.preventDefault();
    setBusy("voucher");
    setMessage("");
    try {
      const result = await api.redeemVoucher(voucher);
      setMessage(`Начислено ${money(result.coins)} coins`);
      setVoucher("");
      await refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy("");
    }
  }

  async function buy(id) {
    setBusy(id);
    setMessage("");
    try {
      await api.buyAction(id);
      setMessage("Команда добавлена в очередь");
      await refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="workspace">
      <section className="page-head">
        <div>
          <p className="eyebrow">Viewer panel</p>
          <h1>Выбери действие для Minecraft</h1>
        </div>
        <button className="secondary-action" onClick={refresh} type="button">
          <RefreshCcw size={17} />
          Обновить
        </button>
      </section>

      <section className="grid two">
        <form className="panel" onSubmit={redeem}>
          <div className="panel-title">
            <Gift size={19} />
            <h2>Активировать ваучер</h2>
          </div>
          <div className="inline-form">
            <input
              value={voucher}
              onChange={(event) => setVoucher(event.target.value)}
              placeholder="Например: LIVE-500"
              autoComplete="off"
            />
            <button className="primary-action compact" disabled={!voucher || busy === "voucher"}>
              <Ticket size={17} />
              Активировать
            </button>
          </div>
          {message && <div className="notice">{message}</div>}
        </form>

        <section className="panel stat-panel">
          <div>
            <p className="eyebrow">Последний статус</p>
            <h2>{purchases[0]?.status || "Пока пусто"}</h2>
          </div>
          <Activity size={34} />
        </section>
      </section>

      <section className="actions-grid">
        {actions.length === 0 && (
          <EmptyState icon={Sparkles} title="Нет доступных действий" text="Стример еще не добавил команды." />
        )}
        {actions.map((action) => (
          <article className="action-card" key={action.id}>
            <div>
              <div className="action-top">
                <h3>{action.title}</h3>
                <span>{money(action.price)} coins</span>
              </div>
              <p>{action.description || "Minecraft команда от стримера"}</p>
            </div>
            <button className="primary-action compact" disabled={busy === action.id} onClick={() => buy(action.id)}>
              <Terminal size={17} />
              Запустить
            </button>
          </article>
        ))}
      </section>

      <section className="grid two">
        <HistoryPanel transactions={transactions} />
        <PurchasesPanel purchases={purchases} />
      </section>
    </main>
  );
}

function HistoryPanel({ transactions }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <History size={19} />
        <h2>История баланса</h2>
      </div>
      <div className="table-list">
        {transactions.length === 0 && <EmptyState icon={History} title="Истории нет" text="Транзакции появятся здесь." />}
        {transactions.map((row) => (
          <div className="list-row" key={row.id}>
            <div>
              <strong>{row.type}</strong>
              <span>{dateTime(row.createdAt)}</span>
            </div>
            <b className={row.amount > 0 ? "positive" : "negative"}>{row.amount > 0 ? "+" : ""}{money(row.amount)}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function PurchasesPanel({ purchases }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Terminal size={19} />
        <h2>Команды</h2>
      </div>
      <div className="table-list">
        {purchases.length === 0 && <EmptyState icon={Terminal} title="Команд нет" text="Купленные действия появятся здесь." />}
        {purchases.map((row) => (
          <div className="list-row" key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <span>{dateTime(row.createdAt)}</span>
            </div>
            <StatusPill status={row.status} />
          </div>
        ))}
      </div>
    </section>
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

  async function refresh() {
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
  }

  useEffect(() => {
    refresh().catch((err) => setMessage(err.message));
  }, []);

  const tabs = [
    ["actions", "Действия"],
    ["vouchers", "Ваучеры"],
    ["users", "Пользователи"],
    ["queue", "Очередь"]
  ];

  return (
    <main className="workspace">
      <section className="page-head">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1>Управление Minecraft интерактивом</h1>
        </div>
        <button className="secondary-action" onClick={refresh} type="button">
          <RefreshCcw size={17} />
          Обновить
        </button>
      </section>

      <section className="metrics">
        <Metric icon={Terminal} label="Действий" value={overview?.actionsCount || 0} />
        <Metric icon={Ticket} label="Ваучеров" value={overview?.vouchersCount || 0} />
        <Metric icon={UserRound} label="Юзеров" value={overview?.usersCount || 0} />
        <Metric icon={Cable} label="Bridge" value={overview?.bridge?.connected ? "online" : "offline"} />
      </section>

      {message && <div className="notice">{message}</div>}

      <nav className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} type="button">
            {label}
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

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AdminActions({ actions, refresh, setMessage }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 100,
    cooldownSeconds: 0,
    command: "say {user} triggered an Integro action"
  });

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.createAction({
        ...form,
        price: Number(form.price),
        cooldownSeconds: Number(form.cooldownSeconds)
      });
      setForm({ title: "", description: "", price: 100, cooldownSeconds: 0, command: "say {user} triggered an Integro action" });
      await refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function toggle(action) {
    await api.updateAction(action.id, { isEnabled: !action.isEnabled });
    await refresh();
  }

  async function remove(id) {
    await api.deleteAction(id);
    await refresh();
  }

  return (
    <section className="grid admin-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="panel-title">
          <Plus size={19} />
          <h2>Новое действие</h2>
        </div>
        <input required placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="split-inputs">
          <input required type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" min="0" value={form.cooldownSeconds} onChange={(e) => setForm({ ...form, cooldownSeconds: e.target.value })} />
        </div>
        <textarea required className="mono" value={form.command} onChange={(e) => setForm({ ...form, command: e.target.value })} />
        <button className="primary-action compact">
          <BadgeCheck size={17} />
          Создать
        </button>
      </form>

      <section className="panel">
        <div className="panel-title">
          <Terminal size={19} />
          <h2>Действия</h2>
        </div>
        <div className="table-list">
          {actions.map((action) => (
            <div className="admin-row" key={action.id}>
              <div>
                <strong>{action.title}</strong>
                <span>{money(action.price)} coins · cooldown {action.cooldownSeconds}s</span>
                <code>{action.command}</code>
              </div>
              <div className="row-actions">
                <button className="secondary-action compact" onClick={() => toggle(action)} type="button">
                  {action.isEnabled ? "Выключить" : "Включить"}
                </button>
                <button className="icon-button danger" onClick={() => remove(action.id)} type="button" title="Удалить">
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

function AdminVouchers({ vouchers, refresh, setMessage }) {
  const [form, setForm] = useState({ code: "", coins: 500, maxRedemptions: 1, expiresAt: "" });

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.createVoucher({
        code: form.code,
        coins: Number(form.coins),
        maxRedemptions: Number(form.maxRedemptions),
        expiresAt: form.expiresAt || null
      });
      setForm({ code: "", coins: 500, maxRedemptions: 1, expiresAt: "" });
      await refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function copy(value) {
    await navigator.clipboard.writeText(value);
    setMessage("Код скопирован");
  }

  async function toggle(voucher) {
    await api.updateVoucher(voucher.id, { isActive: !voucher.isActive });
    await refresh();
  }

  const generatedCode = useMemo(() => `LIVE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, []);

  return (
    <section className="grid admin-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="panel-title">
          <Ticket size={19} />
          <h2>Новый ваучер</h2>
        </div>
        <input required placeholder={generatedCode} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <div className="split-inputs">
          <input required type="number" min="1" value={form.coins} onChange={(e) => setForm({ ...form, coins: e.target.value })} />
          <input required type="number" min="1" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })} />
        </div>
        <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        <button className="primary-action compact">
          <Plus size={17} />
          Создать
        </button>
      </form>

      <section className="panel">
        <div className="panel-title">
          <Gift size={19} />
          <h2>Ваучеры</h2>
        </div>
        <div className="table-list">
          {vouchers.map((voucher) => (
            <div className="admin-row" key={voucher.id}>
              <div>
                <strong>{voucher.code}</strong>
                <span>
                  {money(voucher.coins)} coins · {voucher.redeemedCount}/{voucher.maxRedemptions}
                </span>
                <span>{voucher.isActive ? "active" : "disabled"} · expires {dateTime(voucher.expiresAt)}</span>
              </div>
              <div className="row-actions">
                <button className="icon-button" type="button" onClick={() => copy(voucher.code)} title="Скопировать">
                  <Copy size={17} />
                </button>
                <button className="secondary-action compact" onClick={() => toggle(voucher)} type="button">
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
        <UserRound size={19} />
        <h2>Пользователи</h2>
      </div>
      <div className="table-list">
        {users.map((user) => (
          <div className="list-row" key={user.id}>
            <div>
              <strong>{user.name || user.email}</strong>
              <span>{user.email}</span>
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
        <Activity size={19} />
        <h2>Очередь команд</h2>
      </div>
      <div className="table-list">
        {purchases.map((purchase) => (
          <div className="admin-row" key={purchase.id}>
            <div>
              <strong>{purchase.title}</strong>
              <span>{purchase.userName || purchase.userEmail} · {dateTime(purchase.createdAt)}</span>
              <code>{purchase.commandSnapshot}</code>
            </div>
            <StatusPill status={purchase.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
