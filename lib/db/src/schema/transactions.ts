import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash"),
  srcCurrency: text("src_currency").notNull(),
  tgtCurrency: text("tgt_currency").notNull(),
  amount: real("amount").notNull(),
  amountConverted: real("amount_converted"),
  purposeCode: text("purpose_code"),
  entityType: text("entity_type"),
  status: text("status").notNull().default("INITIATED"),
  route: text("route"),
  costBps: real("cost_bps"),
  latencyS: real("latency_s"),
  fxRiskScore: real("fx_risk_score"),
  complianceScore: real("compliance_score"),
  compositeScore: real("composite_score"),
  blockHash: text("block_hash"),
  prevBlockHash: text("prev_block_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  settledAt: timestamp("settled_at", { withTimezone: true }),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
