# QuarrySwap — Emergency Spare Parts Swap Board

A mobile-first prototype for isolated quarry clusters. The product reduces breakdown time by moving the emergency workflow from **call + guesswork** to:

**Request → Match → Verify → Claim → Handoff → Resolve**

## Scope deliberately limited to two part families

1. Hydraulic hoses
2. Bearings

This is intentional. The compatibility engine uses transparent specification checks rather than an arbitrary "AI compatibility percentage".

### Result meanings

- 🟢 **MEETS ENTERED REQUIREMENTS** — every supported mandatory requirement entered for the request is satisfied by the inventory record.
- 🟡 **REQUIRES VERIFICATION** — no known hard failure, but required engineering/application information is missing.
- 🔴 **DOES NOT MEET REQUIREMENT** — a known requirement fails.

The prototype does not certify a part as safe. Final suitability must be verified against machine/system documentation and by the responsible technician/manufacturer requirements.

## Demo

The application starts with fictional mock sites and inventory:

- Deccan Quarry A — Medchal
- Granite Works B — Shamshabad
- Telangana Aggregates C — Nalgonda

The data is explicitly fictional for demonstration.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Deployment

The app is a Vite static frontend and can be deployed on Vercel, Netlify, or similar free-tier static hosting.

No paid API is required. The default demo uses browser localStorage so the judging flow works immediately after deployment.

## Optional Supabase

The repository includes a PostgreSQL schema/seed under `supabase/`. Supabase environment variables are provided for future multi-device persistence, but the core prototype intentionally remains usable without a backend.

## Key engineering decision

The compatibility engine is deterministic and explainable:

### Hydraulic hose
Checks, when the request provides them:
- inside diameter / size
- pressure capacity (available must meet or exceed required)
- maximum temperature
- fluid
- application
- end connections
- optional stated flow capacity

### Bearing
Checks, when the request provides them:
- bearing designation/type
- bore
- outside diameter
- width
- dynamic/static load information when entered
- lubrication
- clearance
- sealing
- mounting/fit
- application

Missing information produces verification warnings rather than optimistic compatibility.

## Evidence basis

The rule structure follows manufacturer-style selection considerations rather than a made-up score. See `docs/compatibility-rules.md`.

## Product trade-offs

See `TRADEOFFS.md`.
