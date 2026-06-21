import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { simulationSessionsTable } from "./simulation-sessions";

export const decisionsTable = pgTable("decisions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => simulationSessionsTable.id),
  stageNumber: integer("stage_number").notNull(),
  choiceId: text("choice_id").notNull(),
  choiceText: text("choice_text").notNull(),
  consequence: text("consequence").notNull(),
  scoreImpact: real("score_impact").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDecisionSchema = createInsertSchema(decisionsTable).omit({ id: true, createdAt: true });
export type InsertDecision = z.infer<typeof insertDecisionSchema>;
export type Decision = typeof decisionsTable.$inferSelect;
