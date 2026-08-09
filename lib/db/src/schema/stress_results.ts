import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const stressResultsTable = pgTable("stress_results", {
  id: serial("id").primaryKey(),
  scenario: text("scenario").notNull(),
  trials: integer("trials").notNull().default(1000),
  successRate: real("success_rate").notNull(),
  varCost: real("var_cost").notNull(),
  avgLatencyS: real("avg_latency_s").notNull(),
  resilienceScore: text("resilience_score").notNull().default("A+"),
  baselineSuccessRate: real("baseline_success_rate"),
  baselineVarCost: real("baseline_var_cost"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStressResultSchema = createInsertSchema(stressResultsTable).omit({ id: true, createdAt: true });
export type InsertStressResult = z.infer<typeof insertStressResultSchema>;
export type StressResult = typeof stressResultsTable.$inferSelect;
