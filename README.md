# Lattice402

> Intelligence agents can buy one request at a time.

Lattice402 is a pay-per-signal intelligence API for AI agents and crypto creators. It packages research as structured claims with sources, confidence, material changes, creator angles and a deterministic provenance hash. The production payment route is designed for x402 exact-scheme USDC settlement on Algorand Mainnet through the GoPlausible facilitator.

## Current status

This repository is an honest MVP in **demo mode**:

- `POST /api/signals/preview` returns deterministic fixture-backed intelligence packets.
- Preview requests do **not** create payments, transactions, volume or leaderboard activity.
- `POST /api/signals/research` fails closed with HTTP 503 until a merchant `AVM_ADDRESS` and verified settlement middleware are configured.
- The dashboard shows zero settled transactions rather than fabricated activity.

Do not represent the preview route as a live paid Mainnet endpoint.

## Stack

- React 19 + Vite
- Hono API
- Official `@x402/core`, `@x402/avm`, `@x402/hono`, and `@x402/extensions`
- Algorand Mainnet USDC ASA `31566704`
- GoPlausible facilitator: `https://facilitator.goplausible.xyz`
- Zod validation, Vitest, Testing Library

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4021` and Vite proxies `/api` requests.

## Commands

```bash
npm run dev        # API + UI
npm test           # all tests
npm run typecheck  # TypeScript project checks
npm run lint       # oxlint
npm run build      # production UI build
npm run check      # complete quality gate
```

## API

| Method | Route | Status |
|---|---|---|
| GET | `/api/health` | Runtime/payment readiness |
| GET | `/api/config` | Public x402 configuration |
| GET | `/api/metrics` | Truthful zero-state metrics |
| GET | `/api/transactions` | Settlements only; previews excluded |
| POST | `/api/signals/preview` | Free deterministic demonstration |
| POST | `/api/signals/research` | Fail-closed production payment route |

Preview request:

```bash
curl -s http://localhost:4021/api/signals/preview \
  -H 'content-type: application/json' \
  -d '{"subject":"Algorand x402","intent":"creator-brief","freshness":"24h"}'
```

## Intended x402 flow

```text
Agent → protected HTTP resource → 402 payment-required
      → signed Algorand USDC proof → GoPlausible verify/settle
      → verified settlement → evidence packet + provenance hash
```

Production requirements before enabling `/api/signals/research`:

1. Configure a dedicated Mainnet merchant address in `AVM_ADDRESS`.
2. Ensure the merchant is opted into Mainnet USDC and meets Algorand minimum balance requirements.
3. Register the official AVM exact server scheme.
4. Add x402 Hono payment middleware using GoPlausible.
5. Confirm replay/idempotency behavior and verify real transaction IDs on-chain.
6. Add type-safe Bazaar discovery metadata.
7. Persist payment/request audit records without secrets.
8. Test TestNet end-to-end before Mainnet.

## Architecture

```text
src/domain/       request validation, fixtures, packet hashing
src/server/       Hono routes and public payment configuration
src/App.tsx       research playground and dashboard
src/App.css       responsive candy-fintech design system
```

The packet hash excludes random request IDs and generation timestamps, so equivalent normalized inputs over the same evidence fixture produce the same SHA-256 provenance fingerprint.

## Safety

- Never commit a mnemonic, private key, wallet export or production `.env`.
- A resource server needs only the public `payTo` address; clients sign through a wallet/KMS path.
- Never fabricate settlement IDs or leaderboard volume.
- Do not enable the paid route until middleware verifies and settles through GoPlausible.

## Roadmap

- Live source ingestion and snapshot storage
- Type-safe Bazaar integration
- TestNet wallet client and full x402 retry flow
- Mainnet paid research route
- MCP tool surface
- Public settlement/receipt dashboard
- Multi-provider atomic intelligence packets

## License

MIT
