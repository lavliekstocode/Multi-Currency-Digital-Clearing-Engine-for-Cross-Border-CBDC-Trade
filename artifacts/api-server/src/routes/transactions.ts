import { Router } from "express";
import { db, transactionsTable, corridorsTable, fxRatesTable, activityTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { createHash } from "crypto";

const router = Router();

// Simple Dijkstra-based route optimizer
const CCY = ["USD", "EUR", "GBP", "INR", "SGD", "CNY", "AED"];

// AML high-risk corridors
const HIGH_RISK_PAIRS = new Set(["USD-CNY", "EUR-CNY", "GBP-CNY", "INR-CNY", "SGD-CNY", "AED-CNY"]);

function compliancePenalty(route: string[]): number {
  let penalty = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const key = `${route[i]}-${route[i + 1]}`;
    const revKey = `${route[i + 1]}-${route[i]}`;
    if (HIGH_RISK_PAIRS.has(key) || HIGH_RISK_PAIRS.has(revKey)) penalty += 0.3;
  }
  return Math.min(penalty, 1.0);
}

interface EdgeMap {
  [src: string]: {
    [tgt: string]: { costBps: number; latencyS: number; liquidityM: number; fxRiskScore: number };
  };
}

async function buildGraph(): Promise<EdgeMap> {
  const corridors = await db.select().from(corridorsTable).where(eq(corridorsTable.status, "active"));
  const fxRisks = await db.select().from(fxRatesTable);
  const riskMap: Record<string, number> = {};
  for (const r of fxRisks) riskMap[`${r.srcCurrency}-${r.tgtCurrency}`] = r.riskScore;

  const graph: EdgeMap = {};
  for (const c of corridors) {
    if (!graph[c.srcCurrency]) graph[c.srcCurrency] = {};
    graph[c.srcCurrency][c.tgtCurrency] = {
      costBps: c.costBps,
      latencyS: c.latencyS,
      liquidityM: c.liquidityM,
      fxRiskScore: riskMap[`${c.srcCurrency}-${c.tgtCurrency}`] ?? 0.2,
    };
  }
  return graph;
}

function dijkstra(graph: EdgeMap, src: string, tgt: string, alpha: number, beta: number, gamma: number, delta: number) {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const n of CCY) { dist[n] = Infinity; prev[n] = null; }
  dist[src] = 0;

  while (true) {
    let u: string | null = null;
    for (const n of CCY) {
      if (!visited.has(n) && dist[n] < Infinity && (u === null || dist[n] < dist[u!])) u = n;
    }
    if (!u || u === tgt) break;
    visited.add(u);

    const neighbors = graph[u] ?? {};
    for (const [v, edge] of Object.entries(neighbors)) {
      const tempRoute = [...getPath(prev, src, u), u, v];
      const compPenalty = compliancePenalty(tempRoute) * delta;
      const weight = alpha * (edge.costBps / 20) + beta * edge.fxRiskScore + gamma * (edge.latencyS / 90) + compPenalty;
      const newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = u;
      }
    }
  }

  return { dist, prev };
}

function getPath(prev: Record<string, string | null>, src: string, end: string): string[] {
  const path: string[] = [];
  let cur: string | null = end;
  while (cur !== null && cur !== src) {
    path.unshift(cur);
    cur = prev[cur] ?? null;
  }
  return path;
}

function buildPath(prev: Record<string, string | null>, src: string, tgt: string): string[] {
  const path: string[] = [];
  let cur: string | null = tgt;
  while (cur !== null) {
    path.unshift(cur);
    if (cur === src) break;
    cur = prev[cur] ?? null;
  }
  return path.length > 1 ? path : [];
}

