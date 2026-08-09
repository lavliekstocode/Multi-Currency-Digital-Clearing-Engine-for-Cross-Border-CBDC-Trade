import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const nodesTable = pgTable("nodes", {
  id: serial("id").primaryKey(),
  currency: text("currency").notNull().unique(),
  name: text("name").notNull(),
  credibility: real("credibility").notNull(),
  gdp: real("gdp").notNull(),
  amlRisk: integer("aml_risk").notNull().default(0),
  dailyVolCapM: real("daily_vol_cap_m").notNull(),
  status: text("status").notNull().default("operational"),
  color: text("color"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNodeSchema = createInsertSchema(nodesTable).omit({ id: true, createdAt: true });
export type InsertNode = z.infer<typeof insertNodeSchema>;
export type Node = typeof nodesTable.$inferSelect;
