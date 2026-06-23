import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const simulationsTable = pgTable("simulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  careerCategory: text("career_category").notNull(),
  difficulty: text("difficulty").notNull().default("intermediate"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(20),
  description: text("description").notNull(),
  tagline: text("tagline"),
  skills: text("skills").array().notNull().default([]),
  stages: integer("stages").notNull().default(5),
  completionCount: integer("completion_count").notNull().default(0),
  coverColor: text("cover_color"),
  // JSON blob with all scenario definitions
  scenariosData: jsonb("scenarios_data").notNull().default([]),
  // JSON array of career-specific metrics definitions
  metricsDefinition: jsonb("metrics_definition").notNull().default([]),
  // Starting scenario key for this simulation
  startingScenarioKey: text("starting_scenario_key").notNull().default("start"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSimulationSchema = createInsertSchema(simulationsTable).omit({ id: true, createdAt: true });
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulationsTable.$inferSelect;

// Branching scenario data structure
export const branchingScenarioSchema = z.object({
  scenarioKey: z.string(),
  title: z.string(),
  description: z.string(),
  stageNumber: z.number(),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string(),
    nextScenarioKey: z.string(),
    consequence: z.string().optional(),
    riskLevel: z.enum(["low", "medium", "high"]).optional(),
    metricsImpact: z.record(z.number()).optional(),
  })),
  metricsImpact: z.record(z.number()).optional(),
  consequence: z.string().optional(),
  citation: z.string().optional(),
  timeLimit: z.number().optional(),
});

export type BranchingScenario = z.infer<typeof branchingScenarioSchema>;
