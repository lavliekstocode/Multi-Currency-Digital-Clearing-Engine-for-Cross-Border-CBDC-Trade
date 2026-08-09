import { Router } from "express";
import { db, corridorsTable } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const corridors = await db.select().from(corridorsTable).orderBy(corridorsTable.srcCurrency);
    res.json(corridors);
  } catch (err) {
    req.log.error({ err }, "Failed to list corridors");
    res.status(500).json({ error: "Failed to list corridors" });
  }
});

export default router;
