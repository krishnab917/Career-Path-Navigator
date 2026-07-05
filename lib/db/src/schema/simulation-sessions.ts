import { pgTable, text, serial, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { simulationsTable } from "./simulations";
import { profilesTable } from "./profiles";

export const simulationSessionsTable = pgTable("simulation_sessions", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").notNull().references(() => simulationsTable.id),
  profileId: integer("profile_id").notNull().references(() => profilesTable.id),
  status: text("status").notNull().default("active"),
  currentStage: integer("current_stage").notNull().default(1),
  totalStages: integer("total_stages").notNull().default(5),
  score: real("score").notNull().default(0),
  // Behavioral metrics from simulation choices
  metricsData: jsonb("metrics_data").notNull().default({
    analyticalThinking: 50,
    communication: 50,
    problemSolving: 50,
    leadership: 50,
    adaptability: 50,
  }),
  // Career-specific metrics (e.g., Product Quality, Team Morale for Software Engineer)
  careerMetrics: jsonb("career_metrics").notNull().default({}),
  // Current scenario key in the branching tree
  currentScenarioKey: text("current_scenario_key").notNull().default("start"),
  // History of decisions made: array of { scenarioKey, choiceId, consequence, timestamp }
  decisionHistory: jsonb("decision_history").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertSimulationSessionSchema = createInsertSchema(simulationSessionsTable).omit({ id: true, createdAt: true });
export type InsertSimulationSession = z.infer<typeof insertSimulationSessionSchema>;
export type SimulationSession = typeof simulationSessionsTable.$inferSelect;

// Decision history entry
export const decisionHistoryEntrySchema = z.object({
  scenarioKey: z.string(),
  choiceId: z.string(),
  choiceText: z.string(),
  consequence: z.string().optional(),
  metricsImpactApplied: z.record(z.string(), z.number()).optional(),
  timestamp: z.string().datetime(),
});

export type DecisionHistoryEntry = z.infer<typeof decisionHistoryEntrySchema>;
