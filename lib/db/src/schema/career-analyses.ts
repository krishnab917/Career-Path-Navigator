import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { simulationSessionsTable } from "./simulation-sessions";

export const careerAnalysesTable = pgTable("career_analyses", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => simulationSessionsTable.id).unique(),
  primaryCareer: text("primary_career").notNull(),
  primaryCareerCategory: text("primary_career_category").notNull(),
  secondaryCareer: text("secondary_career").notNull(),
  secondaryCareerCategory: text("secondary_career_category").notNull(),
  confidenceScore: real("confidence_score").notNull(),
  behavioralInsights: text("behavioral_insights").array().notNull().default([]),
  strengths: text("strengths").array().notNull().default([]),
  growthAreas: text("growth_areas").array().notNull().default([]),
  summary: text("summary").notNull(),
  decisionPatterns: text("decision_patterns").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCareerAnalysisSchema = createInsertSchema(careerAnalysesTable).omit({ id: true, createdAt: true });
export type InsertCareerAnalysis = z.infer<typeof insertCareerAnalysisSchema>;
export type CareerAnalysis = typeof careerAnalysesTable.$inferSelect;
