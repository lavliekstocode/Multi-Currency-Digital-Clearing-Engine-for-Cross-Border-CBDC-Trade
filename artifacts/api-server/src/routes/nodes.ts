import { Router } from "express";
import { db, nodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const nodes = await db.select().from(nodesTable).orderBy(nodesTable.currency);
    res.json(nodes);
  } catch (err) {
    req.log.error({ err }, "Failed to list nodes");
    res.status(500).json({ error: "Failed to list nodes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [node] = await db.select().from(nodesTable).where(eq(nodesTable.id, id));
    if (!node) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(node);
  } catch (err) {
    req.log.error({ err }, "Failed to get node");
    res.status(500).json({ error: "Failed to get node" });
  }
});

export default router;
