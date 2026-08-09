# CBDC Clearing Engine

An institutional simulation platform for cross-border central bank digital currency (CBDC) clearing and settlement optimization.

## What it includes

- Live CBDC network topology for seven currencies
- Dijkstra-based settlement route optimization
- FX risk monitoring and heatmap analysis
- Liquidity pool tracking and injection controls
- Monte Carlo stress testing
- Blockchain-inspired settlement ledger with chained hashes
- Express API backed by PostgreSQL

## Prerequisites

- Node.js 24 or newer
- pnpm 10 or newer
- PostgreSQL

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set the database connection string:

   ```bash
   export DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

   A reference template is available in `.env.example`. Do not commit real credentials.

3. Apply the database schema:

   ```bash
   pnpm --filter @workspace/db run push
   ```

4. Optional: populate the local database with the included demo dataset:

   ```bash
   pnpm --filter @workspace/db run seed
   ```

   This resets the demo tables before inserting the sample network, risk, liquidity, transaction, activity, and stress-test data. Do not run it against a database containing data you need to preserve.

5. Start the API server and dashboard in separate terminals:

   ```bash
   pnpm --filter @workspace/api-server run dev
   pnpm --filter @workspace/cbdc-dashboard run dev
   ```

## Validation

Run the full TypeScript check:

```bash
pnpm run typecheck
```

Build the dashboard:

```bash
pnpm --filter @workspace/cbdc-dashboard run build
```

## Repository structure

- `artifacts/cbdc-dashboard` — React/Vite dashboard
- `artifacts/api-server` — Express API
- `lib/api-spec` — OpenAPI contract
- `lib/api-client-react` — generated React Query client
- `lib/api-zod` — generated validation schemas
- `lib/db` — Drizzle schema and database package

The dashboard expects a populated PostgreSQL database for the full simulation experience. Database credentials and live data are intentionally not stored in this repository.