async function computeRouteMetrics(route: string[], graph: EdgeMap) {
  let totalCostBps = 0;
  let totalLatencyS = 0;
  let minLiquidityM = Infinity;
  let fxRiskSum = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const edge = graph[route[i]]?.[route[i + 1]];
    if (!edge) return null;
    totalCostBps += edge.costBps;
    totalLatencyS += edge.latencyS;
    minLiquidityM = Math.min(minLiquidityM, edge.liquidityM);
    fxRiskSum += edge.fxRiskScore;
  }

  const fxRiskScore = route.length > 1 ? fxRiskSum / (route.length - 1) : 0;
  return { totalCostBps, totalLatencyS, minLiquidityM, fxRiskScore };
}

function generateTxHash(): string {
  const rand = Math.random().toString(36).substring(2, 18) + Date.now().toString(36);
  return "0x" + createHash("sha256").update(rand).digest("hex").substring(0, 40);
}

function generateBlockHash(data: string, prevHash?: string | null): string {
  const input = (prevHash ?? "0x" + "0".repeat(64)) + data;
  return "0x" + createHash("sha256").update(input).digest("hex");
}

// POST /route/optimize
router.post("/optimize", async (req, res) => {
  try {
    const {
      srcCurrency, tgtCurrency, amount,
      purposeCode = "Trade Settlement (T1)",
      entityType = "Tier 1 Commercial Bank",
      alphaWeight = 0.35, betaWeight = 0.25, gammaWeight = 0.20, deltaWeight = 0.20,
    } = req.body as {
      srcCurrency: string; tgtCurrency: string; amount: number;
      purposeCode?: string; entityType?: string;
      alphaWeight?: number; betaWeight?: number; gammaWeight?: number; deltaWeight?: number;
    };

    if (!srcCurrency || !tgtCurrency || !amount) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    if (srcCurrency === tgtCurrency) {
      res.status(400).json({ error: "Source and target must differ" });
      return;
    }

    const graph = await buildGraph();
    const { dist, prev } = dijkstra(graph, srcCurrency, tgtCurrency, alphaWeight, betaWeight, gammaWeight, deltaWeight);

    const optimalPath = buildPath(prev, srcCurrency, tgtCurrency);
    if (!optimalPath.length) {
      res.status(400).json({ error: "No route found" });
      return;
    }

    const metrics = await computeRouteMetrics(optimalPath, graph);
    if (!metrics) {
      res.status(400).json({ error: "Route metrics unavailable" });
      return;
    }

    const compScore = compliancePenalty(optimalPath);
    const compositeScore = parseFloat((dist[tgtCurrency] ?? 0).toFixed(4));

    // Generate alternative paths (k-shortest approximation)
    const alternatives = [];
    const allCCY = CCY.filter(c => c !== srcCurrency && c !== tgtCurrency);
    for (const mid of allCCY.slice(0, 3)) {
      if (graph[srcCurrency]?.[mid] && graph[mid]?.[tgtCurrency]) {
        const altPath = [srcCurrency, mid, tgtCurrency];
        const altMetrics = await computeRouteMetrics(altPath, graph);
        if (altMetrics) {
          const altComp = compliancePenalty(altPath);
          const altScore = alphaWeight * (altMetrics.totalCostBps / 20) + betaWeight * altMetrics.fxRiskScore + gammaWeight * (altMetrics.totalLatencyS / 90) + altComp * deltaWeight;
          alternatives.push({
            path: altPath,
            latencyS: altMetrics.totalLatencyS,
            liquidityM: altMetrics.minLiquidityM,
            totalFeesBps: altMetrics.totalCostBps,
            status: altMetrics.minLiquidityM > 5000 ? "optimal" : "limited_liquidity",
            compositeScore: parseFloat(altScore.toFixed(4)),
          });
        }
      }
    }

    res.json({
      optimalRoute: optimalPath,
      compositeScore,
      costBps: parseFloat(metrics.totalCostBps.toFixed(2)),
      latencyS: parseFloat(metrics.totalLatencyS.toFixed(1)),
      fxRiskScore: parseFloat(metrics.fxRiskScore.toFixed(4)),
      complianceScore: parseFloat(compScore.toFixed(4)),
      alternativeRoutes: alternatives,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to optimize route");
    res.status(500).json({ error: "Route optimization failed" });
  }
});

// GET /transactions
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as string | undefined;

    let query = db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt)).limit(limit);
    const txns = await query;
    res.json(status ? txns.filter(t => t.status === status) : txns);
  } catch (err) {
    req.log.error({ err }, "Failed to list transactions");
    res.status(500).json({ error: "Failed to list transactions" });
  }
});

