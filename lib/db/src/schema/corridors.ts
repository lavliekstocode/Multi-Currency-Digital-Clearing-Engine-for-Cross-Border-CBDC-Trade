import { pgTable, serial, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const corridorsTable = pgTable("corridors", {
  id: serial("id").primaryKey(),
  srcCurrency: text("src_currency").notNull(),
  tgtCurrency: text("tgt_currency").notNull(),
  fxRate: real("fx_rate").notNull(),
  costBps: real("cost_bps").notNull(),
  latencyS: real("latency_s").notNull(),
  liquidityM: real("liquidity_m").notNull(),
  friction: real("friction").notNull(),
  pvp: boolean("pvp").notNull().default(true),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCorridorSchema = createInsertSchema(corridorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCorridor = z.infer<typeof insertCorridorSchema>;
export type Corridor = typeof corridorsTable.$inferSelect;
