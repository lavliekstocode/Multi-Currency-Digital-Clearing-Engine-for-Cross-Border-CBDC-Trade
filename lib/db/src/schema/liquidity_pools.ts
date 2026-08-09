import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const liquidityPoolsTable = pgTable("liquidity_pools", {
  id: serial("id").primaryKey(),
  currency: text("currency").notNull().unique(),
  totalLiquidityB: real("total_liquidity_b").notNull(),
  availableLiquidityB: real("available_liquidity_b").notNull(),
  reservedLiquidityB: real("reserved_liquidity_b").notNull(),
  utilizationPct: real("utilization_pct").notNull(),
  efficiencyScore: real("efficiency_score").notNull().default(0.9),
  status: text("status").notNull().default("healthy"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLiquidityPoolSchema = createInsertSchema(liquidityPoolsTable).omit({ id: true });
export type InsertLiquidityPool = z.infer<typeof insertLiquidityPoolSchema>;
export type LiquidityPool = typeof liquidityPoolsTable.$inferSelect;