// POST /transactions
router.post("/", async (req, res) => {
  try {
    const {
      srcCurrency, tgtCurrency, amount, purposeCode, entityType,
      alphaWeight = 0.35, betaWeight = 0.25, gammaWeight = 0.20, deltaWeight = 0.20,
    } = req.body as {
      srcCurrency: string; tgtCurrency: string; amount: number;
      purposeCode?: string; entityType?: string;
      alphaWeight?: number; betaWeight?: number; gammaWeight?: number; deltaWeight?: number;
    };

    const txHash = generateTxHash();
    const [txn] = await db.insert(transactionsTable).values({
      txHash,
      srcCurrency,
      tgtCurrency,
      amount,
      purposeCode: purposeCode ?? "Trade Settlement (T1)",
      entityType: entityType ?? "Tier 1 Commercial Bank",
      status: "INITIATED",
    }).returning();

    res.status(201).json(txn);
  } catch (err) {
    req.log.error({ err }, "Failed to create transaction");
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// GET /transactions/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id));
    if (!txn) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(txn);
  } catch (err) {
    req.log.error({ err }, "Failed to get transaction");
    res.status(500).json({ error: "Failed to get transaction" });
  }
});

// POST /transactions/:id/settle
router.post("/:id/settle", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [txn] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id));
    if (!txn) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    if (txn.status === "SETTLED") {
      res.json(txn);
      return;
    }

    const graph = await buildGraph();
    const { dist, prev } = dijkstra(graph, txn.srcCurrency, txn.tgtCurrency, 0.35, 0.25, 0.20, 0.20);
    const route = buildPath(prev, txn.srcCurrency, txn.tgtCurrency);

    const metrics = route.length ? await computeRouteMetrics(route, graph) : null;
    const compScore = route.length ? compliancePenalty(route) : 0;
    const compositeScore = dist[txn.tgtCurrency] ?? 0;

    // Find previous block hash
    const [lastTxn] = await db.select().from(transactionsTable)
      .where(eq(transactionsTable.status, "SETTLED"))
      .orderBy(desc(transactionsTable.settledAt))
      .limit(1);

    const prevBlockHash = lastTxn?.blockHash ?? null;
    const blockHash = generateBlockHash(`${txn.txHash}${txn.amount}${route.join("->")}`, prevBlockHash);

    const [updated] = await db.update(transactionsTable).set({
      status: "SETTLED",
      route: route.join(" → "),
      costBps: metrics?.totalCostBps ?? 10,
      latencyS: metrics?.totalLatencyS ?? 40,
      fxRiskScore: metrics?.fxRiskScore ?? 0.2,
      complianceScore: compScore,
      compositeScore,
      blockHash,
      prevBlockHash,
      settledAt: new Date(),
      amountConverted: txn.amount * (graph[txn.srcCurrency]?.[txn.tgtCurrency]?.fxRiskScore ?? 1),
    }).where(eq(transactionsTable.id, id)).returning();

    // Log to activity feed
    await db.insert(activityTable).values({
      type: "settlement",
      message: `${txn.srcCurrency} → ${route.join(" → ")} → ${txn.tgtCurrency} settled`,
      srcCurrency: txn.srcCurrency,
      tgtCurrency: txn.tgtCurrency,
      amount: txn.amount,
      status: "SETTLED",
      txHash: txn.txHash,
    });

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to settle transaction");
    res.status(500).json({ error: "Failed to settle transaction" });
  }
});

export { router as transactionsRouter, router as routeRouter };
export default router;
