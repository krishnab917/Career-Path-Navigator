import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  category: text("category").notNull(),
  relevanceScore: real("relevance_score").notNull().default(0.8),
  whyItMatches: text("why_it_matches").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  applicationDeadline: text("application_deadline").notNull(),
  description: text("description").notNull(),
  stipend: text("stipend"),
  location: text("location"),
  url: text("url"),
  careerCategories: text("career_categories").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOpportunitySchema = createInsertSchema(opportunitiesTable).omit({ id: true, createdAt: true });
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunitiesTable.$inferSelect;
