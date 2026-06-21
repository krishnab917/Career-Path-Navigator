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
  metricsData: jsonb("metrics_data").notNull().default({
    analyticalThinking: 50,
    communication: 50,
    problemSolving: 50,
    leadership: 50,
    adaptability: 50,
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertSimulationSessionSchema = createInsertSchema(simulationSessionsTable).omit({ id: true, createdAt: true });
export type InsertSimulationSession = z.infer<typeof insertSimulationSessionSchema>;
export type SimulationSession = typeof simulationSessionsTable.$inferSelect;
