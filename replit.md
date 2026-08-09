# CBDC Clearing Engine

An enterprise-grade simulation platform for Cross-Border CBDC Clearing and Settlement Optimization. Simulates Bloomberg Terminal-style institutional fintech infrastructure for central banks, regulators, and financial institutions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cbdc-dashboard run dev` — run the frontend (port 18812)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS (dark theme) + D3.js + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle ORM table definitions (nodes, corridors, transactions, fx_rates, liquidity_pools, stress_results, activity)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/cbdc-dashboard/src/` — React frontend components
- `artifacts/cbdc-dashboard/src/components/` — NetworkGraph, RouteOptimizer, FXRiskHeatmap, LiquidityPanel, StressTesting, SettlementLedger, TopNav, Sidebar, MetricsBar

## Architecture decisions

- Contract-first API design: OpenAPI → Orval codegen → React Query hooks + Zod schemas
- Dijkstra routing engine runs in Express, weighted by α·cost + β·FX risk + γ·time + δ·compliance
- Blockchain-inspired settlement ledger: SHA-256 chained block hashes per settled transaction
- D3.js force simulation for the live CBDC network topology graph
- All financial data persists to PostgreSQL — no ephemeral in-memory state

## Product

- **Network tab**: Live D3 force-directed graph of 7 sovereign CBDC nodes (USD/EUR/GBP/INR/SGD/CNY/AED) with 30 bilateral corridors, corridor statistics, and settlement ledger
- **Route Optimizer**: Dijkstra pathfinding with configurable α/β/γ/δ weights, top-3 alternative route comparison table, compliance-aware routing, Execute Settlement button
- **FX Risk**: 7×7 cross-currency EWMA/AR(1) risk heatmap, high-risk pairs panel, volatility regime donut chart
- **Liquidity**: Node pool tracking with utilization bars, capacity warnings, injection controls, regional node table
- **Stress Testing**: Monte Carlo simulation engine with scenario presets (baseline, FX shock, systemic default), VaR-95 metrics, resilience scoring

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after every OpenAPI spec change
- Frontend routes include `/route/optimize` (POST) mounted on the transactions router — this handles Dijkstra optimization separate from `/transactions`
- The `dark` class must be on the `<html>` element for the Tailwind dark theme to work
- D3 must be installed in `@workspace/cbdc-dashboard` — it's not in the workspace catalog

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
