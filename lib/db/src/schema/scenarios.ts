import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { simulationsTable } from "./simulations";

/**
 * Scenario represents a single decision point in a branching career simulation.
 * Each scenario has choices that lead to different scenarios, creating a graph structure.
 */
export const scenariosTable = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").notNull().references(() => simulationsTable.id),
  scenarioKey: text("scenario_key").notNull(), // Unique identifier within the simulation (e.g., "se_1", "se_1_a")
  title: text("title").notNull(),
  description: text("description").notNull(),
  stageNumber: integer("stage_number").notNull(), // Logical stage for UI display
  // JSON array of choice objects, each with id, text, nextScenarioKey, metricsImpact, consequence
  choices: jsonb("choices").notNull().default([]),
  // JSON object describing how this scenario impacts metrics
  metricsImpact: jsonb("metrics_impact").notNull().default({}),
  // Optional narrative consequence text shown after a choice is made
  consequence: text("consequence"),
  // Optional citation or source for realism
  citation: text("citation"),
  // Time limit in seconds for this scenario (0 = no limit)
  timeLimit: integer("time_limit").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertScenarioSchema = createInsertSchema(scenariosTable).omit({ id: true, createdAt: true });
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenariosTable.$inferSelect;

/**
 * Choice represents a single decision option within a scenario.
 * This is a denormalized structure for performance and simplicity.
 */
export const choiceSchema = z.object({
  id: z.string(), // Unique within the scenario
  text: z.string(),
  nextScenarioKey: z.string(), // Key of the next scenario, or "end" for final scenarios
  consequence: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  metricsImpact: z.record(z.number()).optional(), // e.g., { "Product Quality": -10, "Team Morale": 5 }
});

export type Choice = z.infer<typeof choiceSchema>;

/**
 * MetricsDefinition describes the metrics tracked for a specific career simulation.
 */
export const metricsDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  initialValue: z.number().default(50), // 0-100 scale
  minValue: z.number().default(0),
  maxValue: z.number().default(100),
});

export type MetricsDefinition = z.infer<typeof metricsDefinitionSchema>;

/**
 * Predefined metric sets for common careers.
 */
export const CAREER_METRICS = {
  software_engineer: [
    { name: "Product Quality", description: "How well the software meets user needs", initialValue: 50 },
    { name: "Technical Debt", description: "Accumulated shortcuts and code complexity", initialValue: 30 },
    { name: "Team Morale", description: "Team satisfaction and collaboration", initialValue: 60 },
    { name: "Deadline Progress", description: "On-time delivery of features", initialValue: 50 },
    { name: "User Satisfaction", description: "Customer happiness with the product", initialValue: 55 },
  ],
  doctor: [
    { name: "Patient Outcomes", description: "Health improvement of patients", initialValue: 60 },
    { name: "Stress", description: "Personal stress level", initialValue: 40 },
    { name: "Hospital Reputation", description: "Hospital's standing in the community", initialValue: 55 },
    { name: "Staff Capacity", description: "Workload management", initialValue: 50 },
    { name: "Time Management", description: "Ability to balance work and personal life", initialValue: 45 },
  ],
  entrepreneur: [
    { name: "Revenue", description: "Monthly recurring revenue", initialValue: 10 },
    { name: "Burn Rate", description: "Monthly cash burn", initialValue: 50 },
    { name: "Customer Satisfaction", description: "Customer happiness and retention", initialValue: 55 },
    { name: "Investor Confidence", description: "Investor belief in the company", initialValue: 40 },
    { name: "Growth", description: "User/customer growth rate", initialValue: 30 },
  ],
  data_scientist: [
    { name: "Model Accuracy", description: "Predictive model performance", initialValue: 55 },
    { name: "Insight Quality", description: "Actionable insights generated", initialValue: 50 },
    { name: "Stakeholder Trust", description: "Trust from business stakeholders", initialValue: 50 },
    { name: "Data Quality", description: "Quality and cleanliness of data pipelines", initialValue: 45 },
    { name: "Project Velocity", description: "Speed of project delivery", initialValue: 50 },
  ],
  teacher: [
    { name: "Student Learning", description: "Student academic progress", initialValue: 55 },
    { name: "Class Engagement", description: "Student engagement and participation", initialValue: 50 },
    { name: "Work-Life Balance", description: "Personal well-being and balance", initialValue: 45 },
    { name: "Parent Satisfaction", description: "Parent confidence in the teacher", initialValue: 55 },
    { name: "Classroom Culture", description: "Positive, inclusive classroom environment", initialValue: 60 },
  ],
};
