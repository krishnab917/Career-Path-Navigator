import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  gradeLevel: text("grade_level"),
  academicInterests: text("academic_interests").array().notNull().default([]),
  strongestSubjects: text("strongest_subjects").array().notNull().default([]),
  activities: text("activities").array().notNull().default([]),
  competitions: text("competitions").array().notNull().default([]),
  projects: text("projects").array().notNull().default([]),
  goals: text("goals").array().notNull().default([]),
  careerInterests: text("career_interests").array().notNull().default([]),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
