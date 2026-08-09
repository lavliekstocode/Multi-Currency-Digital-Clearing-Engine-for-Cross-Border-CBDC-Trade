import { Router } from "express";
import { db, liquidityPoolsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/nodes", async (req, res) => {
  try {
    const pools = await db.select().from(liquidityPoolsTable).orderBy(liquidityPoolsTable.currency);
    res.json(pools);
  } catch (err) {
    req.log.error({ err }, "Failed to list node liquidity");
    res.status(500).json({ error: "Failed to list node liquidity" });
  }
});

router.post("/inject", async (req, res) => {
  try {
    const { currency, amountB } = req.body as { currency: string; amountB: number };
    if (!currency || !amountB || amountB <= 0) {
      res.status(400).json({ error: "Invalid injection parameters" });
      return;
    }
    const [pool] = await db
      .select()
      .from(liquidityPoolsTable)
      .where(eq(liquidityPoolsTable.currency, currency));
    if (!pool) {
      res.status(404).json({ error: "Pool not found" });
      return;
    }

    const newTotal = pool.totalLiquidityB + amountB;
    const newAvailable = pool.availableLiquidityB + amountB;
    const newUtilization = pool.reservedLiquidityB / newTotal * 100;

    const [updated] = await db
      .update(liquidityPoolsTable)
      .set({
        totalLiquidityB: newTotal,
        availableLiquidityB: newAvailable,
        utilizationPct: newUtilization,
        status: newUtilization > 80 ? "high_utilization" : "healthy",
      })
      .where(eq(liquidityPoolsTable.currency, currency))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to inject liquidity");
    res.status(500).json({ error: "Failed to inject liquidity" });
  }
});

export default router;
