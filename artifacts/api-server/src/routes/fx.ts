import { Router } from "express";
import { db, fxRatesTable } from "@workspace/db";

const router = Router();

router.get("/rates", async (req, res) => {
  try {
    const rates = await db.select().from(fxRatesTable).orderBy(fxRatesTable.srcCurrency);
    res.json(rates);
  } catch (err) {
    req.log.error({ err }, "Failed to list FX rates");
    res.status(500).json({ error: "Failed to list FX rates" });
  }
});

router.get("/risk", async (req, res) => {
  try {
    const rates = await db.select().from(fxRatesTable).orderBy(fxRatesTable.srcCurrency);
    const riskData = rates.map(r => ({
      srcCurrency: r.srcCurrency,
      tgtCurrency: r.tgtCurrency,
      riskScore: r.riskScore,
      ewmaVol: r.ewmaVol,
      ar1Forecast: r.ar1Forecast,
      regime: r.regime,
    }));
    res.json(riskData);
  } catch (err) {
    req.log.error({ err }, "Failed to list FX risk");
    res.status(500).json({ error: "Failed to list FX risk" });
  }
});

export default router;
