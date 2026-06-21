import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roadmapMilestonesTable = pgTable("roadmap_milestones", {
  id: serial("id").primaryKey(),
  careerCategory: text("career_category").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  timeframe: text("timeframe").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("recommended"),
  phase: text("phase").notNull(),
  phaseTimeframe: text("phase_timeframe").notNull(),
  phaseFocus: text("phase_focus").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  resources: text("resources").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRoadmapMilestoneSchema = createInsertSchema(roadmapMilestonesTable).omit({ id: true, createdAt: true });
export type InsertRoadmapMilestone = z.infer<typeof insertRoadmapMilestoneSchema>;
export type RoadmapMilestone = typeof roadmapMilestonesTable.$inferSelect;
