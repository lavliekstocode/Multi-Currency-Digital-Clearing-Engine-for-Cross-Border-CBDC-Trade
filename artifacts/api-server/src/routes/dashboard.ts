import { Router } from "express";
import { db, transactionsTable, nodesTable, corridorsTable, activityTable } from "@workspace/db";
import { sql, desc, eq } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  try {
    const [txnStats] = await db
      .select({
        total: sql<number>`count(*)`,
        settled: sql<number>`count(*) filter (where status = 'SETTLED')`,
        totalVolume: sql<number>`coalesce(sum(amount), 0)`,
        avgCost: sql<number>`coalesce(avg(cost_bps), 0)`,
        avgLatency: sql<number>`coalesce(avg(latency_s), 0)`,
        totalCost: sql<number>`coalesce(sum(cost_bps * amount / 10000), 0)`,
      })
      .from(transactionsTable);

    const [nodeCount] = await db.select({ count: sql<number>`count(*)` }).from(nodesTable).where(eq(nodesTable.status, "operational"));
    const [corridorCount] = await db.select({ count: sql<number>`count(*)` }).from(corridorsTable).where(eq(corridorsTable.status, "active"));

    const total = Number(txnStats.total) || 0;
    const settled = Number(txnStats.settled) || 0;
    const successRate = total > 0 ? (settled / total) * 100 : 100;

    res.json({
      totalTransactions: total,
      successRate: parseFloat(successRate.toFixed(1)),
      totalVolumeM: parseFloat((Number(txnStats.totalVolume) / 1_000_000).toFixed(1)),
      avgCostBps: parseFloat(Number(txnStats.avgCost).toFixed(1)),
      avgLatencyS: parseFloat(Number(txnStats.avgLatency).toFixed(1)),
      activeCorridors: Number(corridorCount.count),
      activeNodes: Number(nodeCount.count),
      totalCost: parseFloat(Number(txnStats.totalCost).toFixed(0)),
      nodeLoad: Math.min(95, 35 + total * 2),
      queueDepthMs: Math.max(8, 12 - total * 0.5),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Failed to get dashboard summary" });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const items = await db
      .select()
      .from(activityTable)
      .orderBy(desc(activityTable.timestamp))
      .limit(limit);
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to list activity");
    res.status(500).json({ error: "Failed to list activity" });
  }
});

export default router;
