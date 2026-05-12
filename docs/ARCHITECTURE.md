# Architecture

## Core Flow

1. User signs in with Google.
2. Streamer/admin creates vouchers and Minecraft actions.
3. User redeems a voucher and receives coins.
4. User buys an enabled Minecraft action.
5. API atomically deducts coins and creates a queued purchase.
6. Durable Object sends the purchase command to the connected Minecraft bridge.
7. Paper plugin executes the command and returns a status.
8. API records `completed` or `failed`. Failed commands refund coins.

## Runtime Boundaries

- `apps/web`: static Cloudflare Pages app.
- `apps/api`: Cloudflare Worker, D1 database, Durable Object bridge.
- `apps/minecraft-plugin`: Paper plugin that runs on the Minecraft server, not on Cloudflare.

## Security Rules

- Admin access is Google-only and controlled by `ADMIN_GOOGLE_EMAILS`.
- Viewers use Google login.
- Bridge access requires `BRIDGE_TOKEN`.
- Balance changes are recorded in `balance_transactions`.
- User actions never trust client-side prices or commands.
