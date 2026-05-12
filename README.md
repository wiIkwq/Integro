# Integro

Personal Minecraft interaction platform for one streamer.

Viewers sign in with Google, redeem streamer-issued vouchers, receive coins, and spend those coins on Minecraft actions. A Paper plugin keeps a WebSocket bridge to the Cloudflare Worker and executes queued commands on the Minecraft server.

## Stack

- Web: React + Vite
- API: Cloudflare Workers + Hono
- Database: Cloudflare D1
- Realtime bridge: Cloudflare Durable Objects WebSocket
- Minecraft: Java Paper plugin

## Local Setup

```bash
npm install
cp apps/api/.dev.vars.example apps/api/.dev.vars
npm run dev:api
npm run dev:web
```

Create a local D1 database before using the API locally:

```bash
npm --workspace apps/api run db:apply:local
```

## Required Cloudflare Secrets

Set these for the API Worker:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID --cwd apps/api
npx wrangler secret put GOOGLE_CLIENT_SECRET --cwd apps/api
npx wrangler secret put SESSION_SECRET --cwd apps/api
npx wrangler secret put BRIDGE_TOKEN --cwd apps/api
```

`ADMIN_GOOGLE_EMAILS`, `WEB_ORIGIN`, and `API_ORIGIN` are normal Worker vars in `apps/api/wrangler.jsonc`.

## First Deploy

```bash
npm --workspace apps/api run db:create
npm --workspace apps/api run db:apply:remote
npm run deploy:api
npm --workspace apps/web run build
npm run deploy:web
```

After the Worker URL is known, set `VITE_API_BASE` for Pages to the Worker origin.
