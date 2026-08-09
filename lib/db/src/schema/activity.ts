import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const activityTable = pgTable("activity", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("settlement"),
  message: text("message").notNull(),
  srcCurrency: text("src_currency").notNull(),
  tgtCurrency: text("tgt_currency").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull().default("SETTLED"),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activityTable).omit({ id: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activityTable.$inferSelect;
