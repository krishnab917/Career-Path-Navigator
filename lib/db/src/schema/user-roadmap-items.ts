import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoadmapItemsTable = pgTable("user_roadmap_items", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull().default("skill"),
  phase: text("phase").notNull().default("Now"),
  description: text("description").notNull().default(""),
  notes: text("notes").default(""),
  status: text("status").notNull().default("accepted"),
  isCompleted: boolean("is_completed").notNull().default(false),
  isUserCreated: boolean("is_user_created").notNull().default(false),
  aiMilestoneId: integer("ai_milestone_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  resources: text("resources").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserRoadmapItemSchema = createInsertSchema(userRoadmapItemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserRoadmapItem = z.infer<typeof insertUserRoadmapItemSchema>;
export type UserRoadmapItem = typeof userRoadmapItemsTable.$inferSelect;
