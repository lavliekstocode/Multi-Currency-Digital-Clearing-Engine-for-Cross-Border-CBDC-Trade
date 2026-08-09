import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fxRatesTable = pgTable("fx_rates", {
  id: serial("id").primaryKey(),
  srcCurrency: text("src_currency").notNull(),
  tgtCurrency: text("tgt_currency").notNull(),
  rate: real("rate").notNull(),
  ewmaVol: real("ewma_vol").notNull().default(0.05),
  ar1Forecast: real("ar1_forecast").notNull().default(0.05),
  riskScore: real("risk_score").notNull().default(0.2),
  regime: text("regime").notNull().default("low"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFxRateSchema = createInsertSchema(fxRatesTable).omit({ id: true });
export type InsertFxRate = z.infer<typeof insertFxRateSchema>;
export type FxRate = typeof fxRatesTable.$inferSelect;
